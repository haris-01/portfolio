# Adding a new scene

Recipe for a 10th scene onward, following the pattern all nine existing
scenes use. Read [ARCHITECTURE.md](ARCHITECTURE.md) first if you haven't —
this assumes you understand the shared `scrollState.progress` singleton.

Referencing the design spec: see [DESIGN_SPEC.md](DESIGN_SPEC.md) §7–19 for
what each scene needs to contain and communicate. Every scene must answer one
question (spec §31) — know the answer before writing geometry.

## 1. Content first

Add a `constants/scenes/<name>.ts` file with that scene's copy — labels,
headings, tech-stack lists, whatever text the scene reveals. Match the shape
of [constants/scenes/intro.ts](../constants/scenes/intro.ts). Components
import from here; never inline copy in JSX.

## 2. Scene geometry

Create `components/world/scenes/<Name>Scene.tsx`. Rules, carried over from
Scene 01 and the design spec:

- **Primitives only**, until the 3D-model guide lands (see
  [DESIGN_SPEC.md](DESIGN_SPEC.md) §8 for character constraints once real
  models exist).
- Accept a `simplified: boolean` prop and use it to cut geometry for mobile
  (fewer instances, no shadows) — see how `IntroScene` reduces its tree count.
- Any object that animates does so by reading `scrollState.progress` inside
  its own `useFrame`, scoped to whatever sub-range of progress is relevant to
  that object (see the door-hinge example in
  [IntroScene.tsx](../components/world/scenes/IntroScene.tsx)). **Do not**
  create a `ScrollTrigger` inside the scene component.
- Every animation needs a narrative reason (spec §22). If you can't say why
  an object moves, don't animate it.

## 3. Camera path

[ScrollRig.tsx](../components/world/ScrollRig.tsx) drives the camera through
a `WAYPOINTS` array — one entry per scene boundary, each `{ at: <global
progress>, pos, look }`. Adding a scene means:

1. Redivide `SCENE_BOUNDS` in [lib/scrollState.ts](../lib/scrollState.ts)
   into one more equal share (nine scenes today → equal ninths; a tenth
   scene means switching to tenths and shifting every boundary). Every
   existing usage of `SCENE_BOUNDS.<scene>[0|1]` is symbolic (never a
   hardcoded fraction), so this alone doesn't break anything downstream —
   but grep for any stray hardcoded `0`/`1` boundary before assuming that.
2. Add the scene's own `<name>Layout.ts` file exporting a position function
   (`itemPosition(index)`, `stagePosition(index)`, ...) if the scene has
   repeating geometry — every scene from the hallway onward follows this
   convention so the scene mesh and the camera path read from one shared
   source instead of duplicating numbers.
3. Add one new waypoint at `{ at: SCENE_BOUNDS.<newScene>[0], ... }`, and
   shift whichever waypoint used to be `{ at: 1, ... }` back to become this
   new scene's entrance framing. Do the same for `WAYPOINTS_MOBILE`.
   `ScrollRig` finds whichever two waypoints bracket the current
   `scrollState.progress` and lerps between them with `easeInOutCubic`
   automatically — you don't touch the interpolation logic.

**Before picking a waypoint's `pos`/`look`, place the scene's geometry
first**, then derive the waypoint from the *same* layout function the
geometry uses — never eyeball or duplicate a position. This has bitten every
single scene added after the desk, in slightly different ways:

- **Scene 02 (Desk):** the first pass put the final camera position *behind*
  the monitor mesh, so the "approach the desk" shot was actually looking at
  the inside-out backface of a giant, screen-filling monitor. Fixed by
  keeping the final waypoint in front of the geometry, not past it.
- **Scene 04 (Lab):** pods alternate sides (`podPosition()` offsets `x` by
  `±5`), but the waypoint looked straight down the centerline (`x: 0`). The
  last pod was almost entirely out of frame — not unlit, just not where the
  camera pointed. Fixed by deriving `x` from `podPosition(POD_COUNT - 1)`.
