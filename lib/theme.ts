// Single source of truth for color. Both tailwind.config.ts (the DOM layer)
// and every 3D scene (components/world/**) import from here — no component
// should ever hardcode a hex literal. Change a value here and it updates
// everywhere at once, in both layers, keeping the two visually in sync.
//
// `core` mirrors the design spec's base palette (docs/DESIGN_SPEC.md §4) and
// is also exposed as Tailwind utility colors (bg-background, text-ink,
// text-accent, ...). `material` are 3D-only extensions used for things the
// DOM layer never needs (wood, foliage, warm light color) — still drawn
// from the same warm, restrained palette, not arbitrary per-scene picks.
export const THEME = {
  core: {
    background: '#F3F1EB',
    ink: '#171717',
    metal: '#30302E',
    warmGray: '#8F8B82',
    surface: '#E8E5DD',
    accent: '#C6511F',
  },
  material: {
    ground: '#DAD5C8',
    wallDark: '#262624',
    wallDarkAlt: '#3A3A36', // lighter than wallDark — for surfaces the camera ends up facing close-up, so they don't read as pure black
    wood: '#5A4632',
    foliage: '#7C8A5C',
    skin: '#D9C9AE',
    sunlight: '#FFF3E4', // directional "key light" color
    warmGlow: '#FFE9C7', // lamps, fixtures, point lights
  },
} as const;
