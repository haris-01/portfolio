# Architecture

How the scroll-driven 3D world is put together, and why it's built this way.

## The two-layer model

Every page is two layers stacked on top of each other:

1. **3D layer** — one fixed-position `<Canvas>`
   ([components/world/WorldCanvas.tsx](../components/world/WorldCanvas.tsx)).
   It fills the viewport, never scrolls, and renders whichever scene is
   active. The camera moves *through* the world; the world itself doesn't
   move with the page.
2. **DOM layer** — ordinary React/Tailwind markup (nav, headings, case-study
   text) rendered on top of the canvas. This is what search engines and
   screen readers see, and it's where all real content lives.

The 3D layer is the cinematic medium. The DOM layer is the information layer.
Nothing important should ever exist *only* inside the canvas — see
[Accessibility](#accessibility--fallbacks) below.

## Why scroll state is a mutable singleton, not React state

[lib/scrollState.ts](../lib/scrollState.ts) exports one mutable object:

```ts
export const scrollState = { progress: 0 };
```

A single `ScrollTrigger` (created in [pages/index.tsx](../pages/index.tsx),
`scrub: true`, tied to a tall spacer div) writes to it on every scroll tick:

```ts
onUpdate: (self) => { scrollState.progress = self.progress; }
```

Everything else — the camera, object animations, DOM text reveals — **reads**
`scrollState.progress` instead of subscribing to scroll events or React state.
Camera and geometry read it inside R3F's `useFrame` (runs every rendered
frame, outside React's render cycle); DOM text reads it via
`requestAnimationFrame`. Nothing re-renders on scroll — scrolling is a 60fps
event and React re-renders are not free, so this keeps the whole experience
off the React render path entirely.

**The rule when adding new scroll-driven behavior: read `scrollState.progress`
in a frame loop. Do not create a second `ScrollTrigger`** — an earlier version
of the intro text reveal did exactly that (a `ScrollTrigger` nested inside a
child component, using a `'75% top'` start position) and the scrub silently
never advanced. Chasing down why cost real time; the fix was deleting the
second trigger and reading the shared singleton instead. One `ScrollTrigger`
writes; everything else reads.

## Camera choreography

[components/world/ScrollRig.tsx](../components/world/ScrollRig.tsx) owns the
camera. The path is a sequence of **waypoints**, one entry per scene
boundary (nine scenes → ten waypoints: `{ at: 0, ... }` through `{ at: 1,
... }`, with `{ at: 1/9, ... }`, `{ at: 2/9, ... }`, ... at every boundary in
between) — outside → workshop entrance → desk → hallway entrance → lab
entrance → engineering entrance → AI lab entrance → experiment room entrance
→ white room entrance → last landscape frame. On every frame, `ScrollRig`:

1. Finds whichever two waypoints bracket the current `scrollState.progress`.
2. Eases the local position between them through `easeInOutCubic` (never a
   linear or sudden move — see spec §21, "Camera Principles").
3. Lerps a *target* position/look-at between those two waypoints using the
   eased value.
4. Smooths the *current* position/look-at toward that target using a
   frame-rate-independent lerp (`1 - Math.pow(0.001, delta)`), so the camera
   reads as fluid even though the underlying scrub value can be jumpy (fast
   flicks, trackpad inertia, etc).

Adding a new scene means adding one more waypoint at its boundary — the
interpolation logic itself doesn't change. Mobile gets its own waypoint set
(`WAYPOINTS_MOBILE`, generally closer) plus a wider FOV set on the `<Canvas>`
in `WorldCanvas.tsx` — portrait viewports need a different composition, not
just a scaled-down desktop shot. See
[components/world/WorldCanvas.tsx](../components/world/WorldCanvas.tsx).

`lib/scrollState.ts` exports `SCENE_BOUNDS` — nine equal ninths, one per
scene (`intro`, `desk`, `hallway`, `lab`, `engineering`, `aiLab`,
`experiment`, `whiteRoom`, `landscape`) — and `localProgress(global, start,
end)`, which every scene and DOM-text
component uses to map the shared
global progress into its own local `0–1` range — see how `DeskScene`'s
monitor-wake `useFrame` and `DeskText`'s reveal timing both do this. **A
scene's threshold logic must always go through `localProgress` against its
own `SCENE_BOUNDS` entry, never raw `scrollState.progress`** — an early
version of the intro door-open animation used a raw `0.8–1.0` threshold that
was correct when intro was the only scene, then silently landed inside the
*desk* scene's range once Scene 02 shrank intro's share of the global
timeline. The bug produced no error; the door just opened at the wrong
moment. Fixed by rebasing the threshold onto `localProgress(scrollState.progress,
SCENE_BOUNDS.intro[0], SCENE_BOUNDS.intro[1])` — see `IntroScene.tsx`'s
`Workshop` component.

Camera waypoints are also easy to get wrong at a scene's own geometry: the
hallway's final `look` target originally pointed a few units *past* the end
wall rather than at it, and the end wall's material was a near-black hex
literal — together those made the final frame of the scroll render as solid
black even though the geometry and lighting were technically all present and
correct. Always screenshot-verify a new waypoint's exact endpoint (`progress
= 1` for the last leg), not just mid-transition — see
[ADDING_A_SCENE.md](ADDING_A_SCENE.md) §7.

Same category of bug showed up again in the lab: its pods alternate sides
(`podPosition()` in
[labLayout.ts](../components/world/scenes/labLayout.ts) offsets `x` by
`±5`), but the first version of the final waypoint looked straight down the
room's centerline (`x: 0`). The last pod was almost entirely out of frame —
not because it was unlit, but because the camera was pointed at empty wall
next to it. Fixed by deriving the waypoint's `x` directly from
`podPosition(POD_COUNT - 1)` instead of a hardcoded `0`. **When a scene's
geometry isn't centered on the room's axis, the camera waypoint has to know
that — derive it from the same layout constants the geometry uses, don't
eyeball a position.** Scene 05's engineering room reuses the identical
alternating-side layout (`nodePosition()` in
[engineeringLayout.ts](../components/world/scenes/engineeringLayout.ts)) and
got its final waypoint's `x` right on the first attempt by following this
same rule — screenshot-verify the pattern holds, don't just trust it because
it worked last time. Scene 06's AI lab pushes the rule one step further:
`stagePosition()` in
[aiLabLayout.ts](../components/world/scenes/aiLabLayout.ts) returns a full
`[x, y, z]` (not just `x, z` like earlier layouts) since markers drift in
height too, so the final waypoint derives all three axes from
`stagePosition(STAGE_COUNT - 1)` rather than assuming `y` is constant. Any
layout function a scene introduces should be treated as the single source of
truth for that scene's positions — camera waypoints read from it, never
duplicate or approximate its output.

## Two DOM-text reveal shapes, and a bug that recurs across both

Text overlays come in two shapes. **Cyclic** (`HallwayText`, `EngineeringText`,
`AiLabText`, `ExperimentText`) reveal one item at a time as the camera passes
a series of markers; each item's own fade-out (built into the symmetric
`fadeIn`/`fadeOut` window math) naturally clears it before the next item
appears, so nothing extra is needed at the scene boundary. **Single-reveal**
(`IntroText`, `DeskText`, `WhiteRoomText`) reveal once and hold — there's no
"next item" to trigger a fade, so without an explicit fade-out they stay at
full opacity forever, including on top of whatever the next scene reveals.
`DeskText` needed this fix when Scene 03 was added (see the desk/hallway
overlap in an earlier revision of this file's history); `WhiteRoomText`
needed the identical fix when Scene 09 was added — its statement was still
on screen, opacity 1, when the landscape's closing CTA faded in on top of
it. Both fixed the same way: compute the *next* scene's `localProgress` and
multiply the reveal by `(1 - fadeOut)`. **Any new single-reveal text
component needs this from the start, not as an after-the-fact patch** — check
whether the text is cyclic or single-reveal before writing it, and if
single-reveal, write the fade-out in the same pass as the reveal.

## Theming

[lib/theme.ts](../lib/theme.ts) is the single source of truth for every
color in the app. `THEME.core` mirrors the design spec's base palette and is
re-exported into Tailwind (`tailwind.config.ts` imports `THEME` directly, so
`bg-background`/`text-accent`/etc. and the 3D materials can never drift
apart); `THEME.material` covers a small set of 3D-only extensions (wood,
foliage, warm light color, ...). No component — DOM or 3D — should ever
write a hex literal directly; import `THEME` instead. To re-theme the site
(e.g. change the accent color), edit `lib/theme.ts` once.

## Object animation

Objects animate by reading `scrollState.progress` directly inside their own
`useFrame`, scoped to whatever sub-range of progress is meaningful to them.
Example — the workshop door in
[IntroScene.tsx](../components/world/scenes/IntroScene.tsx) only starts
opening in the final 20% of the approach:

```ts
useFrame(() => {
  const openAmount = Math.min(Math.max((scrollState.progress - 0.8) / 0.2, 0), 1);
  doorHinge.current.rotation.y = -easeInOutCubic(openAmount) * (Math.PI * 0.6);
});
```

Per spec §22: every animation must have a reason (a door opens because you're
arriving; nothing spins or floats without cause). The engineering room's
`Packet` component ([EngineeringScene.tsx](../components/world/scenes/EngineeringScene.tsx))
is a continuous version of the same idea: instead of only lighting up nodes
as they're passed, a small sphere glides the entire length of the room
(`lerp(FIRST_NODE_Z, LAST_NODE_Z, ...)`) independent of any single node's
activation window — visualizing data literally moving through the pipeline
rather than implying it through node-by-node lighting alone.

## Accessibility & fallbacks

Three hooks in [hooks/](../hooks) gate the experience, all built on
`useSyncExternalStore` (not `useEffect` + `setState`, which trips the
`react-hooks/set-state-in-effect` lint rule and causes an extra cascading
render on mount):

- **`useReducedMotion`** — when `prefers-reduced-motion: reduce` is set,
  `pages/index.tsx`'s `showCinematic` flips false and the entire 3D
  experience — `WorldCanvas`, every scene, every scroll-synced text overlay —
  simply isn't mounted. `StaticFallback` renders instead: every scene's
  content (name/role, desk copy + stack, the hallway's career timeline, the
  lab's projects, contact links) stacked as normal, non-scroll-jacked
  document sections, spec §28's "replace cinematic camera movement with
  normal section transitions" taken literally rather than as a frozen first
  frame of the cinematic version.
- **`useWebGLSupport`** — probes for a WebGL context once. If unsupported,
  `showCinematic` is also false and the same `StaticFallback` renders — one
  fallback component serves both cases, since neither has anything to do
  with the 3D canvas.
- **`useIsMobile`** — coarse pointer or narrow viewport. Threaded through as
  a `simplified` prop: fewer trees, no shadows, capped `dpr`, wider FOV,
  closer camera path. Only relevant when `showCinematic` is true —
  `StaticFallback` is a normal responsive page, no special mobile handling
  needed.

Because `IntroText`/`DeskText`/`HallwayText`/`LabText`/`WorldCanvas` are only
ever mounted when `showCinematic` is true, none of them accept or branch on
a `reducedMotion` prop — that used to exist on each of them individually
(each with its own "if reduced motion, do X instead" branch), which meant
four different partial, inconsistent implementations of the same fallback
concept. Consolidating to one `showCinematic` boolean at the page level and
one `StaticFallback` component removed all of that dead branching in one
pass — if you find yourself adding a `reducedMotion` check inside a
scroll-synced component, that's a sign the logic belongs in `pages/index.tsx`
instead.

The name/role heading is real DOM content, never canvas-only text. The page's
single `<h1>` is a visually-hidden (`sr-only`) element in `pages/index.tsx`
that's always present; `IntroText`'s large on-screen name (cinematic) and
`StaticFallback`'s `<h2>` (fallback) are both non-`<h1>` elements, so there's
exactly one `<h1>` on the page regardless of which layer is active.

## Adding a new scene

See [ADDING_A_SCENE.md](ADDING_A_SCENE.md) for the step-by-step recipe.
