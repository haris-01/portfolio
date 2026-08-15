# Haris Saeed — Portfolio

An immersive, scroll-driven 3D portfolio: a continuous cinematic journey through
a stylized engineering workshop, built with React Three Fiber and GSAP
ScrollTrigger on top of Next.js, deployed as a static export to GitHub Pages.

This is a **phased build**. So far: Scene 01 (the intro, outside the
workshop) and Scene 02 (the desk — the camera continues inward as the monitor
wakes and the intro copy/tech stack reveal on screen). Later phases add the
remaining scenes (Career Hallway, Project Lab, Engineering Room, AI Lab,
Experiment Room, White Room, Landscape) following the same pattern.

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
  scenes/intro.ts, desk.ts
lib/
  scrollState.ts       shared scroll-progress singleton, scene boundaries, easing helper
hooks/
  useReducedMotion.ts  prefers-reduced-motion, via useSyncExternalStore
  useIsMobile.ts        coarse-pointer / narrow-viewport detection
  useWebGLSupport.ts    WebGL availability check, drives the 2D fallback
components/
  world/
    WorldCanvas.tsx     <Canvas> wrapper, dynamically imported (ssr:false)
    Environment.tsx      shared ground/fog/lighting, used by every scene
    ScrollRig.tsx         multi-waypoint camera controller, reads scrollState each frame
    scenes/
      IntroScene.tsx     Scene 01 geometry (workshop, door, trees, character)
      DeskScene.tsx       Scene 02 geometry (desk, monitor wake, character, room shell)
  ui/
    Nav.tsx              fixed nav + "skip experience"
    IntroText.tsx         name/role/tagline reveal, synced to scrollState
    DeskText.tsx           desk-screen copy + tech stack reveal, synced to scrollState
pages/
  index.tsx              page shell: mounts WorldCanvas + text layers + the scroll spacer
```

Content editing, the accessibility/fallback system, and camera choreography
are all covered in [docs/](#documentation) above rather than duplicated here.

## Current state — 3D assets

All geometry right now is built from primitives (boxes, cones, capsules) —
there are no external `.glb` models yet. This keeps things dependency-free
while the scaffold is being validated. Swapping in real models later is a
drop-in change scoped to each scene file (e.g. `IntroScene.tsx`'s/
`DeskScene.tsx`'s `Character` components) and doesn't touch the scroll/camera
architecture.

## Known limitation

The reduced-motion fallback currently only presents Scene 01 as a static
shot; Scene 02+ content stays hidden in that mode rather than animating in
(see the note in `DeskText.tsx`). A proper non-cinematic, stacked fallback
that surfaces every scene's content without the scroll-driven camera is
tracked as follow-up work.

## What's next

- Guide for creating/sourcing the character and prop 3D models
- Scene 03 (Career Hallway) and onward, following the same
  read-the-shared-scrollState pattern established here (see
  [docs/ADDING_A_SCENE.md](docs/ADDING_A_SCENE.md))
- A real reduced-motion fallback that covers every scene, not just Scene 01
- Project case study content (2D layer, per spec)
