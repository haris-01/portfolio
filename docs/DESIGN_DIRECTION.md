# 3D Design Direction — Phase 2 (Rev. 2)

This document is the practical visual/art-direction specification for the
redesign of the existing scene world. It supersedes character-related and
abstraction-pacing guidance in [DESIGN_SPEC.md](DESIGN_SPEC.md) (§8, §13,
§16-19) and supersedes Rev. 1 of this document per a self-review that
surfaced three unresolved problems (no ownable visual signature, no
replacement for the character's expressive role, uneven scene weighting).
Rev. 2 resolves all three. Everything in DESIGN_SPEC.md not explicitly
overridden here still holds (palette, typography, scroll architecture,
performance/a11y rules, "what not to do") and is not repeated.

This is a specification for what to build, not inspiration or implementation
code. Priority tags — **MUST**, **SHOULD**, **NICE** — appear throughout;
build in that order.

---

## 0. Locked decisions (source of truth)

- **No character.** The camera is first-person; the visitor is the
  protagonist.
- **The site's visual signature is blueprint ink** (see §1) — the
  engineer's own hand-drawn technical linework, physically present at the
  start, structural by the middle, pure floating line by the AI Lab, and
  gone entirely by the White Room. This is the one thing this site does
  that no reference site already does; protect it from dilution.
- **Human presence is carried by three combined devices** (see §2):
  authored curation (personality), a worn path (physical continuity), and a
  sparse first-person voice (an actual human voice, culminating in the
  existing White Room statement). The traveling-mug idea and the
  "always-one-step-behind" idea were considered and explicitly rejected —
  gimmick risk and horror-trope risk respectively.
- **Eight-scene structure**, Experiment folded into the AI Lab → White Room
  transition as a brief beat rather than a standalone stop: **Intro → Desk →
  Hallway → Lab → Engineering → AI Lab → White Room → Landscape**. Reads as
  *who I am → where I came from → what I built → how I think → what I
  explore → what I believe → what's next.*
- **Personality**: cinematic, technical, premium, personal-brand-first.
- **Art style**: stylized realism, detailed-but-selective environments,
  physically believable materials, cinematic lighting, restrained color,
  minimal/partially-diegetic UI, cinematic + subtle procedural motion,
  mostly passive with deliberate micro-interactions.
- **Accent**: `#C6511F` remains the single controlled highlight color.
- **Architecture**: the existing scroll/camera engine (`scrollState`
  singleton, `SCENE_BOUNDS`, waypoint camera easing in `ScrollRig.tsx`) is
  preserved as a system. One change is required within it: **`SCENE_BOUNDS`
  must move from nine equal ninths to unequal, scene-specific scroll
  runway** — Desk, Lab, and White Room need room for camera holds; Hallway
  and the AI Lab exit need less. This is a data change to the existing
  bounds table, not an architectural rewrite.

---

## 1. Overall visual language — the blueprint-ink system

The site's single ownable device: the engineer's own hand-drawn technical
notation — sketches, blueprints, schematic linework — appearing in four
states across the journey:

```
PAPER  →  ARCHITECTURE  →  FLOATING LINE  →  BLANK PAGE
(Intro/Desk)  (Engineering)   (AI Lab)         (White Room)
```

1. **Paper** (Intro, Desk): ink stays where ink normally lives — pinned
   blueprints, an open notebook, a hand-lettered sign. Fully grounded, no
   spectacle.
2. **Architecture** (Hallway, Lab, Engineering): the linework leaves the
   page and becomes structural — schematic lines etched/inlaid into doors,
   pod housings, and server racks, as if each room were built *from* a
   drawing rather than merely labeled by one.
3. **Floating line** (AI Lab, with the Experiment beat inside it): the
   etched lines detach from every surface as the walls fall away, leaving
   pure drawn line hanging in space — **MUST** be lit as a physical, matte
   material (graphite/charcoal catching directional or rim light), **MUST
   NOT** be self-emissive or glow. This is the load-bearing constraint of
   the whole device: the moment it starts glowing, it collapses back into
   the generic AI-hologram look this device exists to avoid.
4. **Blank page** (White Room): the ink is simply gone. One clean, lit
   surface. The payoff.

- **MUST**: this is the same substance throughout, not four different
  effects — one shader/material family, one line-drawing motion language
  (§6), reused everywhere ink appears.
- **MUST**: the Engineering → AI Lab transition device (previously a
  glowing "Packet" orb riding through the pipeline) is **replaced** with a
  single traveling ink stroke that traces the request's path as if being
  drawn in real time — the camera follows the stroke, not a sphere. This
  both removes the last glowing-orb cliché from the design and reuses the
  signature device as the transition mechanism instead of introducing a
  separate one.
- **REMOVED**: structural lattice (topology optimization) as a secondary
  device — it was the strongest runner-up and can be revisited later, but
  running two ownable devices in parallel would dilute both. Not spec'd
  further in this document.

## 2. Human presence — three combined devices

No character; no single stand-in object either. Three devices working
together, each doing a different job:

- **Authored curation** *(personality)*: a whiteboard/corkboard with
  crossed-out ideas and one circled decision at Desk; pinned notes near the
  Lab pods showing an early failed attempt next to the shipped version.
  Personality reads through *what this person chose to keep in view*, not
  through gesture.
- **Worn path** *(physical continuity)*: a worn line in the floor —
  dirt/stone at the Workshop entrance, scuff marks to the desk chair, a
  groove worn progressively smoother down the Hallway (mapping directly
  onto the career years already on the doors). It fades out once the world
  stops being physical (Engineering onward) and **reappears at Landscape**,
  continuing off past the frame — the visitor's own camera motion finishes
  the walk, rather than watching a character do it.
- **Sparse first-person voice** *(an actual voice)*: a small number of
  handwritten, physically-placed lines (taped to the monitor at Desk,
  scratched into a rack at Engineering) — **MUST** stay rare, 2-3 instances
  total before White Room, so the existing White Room statement reads as
  the culmination of a voice that's been quietly present, not an isolated
  caption.
- A single small recurring **maker's mark** (an etched personal symbol) —
  **MUST** appear at Intro, Desk, and get its clearest, most resolved
  appearance at Landscape (carved into a post or rock along the worn path)
  as the emotional resolution beat that replaces "character walks into the
  horizon."
- **REJECTED, do not build**: a traveling object (mug) as the *primary*
  presence device — gimmick risk if it's the main carrier rather than one
  detail among several. **REJECTED**: "always one step behind" (rocking
  chair, self-closing doors) as a recurring atmosphere — tips into
  horror-game territory if used more than once, if at all.

## 3. Geometry and asset philosophy

- **MUST**: replace primitive-built objects with purpose-modeled hero
  assets per §12.
- **MUST**: instance repeated elements from one hero asset — racks (×7),
  hallway doors (×5) — with the ink-etching pattern as the only per-instance
  variation (see below), not sculpted geometric differences.
- **REMOVED (was SHOULD in Rev. 1)**: per-instance sculptural variation
  (different cable routing, different notebook page) — cut outright. Not
  worth the effort for a small team; the ink-etching pattern already gives
  instances enough individual character.
- **MUST**: worn-path floor treatment (§2) is a shared material/decal
  system applied across Intro/Desk/Hallway/Landscape, not a per-scene
  bespoke asset.
- **MUST**: the maker's-mark motif is one very cheap, tiny asset reused
  everywhere it appears — highest reuse-to-cost ratio asset in the project.
- **MUST**: geometry stays stylized, not photoreal.

## 4. Materials / textures

- **MUST**: keep the existing warm neutral material palette from
  `lib/theme.ts` as the base; this redesign upgrades material *quality*, not
  the color language.
- **MUST**: the ink/linework material is one consistent family across every
  state it appears in (paper → etched → floating) — matte, non-emissive,
  reading through directional/rim lighting only (§1).
- **MUST**: material complexity scales down with scene priority (§13) —
  Desk highest, the AI Lab exit beat lowest.
- **SHOULD**: as the world moves from Engineering to AI Lab, materials lose
  surface complexity *in the same motion the ink device loses architectural
  support* — one dissolve, read through both material and geometry at once,
  not two separate effects layered on top of each other.

## 5. Lighting and post-processing

- **MUST**: one global light rig (ambient + directional) as base, scene
  accent lighting (doors/pods/racks) carrying mood difference, as today —
  but now art-directed per scene rather than uniform.
- **MUST**: bloom on genuinely emissive surfaces only (monitor, pod
  screens, active rack panels) — **MUST NOT** apply bloom to the ink
  linework (§1's non-negotiable constraint).
- **SHOULD**: subtle vignette and light grain, consistent across all
  scenes.
- **SHOULD**: lighting shifts from motivated/directional (real lamp, real
  sun) in physical scenes to more ambient/sourceless once architecture
  stops supporting the ink (AI Lab).
- **NICE**: depth of field, sparingly, only at Lab pod close-ups and the
  White Room hold-shot.
- **MUST NOT**: chromatic aberration, heavy vignette, or a generic
  teal-orange "cinematic LUT" look.
- **Acknowledged constraint**: post-processing is typically one global
  composer pass on the Canvas, not per-scene — the "dissolve" must therefore
  be sold primarily through geometry, material, and lighting per §1/§4/§5,
  with the post-processing stack staying uniform across scenes rather than
  pretending it can vary per scene.

## 6. Camera language

- **MUST**: smooth, deliberate, continuously eased (existing `ScrollRig.tsx`
  waypoint system, preserved).
- **MUST**: camera steadiness communicates world state — level and steady
  in physical scenes, looser/off-axis once the ink stops being
  architecturally supported.
- **MUST**: no orbit/drag/free-look anywhere.
- **MUST**: brief camera holds at Lab pods and White Room — this is the
  reason `SCENE_BOUNDS` needs unequal runway (§0); a hold inside an equal
  scroll slice either steals time from the rest of that scene or doesn't
  actually hold.
- **SHOULD**: the camera occasionally looks down enough to register the
  worn-path floor treatment where it's present — it's a device that only
  works if it's actually seen.
- **MUST**: at Landscape, the camera's own forward motion is what completes
  the worn path past the frame — this is the specific mechanic replacing
  "character walks toward horizon."

## 7. Motion / animation language

- **MUST**: every animation has a diegetic reason (unchanged from Rev. 1).
- **MUST**: ink linework animates as if being drawn by an unseen hand — a
  line resolving stroke by stroke, not growing/scaling mechanically. This is
  the one recurring motion signature tied to the ownable device and should
  be recognizable every time it appears (door schematics, rack etching, the
  Engineering → AI Lab transition stroke).
- **MUST**: motion pacing shifts with the dissolve arc — precise/mechanical
  early, fluid by Engineering (the traveling ink stroke), loose/organic by
  the AI Lab exit beat, near-still at White Room, one slow crane at
  Landscape.
- **SHOULD**: subtle procedural secondary motion (cable drift, screen
  flicker, dust in a light shaft) in physical scenes only.

## 8. UI / diegetic UI

- **MUST**: Nav and Landscape CTA/contact links stay plain DOM, redesigned
  type/spacing only.
- **MUST**: Lab project data is hybrid diegetic (pod screen content + DOM
  copy in parallel).
- **SHOULD**: Engineering pipeline labels partially diegetic (spatial
  labels near the traced ink stroke rather than full DOM text blocks).
- **MUST**: White Room text stays pure DOM poster-typography — and is now
  explicitly understood as the payoff of the sparse first-person voice
  device (§2), not an unrelated text block.
- **SHOULD NOT**: floating holographic panels or glass UI cards pretending
  to be 3D objects.

## 9. Interaction principles

- **MUST**: Lab pods — proximity-wake, hover reveals detail, click opens a
  case study.
- **SHOULD**: Engineering — hover near the traced ink stroke/pipeline
  surfaces stage description ahead of scroll threshold.
- **NICE**: hover on the Desk whiteboard/corkboard reveals a closer read of
  the curated notes.
- **MUST NOT**: any interaction inside Intro or White Room.
- **MUST**: consistent hover affordance using the accent color everywhere
  interaction exists.

## 10. Sound direction

Unchanged from Rev. 1 — **SHOULD** adopt, treated as structural (per-scene
ambient bed, transition beats tied to existing animation events, sparse
confirmation ticks only), **MUST** default muted, **MUST** stay silent at
White Room, **MUST NOT** use looping music or hover sounds. **NICE-to-defer**
— can ship after the visual redesign.

## 11. Scene-by-scene treatment (8 scenes)

### 1 — Intro (Workshop exterior)
- **Purpose**: establish identity and the visual language in the first
  three seconds. **Production tier**: MUST-full (MVP scene).
- **Feeling**: quiet, curious, grounded.
- **Environment**: workshop facade, door, worn path leading to it.
- **Key assets**: facade + door (hero), worn-path floor decal, maker's-mark
  motif (first appearance), a visible blueprint pinned near the door.
- **Materials**: full physical fidelity — highest tier alongside Desk.
- **Lighting**: motivated daylight, single warm key light.
- **Camera**: static pull-back, then slow push through the door as it
  opens.
- **Animation**: door hinge-open; ink on the pinned blueprint is static
  here (paper state, not yet moving).
- **Interaction**: none.
- **Content/UI**: name/role/tagline DOM overlay, unchanged copy.
- **Transition out**: camera passes through the door frame — literal
  aperture into Desk.

### 2 — Desk
- **Purpose**: what he does; carries the primary human-presence load.
  **Production tier**: MUST-full (MVP scene), highest overall.
- **Feeling**: focused, intimate, human.
- **Environment**: three-wall office interior, desk as sole focal object.
- **Key assets**: desk assembly (monitor/keyboard/notebook/lamp) — MUST;
  empty chair with worn scuff marks leading to it — MUST; whiteboard/
  corkboard with authored curation (crossed-out ideas, one circled
  decision) — MUST; open notebook with a sketched diagram (first
  "architecture"-adjacent ink appearance) — MUST; one handwritten note
  taped to the monitor (first sparse-voice instance) — MUST.
- **Materials**: highest fidelity in the project.
- **Lighting**: motivated lamp glow + soft window light; monitor wake
  paired with real light-intensity ramp + bloom.
- **Camera**: settles at seated eye-height facing the monitor.
- **Animation**: monitor wake, retimed with bloom.
- **Interaction**: hover/click on monitor cycles "what I build" content;
  NICE hover on whiteboard.
- **Content/UI**: existing screen text + tech-stack chips, DOM overlay.
- **Transition out**: camera pivots to the office's exit door — **MUST**
  render this as an explicit doorway threshold (matching the rigor of every
  other transition in the piece, correcting Rev. 1's vaguest transition) —
  corridor light/color visible through the doorway before the cut.

### 3 — Hallway (compressed)
- **Purpose**: career progression. **Production tier**: SHOULD-lighter —
  compressed deliberately, not a hero scene.
- **Feeling**: forward momentum, quiet progression.
- **Environment**: shortened corridor, 5 doors.
- **Key assets**: one door hero asset, instanced ×5, with etched
  year/role schematic labels (architecture-state ink).
- **Materials**: mid priority.
- **Lighting**: sequential activation, but only the final door gets a full
  beat.
- **Camera**: forward glide, subtle handheld drift; **MUST** move faster
  through doors 1-4 than Rev. 1's per-door dwell — this is the compression.
- **Animation**: only the 5th door gets full panel + light activation;
  doors 1-4 register in passing.
- **Interaction**: NICE hover preview on any door.
- **Content/UI**: year/role labels, DOM overlay unchanged (2018→2026).
- **Worn path**: floor groove visibly deepens/smooths toward the far end,
  mapping onto accumulated years.
- **Transition out**: the 5th (2026, "AI Engineering") door is the literal
  entrance to Lab.

### 4 — Lab (projects)
- **Purpose**: what he's built. **Production tier**: MUST, second-highest
  content-serving priority after Desk.
- **Feeling**: proud, precise, evidentiary.
- **Environment**: room with 3 project pods.
- **Key assets**: one pod hero asset (×3) + pedestal, each with etched
  schematic linework specific to that project's actual system diagram
  (architecture-state ink, directly content-driven); pinned early-attempt
  vs. shipped-version notes near each pod (authored curation).
- **Materials**: high priority; screens must read as genuinely displaying
  content.
- **Lighting**: pod screen as real emissive source with bloom.
- **Camera**: slows and holds at each pod — part of why `SCENE_BOUNDS`
  needs unequal runway here.
- **Animation**: proximity-wake per pod, retimed with bloom.
- **Interaction**: hover reveals extra detail, click opens a case study.
- **Content/UI**: hybrid diegetic — title/stack on pod screen + DOM copy
  (Education AI Platform, AI Automation Suite, Product System).
- **Transition out**: camera passes through a pod's screen/housing into
  the server room — racks faintly visible through the glass beforehand.

### 5 — Engineering (pipeline)
- **Purpose**: how he thinks; systems credibility. **Production tier**:
  SHOULD.
- **Feeling**: systematic, competent, in motion.
- **Environment**: room with 7 racks.
- **Key assets**: one rack hero asset (×7) with etched schematic ink on
  its surface (architecture-state, the ink now fully load-bearing in the
  room's structure); one line scratched into a rack near the exit (second
  sparse-voice instance).
- **Materials**: mid-high priority, real metal/etching detail.
- **Lighting**: sequential node activation + the ink-stroke's own subtle
  self-lit trace (still matte/non-emissive per §5).
- **Camera**: lower height, more active tracking, building toward the
  stroke-follow transition.
- **Animation**: node activation per threshold; the traced ink stroke
  travels the pipeline continuously (**replaces** the Rev. 1 "Packet" orb).
- **Interaction**: SHOULD hover near a node/stroke segment surfaces its
  stage description.
- **Content/UI**: pipeline labels (REQUEST→RESPONSE), partially diegetic.
- **Transition out**: camera follows the ink stroke as it leaves the
  pipeline and enters AI Lab — the drawing itself is the transition
  vehicle, not a separate object.

### 6 — AI Lab (with the Experiment beat folded into its exit)
- **Purpose**: what he explores; the site's strongest differentiation
  opportunity. **Production tier**: SHOULD, high visual ambition despite
  lower asset count than Lab/Engineering.
- **Feeling**: the pivot — still legible, now abstract.
- **Environment**: open space, walls gone — the ink's floating-line state
  (§1) is the entire environment; no separate "node" objects.
- **Key assets**: **none new** — this scene is built from the same
  ink-linework system established at Desk/Hallway/Lab/Engineering, now
  unsupported by architecture. This removes the Rev. 1 "stage-node hero
  asset" entirely, along with the generic-AI-crystal risk it carried.
- **Materials**: matte, non-emissive linework only — **MUST NOT** glow
  (§1, §5, load-bearing constraint).
- **Lighting**: fully ambient/sourceless.
- **Camera**: motion becomes non-linear/off-axis, echoing the loosened
  line structure.
- **Animation**: lines continue resolving stroke-by-stroke (§7); no
  discrete "node" activation events, since there are no nodes.
- **Interaction**: SHOULD hover near a line cluster surfaces its RAG-stage
  description ahead of scroll threshold.
- **Content/UI**: RAG stage labels (DOCUMENTS→ANSWER), partially diegetic,
  attached to line clusters rather than objects.
- **Experiment beat (exit, folded, brief)**: as the linework thins further
  toward White Room, it briefly loosens into scattered, half-finished
  doodles and crossed-out sketches — the six experiments read as a glimpse
  of unresolved sketchbook margins, not six staged objects. **Production
  tier**: NICE, lowest-cost beat in the project by design.
- **Transition out**: the ink keeps thinning until nothing is left — direct
  dissolve into White Room, no hard cut.

### 7 — White Room
- **Purpose**: what he believes; the emotional pause. **Production tier**:
  MUST-full (MVP scene) despite near-zero geometry.
- **Feeling**: still, quiet, deliberate.
- **Environment**: near-empty, unchanged from today's implementation.
- **Key assets**: none — the ink is gone; this is the blank-page payoff of
  §1. Only the wall/light material itself is produced here.
- **Materials**: minimal but high-craft — the quality of the emptiness is
  the deliverable.
- **Lighting**: soft, bright, even — deliberate contrast to every
  preceding scene.
- **Camera**: near-stops, one long held shot. **MUST NOT** receive
  additional "cinematic" camera work.
- **Animation**: none.
- **Interaction**: none.
- **Content/UI**: the existing three-line statement, pure DOM
  poster-typography, now explicitly the culmination of the sparse
  first-person voice device (§2), not an isolated text block.
- **Transition out**: aperture-widening move — the empty frame expands
  into open daylight.

### 8 — Landscape (ending)
- **Purpose**: what's next; the last impression and the resolution of the
  human-presence arc. **Production tier**: MUST-full (MVP scene) — its
  budget is specifically for the worn-path and maker's-mark payoff, not
  indiscriminate general fidelity.
- **Feeling**: open, calm, forward-looking, resolved.
- **Environment**: exterior terrain, mountain silhouettes.
- **Key assets**: terrain/mountain silhouette set; the worn path,
  reappearing here and continuing off past the frame; the maker's mark,
  carved into a post or rock along the path — its clearest, most resolved
  appearance, replacing "character walks into the horizon."
- **Materials**: high fidelity concentrated on the path and mark
  specifically — the ground/terrain around them can be simpler.
- **Lighting**: open daylight, soft atmospheric fog for depth.
- **Camera**: crane-out/pull-back-and-up; **MUST** register the worn path
  visibly continuing forward as the camera's own motion "finishes" it.
- **Animation**: one slow camera move; no object animation needed.
- **Interaction**: social links plain DOM.
- **Content/UI**: "LET'S BUILD SOMETHING." + GitHub/LinkedIn/Email, DOM
  overlay — **note**: `SOCIAL_LINKS` in `constants/site.ts` are still
  placeholder URLs and must be replaced before launch (non-3D task).
- **Transition out**: none — terminal, camera holds.

## 12. Transition design summary

Every transition is an environmental continuity device already latent in
the scene geometry — a door, pod glass, the traced ink stroke, a dissolve,
an aperture — rather than a scroll-position cut. The Engineering → AI Lab
transition now specifically reuses the site's ownable device (the ink
stroke) instead of a separate glowing-orb mechanic, which both removes a
cliché and tightens the design around one consistent idea. Desk → Hallway
now has an explicit doorway threshold, closing the one gap identified in
Rev. 1's transition review.

## 13. Asset priority list

1. **MUST** — Desk assembly (monitor, keyboard, notebook, lamp)
2. **MUST** — Empty chair + worn scuff-mark decal
3. **MUST** — Whiteboard/corkboard with authored-curation notes
4. **MUST** — Workshop facade + door
5. **MUST** — Worn-path floor material/decal system (shared across Intro/
   Desk/Hallway/Landscape)
6. **MUST** — Maker's-mark motif (single tiny asset, highest reuse ratio
   in the project)
7. **MUST** — Ink linework material/shader family (paper/etched/floating
   states — this is the core signature system, treat as a first-class
   asset in its own right, not a texture detail)
8. **MUST** — Lab pod (hero, ×3) + pedestal, with per-pod etched schematic
   content
9. **MUST** — Server rack (hero, ×7) with etched schematic surface
10. **SHOULD** — Hallway door (hero, ×5) with etched year/role labels
11. **SHOULD** — Landscape terrain/mountain silhouette set
12. **SHOULD** — Global ground/floor material system
13. **NICE** — Experiment-beat loose sketch forms (lowest-cost by design)

Note the Rev. 1 "AI Lab stage-node hero asset" and "Packet/Query orb" are
both **removed** from this list — AI Lab is built from asset #7 (already
required elsewhere) with no architecture, and the orb is replaced by the
same ink-stroke system used in Engineering. This reduces total unique
hero-asset count versus Rev. 1, not increases it.

