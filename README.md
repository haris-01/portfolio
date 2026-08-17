# Haris Saeed — Portfolio

An immersive, scroll-driven 3D portfolio: a continuous cinematic journey through
a stylized engineering workshop, built with React Three Fiber and GSAP
ScrollTrigger on top of Next.js, deployed as a static export to GitHub Pages.

All nine scenes from the design spec are built as one continuous scroll
journey:

1. **Intro** — outside the workshop, camera dollies toward the entrance as the door opens.
2. **Desk** — camera continues inward as the monitor wakes and the intro copy/tech stack reveal on screen.
3. **Career Hallway** — a corridor of doors light up in sequence, each revealing a year/role.
4. **Project Lab** — three project "installations" light up as the camera passes each, revealing title/tagline/stack.
5. **Engineering Room** — a data packet travels down a row of server racks as REQUEST → API → SERVICE → DATABASE → QUEUE → WORKER → RESPONSE light up in turn.
6. **AI Lab** — the workshop dissolves into an abstract, drifting field of vector-point markers as a query travels through DOCUMENTS → PARSING → CHUNKS → EMBEDDINGS → VECTOR SEARCH → RETRIEVAL → LLM → ANSWER.
7. **Experiment Room** — six small, distinctly-shaped prototypes wake and gently spin as the camera passes, one per side-project category.
8. **White Room** — everything but the character disappears; one statement reveals, then fades as the landscape opens.
9. **Landscape** — distant mountains, the character walks toward the horizon, camera pulls back for the closing CTA and contact links.

Scene 04 currently only covers the 3D reveal (title/tagline/stack, matching
every other scene's tier) — the full 2D case-study layer the design spec
describes (problem/solution/architecture/screenshots) is tracked separately,
see [What's next](#whats-next).

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
  for building a new scene, following the pattern every existing scene uses.
- **[docs/CONTENT.md](docs/CONTENT.md)** — where copy lives and how to edit
  it without touching components.
- **[docs/DESIGN_SPEC.md](docs/DESIGN_SPEC.md)** — the full master design
  brief that governs every scene (visual language, color, typography,
  per-scene requirements, what to avoid).
- **[docs/3D_MODELS.md](docs/3D_MODELS.md)** — how to replace the primitive
  character with a real model: where to source one free, file
  format/size/compression, and the one-file config change to wire it in.

### Directory layout

```
constants/            content — copy, nav items, per-scene text (edit here, not in components)
  site.ts
  scenes/intro.ts, desk.ts, hallway.ts, lab.ts, engineering.ts, ai.ts,
         experiment.ts, whiteRoom.ts, landscape.ts
lib/
  scrollState.ts       shared scroll-progress singleton, scene boundaries, easing helper
  theme.ts             single source of truth for color — DOM (Tailwind) and 3D both read this
hooks/
  useReducedMotion.ts  prefers-reduced-motion, via useSyncExternalStore
  useIsMobile.ts        coarse-pointer / narrow-viewport detection
  useWebGLSupport.ts    WebGL availability check, drives the 2D fallback
components/
  world/
    WorldCanvas.tsx     <Canvas> wrapper, dynamically imported (ssr:false)
    Environment.tsx      shared ground/fog/lighting, used by every scene
    ScrollRig.tsx         multi-waypoint camera controller, reads scrollState each frame
    CharacterModel.tsx     shared character (GLTF once configured, primitive fallback
                            until then) — used by 4 of the 9 scenes, see docs/3D_MODELS.md
    scenes/
      IntroScene.tsx     Scene 01 geometry (workshop, door, trees, character)
      DeskScene.tsx       Scene 02 geometry (desk, monitor wake, character, room shell)
      HallwayScene.tsx     Scene 03 geometry (corridor, career-stage doors, ceiling lights)
      hallwayLayout.ts      shared corridor/door position constants (scene + camera both use it)
      LabScene.tsx          Scene 04 geometry (room, project installation pods)
      labLayout.ts           shared pod position constants (scene + camera both use it)
      EngineeringScene.tsx    Scene 05 geometry (server racks, traveling data packet)
      engineeringLayout.ts     shared rack position constants (scene + camera both use it)
      AiLabScene.tsx            Scene 06 geometry (drifting vector markers, ambient
                                 particles, traveling query)
      aiLabLayout.ts             shared stage position constants (scene + camera both use it)
      ExperimentScene.tsx        Scene 07 geometry (six spinning prototype shapes)
      experimentLayout.ts         shared item position constants (scene + camera both use it)
      WhiteRoomScene.tsx           Scene 08 geometry (just the character)
      whiteRoomLayout.ts            shared character/room span constants
      LandscapeScene.tsx            Scene 09 geometry (mountains, walking character)
      landscapeLayout.ts             shared mountain/character span constants
  ui/
    Nav.tsx              fixed nav + "skip experience"
    IntroText.tsx         name/role/tagline reveal, synced to scrollState
    DeskText.tsx           desk-screen copy + tech stack reveal, synced to scrollState
    HallwayText.tsx         per-door year/role label, synced to scrollState
    LabText.tsx              per-project title/tagline/stack reveal, synced to scrollState
    EngineeringText.tsx       per-stage name/description reveal, synced to scrollState
    AiLabText.tsx              per-stage name/description reveal, synced to scrollState
    ExperimentText.tsx          per-item name/description reveal, synced to scrollState
    WhiteRoomText.tsx            the single statement reveal + fade-out
    LandscapeText.tsx             closing CTA + social links
    StaticFallback.tsx            every scene's content, stacked, no canvas/scroll-jacking —
                                   used for reduced-motion and no-WebGL visitors
pages/
  index.tsx              page shell: mounts WorldCanvas + text layers + the scroll spacer,
                          or StaticFallback, depending on showCinematic
```

Content editing, the accessibility/fallback system, and camera choreography
are all covered in [docs/](#documentation) above rather than duplicated here.

## Current state — 3D assets

All geometry right now is built from primitives (boxes, cones, capsules) —
there are no external `.glb` models yet. This keeps things dependency-free
while the scaffold is being validated. The character (used across 4 scenes)
already goes through a shared loader,
[CharacterModel.tsx](components/world/CharacterModel.tsx), that renders a
real GLTF model the moment one is configured and falls back to the current
primitive otherwise — see [docs/3D_MODELS.md](docs/3D_MODELS.md) for the
full guide on sourcing/adding one. Other props (the desk, server racks,
mountains, ...) would follow the same pattern but don't have a shared loader
yet since only the character currently repeats across scenes.

## What's next

- Real GLTF character model — the scaffold (`CharacterModel.tsx`,
  `constants/character.ts`) is ready; see
  [docs/3D_MODELS.md](docs/3D_MODELS.md)
- The 2D case-study layer for Scene 04's projects (problem/solution/
  architecture/screenshots per spec §13) — currently only the 3D reveal
  (title/tagline/stack) exists
- Real project content in `constants/scenes/lab.ts` to replace the current
  placeholders
- Real `SOCIAL_LINKS` in `constants/site.ts` (still `your-username`/
  `you@example.com` placeholders, now live in both the landscape scene and
  StaticFallback's contact section)
