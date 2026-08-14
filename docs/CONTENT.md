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

Each scene gets its own file under `constants/scenes/`. Scene 01's is
[constants/scenes/intro.ts](../constants/scenes/intro.ts):

```ts
export const INTRO_SCENE = {
  name: 'HARIS SAEED',
  role: 'Software Engineer',
  tagline: 'AI · Systems · Product',
  skipLabel: 'Skip experience',
};
```

To change what appears in the intro (the name reveal, role line, tagline, or
the "skip experience" button label), edit this file only — no other file
needs to change.

When Scene 02+ are built, they'll follow the same convention: a
`constants/scenes/<name>.ts` file per scene, imported only by that scene's
components.

## What's not yet content-driven

- 3D geometry (building shape, tree placement, character proportions) lives
  in scene component files, not constants — geometry isn't really "content"
  in the copy sense. Colors are Tailwind design tokens in
  [tailwind.config.ts](../tailwind.config.ts) if you want to adjust the
  palette (`background`, `ink`, `metal`, `warmgray`, `surface`, `accent`).
- Project case studies, the career timeline, and AI/RAG pipeline content
  don't exist yet — those land with their respective scenes (Project Lab,
  Career Hallway, AI Lab) per [DESIGN_SPEC.md](DESIGN_SPEC.md).
