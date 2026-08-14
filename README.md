# Haris Saeed — Portfolio

An immersive, scroll-driven 3D portfolio: a continuous cinematic journey through
a stylized engineering workshop, built with React Three Fiber and GSAP
ScrollTrigger on top of Next.js, deployed as a static export to GitHub Pages.

This is a **phased build**. Phase 1 (this codebase) implements the foundational
architecture plus Scene 01 — the intro, outside the workshop. Later phases add
the remaining scenes (Desk, Career Hallway, Project Lab, Engineering Room, AI
Lab, Experiment Room, White Room, Landscape) following the same pattern.

## Stack

- **Next.js 16** (Pages Router, static export via `output: 'export'`)
- **React 19**
- **React Three Fiber 8** + **@react-three/drei** + **three.js** — the 3D world
- **GSAP** (`ScrollTrigger`, `SplitText`, `ScrambleTextPlugin`) — scroll choreography and text animation
- **Tailwind CSS** — the DOM/UI layer
- **TypeScript**, **ESLint 9** (flat config)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export -> out/
npm run lint
```

Deployment is automatic: pushing to `main` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
the static export and publishes it to GitHub Pages.

## Architecture

The page is two layers stacked on top of each other:

1. **3D layer** — a single fixed-position `<Canvas>` (`components/world/WorldCanvas.tsx`)
   that renders the active scene's geometry and lighting. It never scrolls; the
   camera moves *through* it.
2. **DOM layer** — normal React/Tailwind markup (nav, headings, case-study
   text) that sits on top, is crawlable, and is what screen readers see.

Scroll position drives everything through one shared, mutable singleton
(`lib/scrollState.ts`) rather than React state, so nothing re-renders on every
scroll tick:

```
scrollState.progress (0 -> 1)
        |
        +--> ScrollRig (components/world/ScrollRig.tsx)
        |        reads it every R3F frame, lerps the camera position/lookAt
        |
        +--> Scene geometry (e.g. IntroScene's door hinge)
        |        reads it every R3F frame to drive object animation
        |
        +--> IntroText (components/ui/IntroText.tsx)
                 reads it via requestAnimationFrame to reveal DOM text in sync
```

`pages/index.tsx` owns the single `ScrollTrigger` that writes to
`scrollState.progress` (`scrub: true`, tied to a tall `#intro-trigger` spacer
div). Everything downstream just *reads* that value — this is the pattern to
follow when adding new scenes: don't create a second `ScrollTrigger` per
component, read the shared progress value instead.

### Directory layout

```
constants/            content — copy, nav items, per-scene text (edit here, not in components)
  site.ts
  scenes/intro.ts
lib/
  scrollState.ts       shared scroll-progress singleton + easing helper
hooks/
  useReducedMotion.ts  prefers-reduced-motion, via useSyncExternalStore
  useIsMobile.ts        coarse-pointer / narrow-viewport detection
  useWebGLSupport.ts    WebGL availability check, drives the 2D fallback
components/
  world/
    WorldCanvas.tsx     <Canvas> wrapper, dynamically imported (ssr:false)
    ScrollRig.tsx        camera controller, reads scrollState each frame
    scenes/
      IntroScene.tsx     Scene 01 geometry (ground, workshop, door, trees, character)
  ui/
    Nav.tsx              fixed nav + "skip experience"
    IntroText.tsx         name/role/tagline reveal, synced to scrollState
pages/
  index.tsx              page shell: mounts WorldCanvas + IntroText + the scroll spacer
```

### Content

All copy lives in `constants/`, never inline in JSX — update `constants/site.ts`
(name, nav, social links) and `constants/scenes/intro.ts` (Scene 01 text)
directly; no component changes needed.

### Accessibility & fallbacks

- `prefers-reduced-motion: reduce` skips the scroll-driven camera and text
  animation entirely; the scene renders as a single static shot with content
  visible immediately (`useReducedMotion`).
- No WebGL → a plain 2D DOM fallback section replaces the 3D layer entirely
  (`useWebGLSupport`, checked in `pages/index.tsx`).
- Mobile / coarse-pointer devices get reduced geometry, no shadows, a capped
  device-pixel-ratio, and a wider FOV / closer camera framing tuned for
  portrait viewports (`useIsMobile`, `simplified` prop threaded through
  `WorldCanvas` → `IntroScene` / `ScrollRig`).
- The name/role heading is real DOM content (`<h1>`), not canvas-only text —
  crawlable and screen-reader accessible.

## Current state — 3D assets

All geometry right now is built from primitives (boxes, cones, capsules) —
there are no external `.glb` models yet. This keeps Phase 1 dependency-free
while the scaffold is being validated. Swapping in real models later is a
drop-in change scoped to the relevant scene file (e.g.
`IntroScene.tsx`'s `Character` component) and doesn't touch the scroll/camera
architecture.

## What's next

- Guide for creating/sourcing the character and prop 3D models
- Scene 02 (Desk) and onward, following the same read-the-shared-scrollState
  pattern established here
- Project case study content (2D layer, per spec)
