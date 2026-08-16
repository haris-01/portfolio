# Editing content

All copy is centralized in `constants/` so it can be updated without touching
any component or knowing React.

## Site-wide content

[constants/site.ts](../constants/site.ts):

- `SITE.name`, `SITE.role`, `SITE.tagline`, `SITE.description` — used in the
  page `<title>`/meta tags and as fallback copy.
- `NAV_ITEMS` — the fixed nav links (label + `href`, currently anchor links
  like `#about`; these will point at real sections/pages as they're built).
- `SOCIAL_LINKS` — GitHub / LinkedIn / email. **These are still placeholders**
  (`your-username`, `you@example.com`) — replace with real links before
  shipping.

## Per-scene content

Each scene gets its own file under `constants/scenes/`, imported only by that
scene's components:

- [constants/scenes/intro.ts](../constants/scenes/intro.ts) — name, role,
  tagline, "skip experience" label.
- [constants/scenes/desk.ts](../constants/scenes/desk.ts) — the monitor's
  screen copy lines and the tech stack chip list.
- [constants/scenes/hallway.ts](../constants/scenes/hallway.ts) —
  `HALLWAY_SCENE.stages`, an ordered array of `{ year, role }` career
  entries, one per door. **Note:** the array length must match
  `DOOR_COUNT` in
  [components/world/scenes/hallwayLayout.ts](../components/world/scenes/hallwayLayout.ts)
  — that file positions the doors in 3D space and isn't auto-derived from
  the content array's length.
- [constants/scenes/lab.ts](../constants/scenes/lab.ts) — `LAB_SCENE.projects`,
  an ordered array of `{ title, tagline, stack }` entries, one per
  installation pod. **All three are still placeholder projects** — replace
  with real ones before shipping. Same note as hallway: the array length
  must match `POD_COUNT` in
  [components/world/scenes/labLayout.ts](../components/world/scenes/labLayout.ts).

To change what appears in a scene, edit its constants file only — no
component changes needed.

## Color / theme

Every color used anywhere in the app — Tailwind utility classes in the DOM
layer, and every 3D material/light in the R3F scenes — comes from one file:
[lib/theme.ts](../lib/theme.ts). Nothing should ever hardcode a hex literal
in a component; import `THEME` instead.

- `THEME.core` — the design spec's base palette (`background`, `ink`,
  `metal`, `warmGray`, `surface`, `accent`). These are re-exported as
  Tailwind utility colors in [tailwind.config.ts](../tailwind.config.ts)
  (`bg-background`, `text-ink`, `text-accent`, etc.) *and* imported directly
  into 3D scene files for `meshStandardMaterial`/light colors — both layers
  read the same values, so they can't drift out of sync.
- `THEME.material` — a handful of 3D-only extensions (`wood`, `foliage`,
  `skin`, `ground`, `wallDark`, `sunlight`, `warmGlow`, ...) for things the
  DOM layer never needs but that should still come from the same restrained,
  warm palette rather than an arbitrary per-scene pick.

**To re-theme the whole site** — e.g. swap the accent color from burnt
orange to something else — change the relevant value(s) in `lib/theme.ts`
once. Every scene and every DOM element using that token updates together.

## What's not yet content-driven

- 3D geometry (building shape, tree placement, door spacing, character
  proportions) lives in scene component files, not constants — geometry
  isn't really "content" in the copy sense.
- The full 2D case-study layer (problem/solution/architecture/screenshots,
  spec §13) for Scene 04's projects doesn't exist yet — only the 3D
  title/tagline/stack reveal does. AI/RAG pipeline content (Scene 06) also
  doesn't exist yet. These land as their own follow-up work per
  [DESIGN_SPEC.md](DESIGN_SPEC.md).