- **Scene 06 (AI Lab):** `stagePosition()` returns a full `[x, y, z]`
  (markers drift in height too, unlike earlier `[x, z]`-only layouts), so
  the waypoint has to pull all three axes from the layout function, not
  just `x`.
- **Scene 09 (Landscape):** unrelated to position — `WhiteRoomText`'s
  reveal never faded out entering this scene, so its statement stayed on
  screen underneath the closing CTA. See "Two DOM-text reveal shapes" in
  [ARCHITECTURE.md](ARCHITECTURE.md) — this is a text-timing bug, not a
  camera bug, but it's the same class of mistake: something that looked
  fine as the last scene silently breaks once a new one is appended after
  it, and only screenshotting the actual transition catches it.

Verify every new waypoint by screenshotting near the scene's end-of-range
progress, not just its midpoint — a broken framing produces no error, it
just quietly points the camera at the wrong thing.

## 4. DOM content layer

If the scene needs 2D content — a case study, a tech-stack list, a career
timeline entry — build it as a normal React/Tailwind component in
`components/ui/`, synced to `scrollState.progress` via a
`requestAnimationFrame` loop inside `useGSAP` calling `gsap.set` — not a
nested `ScrollTrigger`.

Decide up front which of the two reveal shapes it needs (see "Two DOM-text
reveal shapes" in [ARCHITECTURE.md](ARCHITECTURE.md)):

- **Cyclic** — one item revealed at a time as the camera passes a series of
  markers (`HallwayText`, `EngineeringText`, `AiLabText`, `ExperimentText`).
  Each item's own symmetric fade-in/fade-out window handles clearing it
  before the next appears; no extra work needed at the scene boundary.
- **Single-reveal** — one thing reveals once and holds (`IntroText`,
  `DeskText`, `WhiteRoomText`). These **must** compute the next scene's
  `localProgress` and multiply their opacity by `(1 - fadeOut)`, or the
  content stays on screen forever, including underneath whatever the next
  scene reveals. Write the fade-out in the same pass as the reveal — this
  has been missed and had to be retrofitted twice already (`DeskText`,
  `WhiteRoomText`).

## 5. Wire it into the page

Mount the new scene + its DOM layer from `pages/index.tsx` (or a dedicated
page/route if the case-study content warrants its own URL — see spec §14 on
when to break out of the continuous 3D layer into a real page). Extend the
scroll spacer height to give the new scene room to play out.

## 6. Accessibility & mobile — don't skip these

Every new scene must:

- Keep its text content in real DOM elements (headings, paragraphs), not
  canvas-only.
- Add a matching section to
  [StaticFallback.tsx](../components/ui/StaticFallback.tsx) — the single
  component that covers *both* `useReducedMotion()` and `useWebGLSupport()`
  being false (`pages/index.tsx`'s `showCinematic` gates the entire
  cinematic layer; when it's false, `StaticFallback` renders instead, no
  canvas, no scroll-jacking). Pull the same content the scene's cyclic/
  single-reveal text component uses, laid out as a normal stacked
  `<section>` — see how every existing section in that file mirrors its
  corresponding scene's constants file.
- Work when `useIsMobile()` is true — verify the camera framing doesn't leave
  huge dead space (this bit Scene 01: a fixed camera distance produced way
  too much empty ground in portrait aspect; fixed by giving mobile its own
  closer camera positions and a wider FOV).

## 7. Verify before calling it done

- `npx tsc --noEmit`, `npm run lint`, `npm run build` (confirms the static
  export still succeeds).
- Manually scroll through in a browser: does the new scene read correctly on
  its own, and does the transition in/out of the previous scene still feel
  smooth?
- Check the `prefers-reduced-motion`, no-WebGL, and mobile-portrait paths
  specifically — these are easy to break silently (see the intro-text bug
  noted in [ARCHITECTURE.md](ARCHITECTURE.md) — a broken scroll sync doesn't
  throw an error, it just silently never animates).
