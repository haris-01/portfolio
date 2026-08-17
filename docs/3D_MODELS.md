# Adding real 3D models

Everything in the world right now — the character, the desk, the server
racks, the mountains — is built from three.js primitives (boxes, cones,
capsules). That's been deliberate: it kept Phase 1 dependency-free while the
scroll/camera architecture was being validated (see
[ARCHITECTURE.md](ARCHITECTURE.md)). This guide covers replacing the
**character** first, since it's the highest-impact swap — it appears in four
scenes (intro, desk, white room, landscape) through one shared component,
so replacing it once updates the whole site. The same approach applies to
any prop later (the desk, a project pod, a server rack) if you want to go
further.

If you've never modeled or sourced a 3D asset before, start here: **you do
not need to learn Blender to get a real character into this site.** The
fastest path is finding a free, pre-made, already-rigged low-poly character
and dropping it in — sections 1–3 below cover exactly that. Modeling from
scratch (section 5) is the advanced path, for later.

## What "fits" this site

Per the design spec (§3, §8): stylized, low-poly, **not** photorealistic,
**not** anime, no oversized cartoon proportions. Think architectural-viz
"generic person" figures, not a game character. A model in roughly this
style — simple geometric shapes, flat or near-flat shading, no fine detail
— will sit naturally next to the primitive props still in every other
scene. A hyper-detailed, textured, photoreal character will look visibly
out of place until everything else is upgraded too, so don't reach for the
most detailed option available — reach for the simplest one that reads as
"a person."

## 1. Where to get one, free

Ranked by how good a fit they are for this project, easiest first:

- **[Kenney.nl](https://kenney.nl/assets?q=3d)** — CC0 (public domain, no
  attribution required, ever). Search "mini characters" or "blocky
  characters." Exactly the low-poly aesthetic this site wants, and Kenney's
  packs are consistently clean, small, and game-ready.
