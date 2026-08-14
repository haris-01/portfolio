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

## Documentation

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — the two-layer (3D/DOM)
  model, why scroll state is a mutable singleton instead of React state, camera
  choreography, and the accessibility/fallback system. Read this first.
- **[docs/ADDING_A_SCENE.md](docs/ADDING_A_SCENE.md)** — step-by-step recipe
  for building Scene 02 onward, following the pattern Scene 01 established.
- **[docs/CONTENT.md](docs/CONTENT.md)** — where copy lives and how to edit
  it without touching components.
- **[docs/DESIGN_SPEC.md](docs/DESIGN_SPEC.md)** — the full master design
  brief that governs every scene, present and future (visual language, color,
  typography, per-scene requirements, what to avoid).

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

Content editing, the accessibility/fallback system, and camera choreography
are all covered in [docs/](#documentation) above rather than duplicated here.

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
