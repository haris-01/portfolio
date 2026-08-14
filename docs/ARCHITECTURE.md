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
camera. It defines a `START_POS`/`START_LOOK` (wide establishing shot) and an
`END_POS`/`END_LOOK` (close to the entrance), and on every frame:

1. Eases `scrollState.progress` through `easeInOutCubic` (never a linear or
   sudden move — see spec §21, "Camera Principles").
2. Lerps a *target* position/look-at between start and end using the eased
   value.
3. Smooths the *current* position/look-at toward that target using a
   frame-rate-independent lerp (`1 - Math.pow(0.001, delta)`), so the camera
   reads as fluid even though the underlying scrub value can be jumpy (fast
   flicks, trackpad inertia, etc).

Mobile gets its own `START_POS_MOBILE`/`END_POS_MOBILE` (closer) plus a wider
FOV set on the `<Canvas>` in `WorldCanvas.tsx` — portrait viewports need a
different composition, not just a scaled-down desktop shot. See
[components/world/WorldCanvas.tsx](../components/world/WorldCanvas.tsx).

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