## 14. Scene production priority

MVP tier (**MUST-full**, build first): **Desk, Intro, White Room,
Landscape** — these four carry the identity, the signature device's start
and end states, and the entire human-presence arc's resolution.

Second tier (**SHOULD**, full treatment once MVP ships): **Lab,
Engineering**.

Lighter tier (**SHOULD/NICE**, compressed or minimal by design, not by
budget shortfall): **Hallway** (compressed per §11), **AI Lab** (built
from shared assets, ambitious in craft but cheap in unique asset count),
**Experiment beat** (folded, lowest cost in the project).

## 15. Performance constraints

- **MUST**: gate scene-specific point lights to their active scroll
  window, not permanently live across all scenes.
- **MUST**: configure Draco/Meshopt before the first hero asset export.
- **MUST**: real GPU instancing for racks (×7) and doors (×5).
- **SHOULD**: per-scene lazy mount/dispose once real assets exist.
- **MUST**: documented mobile-disable path for post-processing from the
  start.
- **Note**: the ink-stroke transition device (replacing the orb) is
  cheaper to render than a modeled/animated character or a particle-heavy
  node field — line/ribbon geometry with a simple draw-in shader is
  lightweight relative to what it replaces, a net performance win from the
  device change itself.

## 16. Mobile / reduced-motion treatment

- **MUST**: preserve `showCinematic` + `StaticFallback` architecture
  unchanged.
- **MUST**: mobile degrades hero assets via LOD, never placeholder swaps.
- **MUST**: post-processing is first to strip on mobile/reduced-motion.
- **SHOULD**: expand `StaticFallback.tsx` to include still renders of each
  MVP-tier scene's hero assets, not text-only.
- **MUST**: expand the mobile `simplified` flag beyond shadow-disabling to
  also reduce point-light count and geometry LOD.
- **MUST**: sound stays default-off on mobile and reduced-motion, no
  platform exception.
- **Note**: the ink linework system (matte, non-emissive, no particle
  count to reduce) degrades unusually gracefully on mobile relative to a
  particle/node-based AI Lab — another practical benefit of the chosen
  device.

---

*This document is the source of truth for the visual redesign. Read
alongside [DESIGN_SPEC.md](DESIGN_SPEC.md) (original master brief, still
authoritative outside superseded sections), [ARCHITECTURE.md](ARCHITECTURE.md)
(scroll/camera engine — note the required `SCENE_BOUNDS` rebalancing per
§0/§6), and [3D_MODELS.md](3D_MODELS.md) (asset-loading mechanics).*
