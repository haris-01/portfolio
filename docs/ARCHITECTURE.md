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
camera. The path is a sequence of **waypoints** — `WAYPOINTS` is `[{ at: 0,
pos, look }, { at: 1/4, ... }, { at: 1/2, ... }, { at: 3/4, ... }, { at: 1,
... }]`, one entry per scene boundary (currently: outside → workshop entrance
→ desk → hallway entrance → last lab pod). On every frame, `ScrollRig`:

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

`lib/scrollState.ts` exports `SCENE_BOUNDS` (currently `{ intro: [0, 1/4],
desk: [1/4, 1/2], hallway: [1/2, 3/4], lab: [3/4, 1] }`) and
`localProgress(global, start, end)`, which every scene and DOM-text
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
eyeball a position.**

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
arriving; nothing spins or floats without cause).

## Accessibility & fallbacks

Three hooks in [hooks/](../hooks) gate the experience, all built on
`useSyncExternalStore` (not `useEffect` + `setState`, which trips the
`react-hooks/set-state-in-effect` lint rule and causes an extra cascading
render on mount):

- **`useReducedMotion`** — when `prefers-reduced-motion: reduce` is set,
  `ScrollRig` isn't even mounted (`pages/index.tsx` conditionally renders it)
  and `IntroText` skips its `requestAnimationFrame` loop, setting the final
  revealed state immediately instead. The scene still renders — just as a
  single static shot.
- **`useWebGLSupport`** — probes for a WebGL context once. If unsupported,
  `pages/index.tsx` renders a plain 2D DOM section instead of mounting
  `WorldCanvas` at all.
- **`useIsMobile`** — coarse pointer or narrow viewport. Threaded through as
  a `simplified` prop: fewer trees, no shadows, capped `dpr`, wider FOV,
  closer camera path.

The name/role heading is real DOM content, never canvas-only text. The page's
single `<h1>` is a visually-hidden (`sr-only`) element in `pages/index.tsx`
that's always present; `IntroText`'s large on-screen name is a styled `<p>` so
there's exactly one `<h1>` on the page regardless of which layer (3D or 2D
fallback) is active.

## Adding a new scene

See [ADDING_A_SCENE.md](ADDING_A_SCENE.md) for the step-by-step recipe.