- **[Quaternius](https://quaternius.com/)** — also CC0, also low-poly,
  larger character packs with more variety (and often already rigged with a
  walk cycle, which matters for the landscape scene's walking character).
- **[Mixamo](https://www.mixamo.com/)** (free Adobe account required) — best
  source specifically for **rigged, animated** humanoid characters. Upload
  any humanoid mesh (including ones from Kenney/Quaternius) and Mixamo
  auto-rigs it and gives you a library of free animation clips (idle, walk,
  sit) you can export as separate `.glb`/`.fbx` files. This is the
  recommended path if you want the landscape character to actually walk
  with a walk-cycle animation rather than just sliding along the ground.
- **[Sketchfab](https://sketchfab.com/)**, filtered to "Downloadable" +
  CC0/CC-BY license — huge variety, but quality and license terms are
  inconsistent per-model. Check the license on every individual download;
  CC-BY requires crediting the author (see §6 below).
- **AI generation** (Meshy, Tripo, Luma, etc.) — text/image-to-3D tools.
  Currently produces rougher results for a clean stylized humanoid than a
  hand-modeled asset, and licensing terms vary by tool — usable for one-off
  background props where imperfection doesn't matter, less reliable for the
  character everyone will look at four times.

**Recommendation for a first pass:** a Quaternius or Kenney character pack,
already rigged if possible. It'll get you a real model in the site in one
afternoon, no modeling skill required.

## 2. File format and size

- Export/download as **`.glb`** (binary glTF) — a single self-contained
  file, not `.gltf` + separate `.bin` + separate texture files. Almost
  every source above offers a `.glb` download directly.
- Keep it small: **under ~1–2MB** for the character. This is a
  performance-first site (spec §26) loaded over the same static export as
  everything else — a 20MB character model would visibly hurt load time on
  first visit. Most low-poly character packs are already well under this;
  if a Sketchfab download is huge, it likely has large embedded textures
  you don't need (see below).
- If a model comes with textures and you'd rather match this site's flat,
  untextured `meshStandardMaterial` look: strip the texture and set a solid
  color instead (in Blender: select the material, delete the image texture
  node, set Base Color directly — see §6 for matching `THEME` colors). This
  also shrinks the file significantly.
- **Compress it.** Run it through
  [gltf-transform](https://gltf-transform.dev/) (`npx @gltf-transform/cli optimize model.glb model.optimized.glb`)
  or use [gltfjsx](https://github.com/pmndrs/gltfjsx) with the `--transform`
  flag (`npx gltfjsx model.glb --transform`) — both apply Draco/meshopt
  compression, which typically cuts file size by 50%+ with no visible
  quality loss. Either tool is a one-time `npx` call, no install needed.

## 3. Wiring it into the site

The plumbing already exists — you're only changing one file:

1. Create `public/models/` and put your `.glb` file there, e.g.
   `public/models/character.glb`.
2. Open [constants/character.ts](../constants/character.ts) and set:
   ```ts
   export const CHARACTER_MODEL = {
     url: '/models/character.glb',
     scale: 1, // adjust once you see it — see step 3 below
   };
   ```
3. Run `npm run dev`, scroll to the intro scene, and look. Most models
   aren't exported at "1 world unit = 1 meter, person-sized" — you'll
   likely need to tweak `scale` (try values like `0.3`, `1.5`, `5` — it
   varies a lot by source) until the character is roughly capsule-height
   (the primitive placeholder is ~1.2 units tall, head included, so that's
   your reference).
4. If the model faces the wrong direction (common — different tools export
   with different "forward" conventions), that's a rotation, not a scale,
   problem. [CharacterModel.tsx](../components/world/CharacterModel.tsx)
   doesn't currently expose a rotation prop since the primitive placeholder
   never needed one — add one (`rotation?: [number, number, number]` passed
   through to the `<primitive>` in `GltfCharacter`) if you hit this.

That's it — [CharacterModel.tsx](../components/world/CharacterModel.tsx) is
shared by `IntroScene`, `DeskScene`, `WhiteRoomScene`, and `LandscapeScene`,
so setting the URL once updates the character everywhere. Until `url` is
set, every scene keeps rendering the primitive placeholder automatically —
nothing breaks in the meantime, and you can leave it unset indefinitely if
you'd rather stay with the current look.

**Note the desk scene passes `seated`** — `CharacterModel` only uses that
flag to adjust the *primitive* placeholder's proportions (shorter capsule,
lower head) for a sitting pose. A real GLTF model won't automatically sit
down; if the model isn't already posed sitting, the desk scene will show it
standing/floating at the seated position until you either find/pose a
seated variant or accept the standing pose there.

## 4. Animation (optional, more advanced)

The landscape scene currently *translates* the character forward as the
scene plays (no leg movement — it slides). For a real walk cycle:

- Get a rigged model **with** an idle/walk animation clip baked into the
  same `.glb` (Mixamo is the most reliable source for this — see §1).
- `useGLTF` already returns an `animations` array alongside `scene`; drei's
  [`useAnimations`](https://github.com/pmndrs/drei#useanimations) hook
  turns that into a playable action (`actions.Walk.play()`). This isn't
  wired up in `CharacterModel.tsx` yet — it's a reasonable next step once a
  rigged model is in place, but adds real complexity (managing animation
  state across the character's four different scenes/poses), so it's left
  out of the current scaffold rather than half-implemented.

## 5. Modeling from scratch (advanced / later)

If you want a genuinely custom character rather than a sourced one:
[Blender](https://www.blender.org/) (free) is the standard tool. This is a
real skill investment — budget days, not hours, for a first character — so
it's worth trying the sourced-model path first and only reaching for this
if you want something no existing asset provides. If/when you do: model
simply (the low-poly, flat-shaded aesthetic this site wants is actually
*easier* to model than a detailed character, not harder), export `.glb`,
and follow §2–3 above exactly the same way.

## 6. Matching the site's palette

To recolor a sourced model's materials to this site's warm palette
(`THEME.core.surface` for the body, `THEME.material.skin` for the head — see
[lib/theme.ts](../lib/theme.ts)) before export: open the `.glb` in Blender,
select each material in the Shading tab, and set its Base Color to the
matching hex value. Exporting with flat colors instead of textures also
keeps the file small (§2).

## 7. Licensing

Keep track of where a model came from and its license — CC0 needs nothing,
but CC-BY (common on Sketchfab) requires crediting the original author
somewhere. A simple `CREDITS.md` at the repo root with "asset — source —
license — author" per row is enough; add one if you use anything other than
CC0 sources.

## 8. Extending this to props beyond the character

Everything above generalizes to any other object — a real desk, a real
server rack, real trees. The pattern is the same: source or model a `.glb`,
compress it, drop it in `public/models/`, and load it with `useGLTF` the
same way `CharacterModel.tsx` does. There's no shared component for props
yet since only the character repeats across scenes — if you replace
several props, consider factoring out a small `GltfProp.tsx` following
`CharacterModel.tsx`'s pattern (config-driven URL, `Suspense` fallback to
the current primitive) rather than duplicating the loading logic per prop.
