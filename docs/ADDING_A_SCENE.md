# Adding a new scene

Recipe for Scene 02 (Desk) onward, following the pattern established by
Scene 01. Read [ARCHITECTURE.md](ARCHITECTURE.md) first if you haven't —
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
progress>, pos, look }`. Adding a scene means adding one more waypoint at the
`at` value where the new scene should be fully framed (e.g. Scene 03 would
add `{ at: 1, ... }` and shift Scene 02's waypoint back to `{ at: 0.667,
... }`, redividing `SCENE_BOUNDS` (below) to match). Do the
same for `WAYPOINTS_MOBILE`. `ScrollRig` finds whichever two waypoints
bracket the current `scrollState.progress` and lerps between them with
`easeInOutCubic` automatically — you don't touch the interpolation logic.

**Before picking a waypoint's `pos`/`look`, place the scene's geometry
first** and sanity-check the camera doesn't fly past or end up inside it —
this bit Scene 02: the first pass put the final camera position *behind* the
monitor mesh, so the "approach the desk" shot was actually looking at the
inside-out backface of a giant, screen-filling monitor. Fixed by keeping the
final waypoint in front of the scene's geometry rather than past it. Verify
by screenshotting near the scene's end-of-range progress, not just its
midpoint.

Also update `SCENE_BOUNDS` in
[lib/scrollState.ts](../lib/scrollState.ts) — every scene's boundary must be
listed there so its geometry and DOM text can compute their own local
progress via `localProgress()`.

## 4. DOM content layer

If the scene needs 2D content — a case study, a tech-stack list, a career
timeline entry — build it as a normal React/Tailwind component in
`components/ui/`, synced to `scrollState.progress` the same way
[IntroText.tsx](../components/ui/IntroText.tsx) is: a `requestAnimationFrame`
loop inside `useGSAP`, reading the shared progress value and calling
`gsap.set` — not a nested `ScrollTrigger`.

## 5. Wire it into the page

Mount the new scene + its DOM layer from `pages/index.tsx` (or a dedicated
page/route if the case-study content warrants its own URL — see spec §14 on
when to break out of the continuous 3D layer into a real page). Extend the
scroll spacer height to give the new scene room to play out.

## 6. Accessibility & mobile — don't skip these

Every new scene must:

- Keep its text content in real DOM elements (headings, paragraphs), not
  canvas-only.
- Work when `useReducedMotion()` is true — decide what the static fallback
  shot looks like and what text state shows immediately.
- Work when `useIsMobile()` is true — verify the camera framing doesn't leave
  huge dead space (this bit Scene 01: a fixed camera distance produced way
  too much empty ground in portrait aspect; fixed by giving mobile its own
  closer camera positions and a wider FOV).
- Degrade to the 2D fallback path if `useWebGLSupport()` is false — that
  fallback currently only covers Scene 01
  ([pages/index.tsx](../pages/index.tsx)'s `else` branch); extend it as
  scenes are added.

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
