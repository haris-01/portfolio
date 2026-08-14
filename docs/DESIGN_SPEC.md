# Immersive 3D Portfolio — Master Design & Development Spec

This is the full design brief that governs every phase of this portfolio.
Phase 1 (this codebase) implements the architecture in
[ARCHITECTURE.md](ARCHITECTURE.md) plus Scene 01 (§7–9 below). Everything
else here is the target for later phases — see
[ADDING_A_SCENE.md](ADDING_A_SCENE.md) for how to build toward it
incrementally.

---

## 1. Role

Senior creative director, interaction designer, 3D art director, UX designer,
and frontend engineer specializing in immersive WebGL experiences, designing
and building an exceptional personal portfolio for a software engineer
specializing in frontend engineering, full-stack systems, AI engineering,
RAG, automation, and product development.

This is NOT a conventional portfolio website. It should feel like an
**interactive short film / digital world that happens to be a portfolio**.
The visitor should feel like they are physically moving through the
engineer's world as they scroll.

The experience must be: visually memorable, technically impressive,
intuitive, fast, elegant, cinematic, playful in small doses, professional
enough for recruiters/clients/senior engineers, understandable without
instructions, usable on desktop and mobile, accessible where practical,
SEO-friendly, and performant.

Core principle:

> **The visitor should explore a world, not browse a collection of website
> sections.**

## 2. Core concept

A continuous 3D journey through an engineer's world. The visitor begins
outside a stylized engineering workshop. Scrolling physically moves the
camera through the environment, gradually revealing: Introduction, About,
Career/experience, Projects, Engineering/architecture, AI/RAG/experimentation,
Personal philosophy, Contact.

Should feel like **a cinematic journey through a digital engineering
workshop**. Should NOT feel like: a game, a sci-fi movie, a cyberpunk
website, an AI SaaS landing page, a generic Three.js demo, or a Dribbble
concept with no usable content.

## 3. Visual theme

Stylized 3D, cinematic lighting, architectural environments, warm neutral
materials, subtle industrial details, restrained colors, excellent
typography, large negative space, choreographed camera movement.

Closer to: premium animated film environments, architectural visualization,
beautifully designed indie games, technical illustration, editorial design,
modern product design. NOT cyberpunk, gaming dashboards, cryptocurrency
sites, or neon AI websites.

## 4. Color system

Avoid: purple gradients, neon blue, glowing magenta, rainbow gradients,
excessive cyan, holographic interfaces everywhere.

Base palette:

```
Background:     #F3F1EB
Primary Ink:    #171717
Dark Metal:     #30302E
Warm Gray:      #8F8B82
Light Surface:  #E8E5DD
```

One signature accent color, used selectively (active nav, important project
details, small lights, indicators, interactive objects, CTA, subtle
environmental details) — never dominating the site. Prefer burnt orange,
warm coral, cobalt, or muted lime. Not purple.

> Implemented as `#C6511F` (burnt orange) — see the `accent` token in
> [tailwind.config.ts](../tailwind.config.ts).

## 5. Typography

Modern grotesk/sans-serif for primary UI (Geist, Inter, IBM Plex Sans,
Satoshi). Monospace selectively for technical metadata (years, technologies,
system labels, small data indicators) — not everywhere. No oversized
gradient typography. Editorial and technical feel. Uppercase labels used
sparingly.

## 6. The world

One coherent fictional physical world, consistent visual language — not five
unrelated 3D scenes. Environments transition naturally into one another, feel
like one building or connected environment:

```
OUTSIDE → WORKSHOP → DESK → HALLWAY → PROJECT LAB →
ENGINEERING ROOM → AI LAB → WHITE SPACE → OUTSIDE / LANDSCAPE
```

## 7. Scene 01 — Introduction *(implemented)*

Camera begins wide/far, quiet environment: ground, subtle landscape,
workshop building, a few trees/architectural elements, soft atmospheric
depth, minimal particles, one visible character. Not visually noisy — the
visitor should immediately understand where to look.

Camera: wide establishing shot → approaches building → moves toward entrance
→ door becomes visible → door opens → camera enters. Slow and cinematic,
never violent acceleration, no nausea-inducing motion.

## 8. Character

A small stylized human character representing the portfolio owner. Not
photorealistic — stylized low-poly/semi-minimal, simple enough to animate.
Can stand, walk, sit, look around, interact with objects, open doors, operate
equipment, react subtly. Subtle expressions, not cartoonishly exaggerated.
Avoid: goofy emojis, giant heads, meme characters, anime styling, overly cute
mascots. Storytelling device, not the main attraction.

> Phase 1 uses a primitive placeholder (capsule + sphere). Real
> model guidance is a follow-up deliverable, tracked in the README's
> "What's next" section.

## 9. Intro text *(implemented)*

Near the workshop entrance:

```
HARIS SAEED
Software Engineer
AI · Systems · Product
```

Integrated naturally into the environment, discovered as the visitor enters
the world — not a giant conventional hero section.

## 10. Scene 02 — The desk

Focal point: a desk with monitor, keyboard, mouse, notebook, pen, coffee cup,
headphones, small technical objects, subtle cables, desk lamp, plant/personal
object. Believable, not filled with random "developer props."

As camera approaches: monitor wakes up → screen glow → keyboard becomes
active → character sits → screen displays intro copy, then tech stack list.
Monitor becomes the transition into the next section.

## 11. Scene 03 — Career hallway

Represents time; doors represent major career stages (e.g. year + role
label). Subtle visual identity per door. As user scrolls: camera moves
forward, lights activate, doors open slightly, environmental details change,
timeline info appears. Visitor continues moving forward — not every door is
a separate page.

## 12. Scene 04 — Project lab

Major visual highlight. 3–5 project installations, each represented by a
physical object/machine (terminal, machine, display, server, robotic
mechanism, projection, data visualization, miniature environment). Each
project visually distinct.

## 13. Project interaction

Scrolling toward a project: object activates → lights on → subtle animation
→ camera approaches → title appears → tech stack appears → content
transitions into a 2D case study (problem, solution, architecture, technical
decisions, result, screenshots/demo — a real usable webpage layer). Scrolling
after the case study transitions back into the 3D lab. This transition is
essential.

## 14. 3D → 2D transitions

3D for discovery, storytelling, atmosphere, transitions, visual metaphors. 2D
for detailed project info, architecture, text, code, screenshots, technical
explanations, contact, navigation. 3D is the cinematic layer; the DOM/UI is
the information layer.

## 15. Scene 05 — Engineering room

Server racks, monitors, network connections, architecture diagrams, data
flows, terminal screens, database visualizations. As the user scrolls, a
request visibly travels through the system:

```
REQUEST → API → SERVICE → DATABASE → QUEUE → WORKER → RESPONSE
```

Purpose: communicate systems understanding, not spectacle.

## 16. Scene 06 — AI lab

Most experimental environment; moves away from the physical workshop,
gradually more abstract — documents, text fragments, embeddings, vector
points, connections, semantic clusters, flowing data, subtle particles,
nodes. Represents the RAG pipeline, visitor literally moves through it:

```
DOCUMENTS → PARSING → CHUNKS → EMBEDDINGS →
VECTOR SEARCH → RETRIEVAL → LLM → ANSWER
```

Avoid: giant brains, robot heads, glowing humanoids, floating "AI" letters,
generic neural-network backgrounds. Technical and elegant, not clichéd.

## 17. Experiment room

Playful room after the serious AI section — smaller experiments (RAG, agent,
computer vision, automation, generative AI, WebGL prototypes). Interactive;
character can inspect objects; some respond to cursor movement or animate on
approach. Should feel like "this engineer likes experimenting."

## 18. The white room

After the complexity, remove almost everything — bright, minimal, no
clutter, just the character and one statement, e.g.:

```
I LIKE TURNING
COMPLICATED SYSTEMS
INTO SIMPLE EXPERIENCES.
```

The emotional pause. Extremely minimal — no lengthy copy.

## 19. Final scene — landscape

White room opens into a landscape; workshop visible behind the character;
camera gradually pulls away. Calm environment — distant mountains, subtle
sky, soft atmospheric perspective, simple terrain. Journey complete:

```
LET'S BUILD SOMETHING.
GitHub · LinkedIn · Email
```

Character walks toward the horizon. End.

## 20. Scroll behavior

Scroll position drives camera position/rotation, object animation,
environment animation, lighting, text opacity, UI transitions. Use
scroll-driven animation carefully — the user should feel they're controlling
the camera; the page must never feel like a slideshow.

> Implemented via the `scrollState` singleton — see
> [ARCHITECTURE.md](ARCHITECTURE.md).

## 21. Camera principles

Smooth, deliberate, cinematic, predictable. Avoid: spinning camera, sudden
zoom, excessive parallax, camera shake, rapid perspective changes, motion
sickness. Use easing. Should feel like walking/flying/gliding, not being
thrown through a video game.

## 22. Object animation

Objects animate because something meaningful is happening (monitor turns on,
door opens, server activates, machine starts, document gets processed, data
travels, character walks, lamp turns on) — never because it "looks cool"
(no random spinning cubes, floating spheres, pulsing shapes, exploding
particles). Every animation must have a reason.

## 23. Environmental details

Environmental storytelling via notes, sketches, diagrams, cables, books,
terminal windows, small prototype devices, unfinished experiments, coffee
cup, headphones, small personal artifacts — lived-in, not cluttered/messy.

## 24. UI

Extremely minimal fixed navigation:

```
HARIS
ABOUT · WORK · PROJECTS · AI · LAB · CONTACT
```

Small typography, never overpowering the 3D world. Include a "Skip
experience" quick-navigation mechanism; users must be able to jump directly
to About, Projects, Experience, AI, Contact.

> Nav + skip control implemented in
> [components/ui/Nav.tsx](../components/ui/Nav.tsx).

## 25. Responsive design

Desktop is the primary cinematic experience. Mobile must NOT attempt to
reproduce every complex 3D interaction: simplify geometry, reduce object
count, simplify camera movement, reduce particle effects, shorter
transitions, convert complex 3D interactions to 2D equivalents where
necessary. Content must remain fully accessible — don't make mobile users
fight a 3D engine.

> Implemented via `useIsMobile` + the `simplified` prop threaded through
> `WorldCanvas` → scene/camera-rig components.

## 26. Performance

First-class requirement: fast initial load, progressive/lazy-loaded scenes,
compressed textures, optimized geometry, minimal draw calls, instancing where
appropriate, LOD where useful, avoid unnecessarily large models, avoid
loading the entire world at once. Degrade gracefully on weaker devices. If
WebGL is unavailable, show a beautiful 2D version of the portfolio.

> WebGL fallback implemented via `useWebGLSupport`; per-scene lazy loading
> is a later-phase concern once multiple scenes exist.

## 27. Technology

```
Next.js · React · TypeScript
React Three Fiber · Three.js · @react-three/drei
GSAP · GSAP ScrollTrigger
Tailwind CSS
```

HTML/React for actual textual content; Three.js/R3F for the visual world. Do
not build the entire site as a canvas.

## 28. Accessibility

Keyboard navigation, readable text, sufficient contrast, reduced-motion mode,
normal navigation fallback, accessible links, semantic HTML. When
`prefers-reduced-motion` is set, replace cinematic camera movement with
normal section transitions.

## 29. SEO

Must still behave like a real website: proper metadata, Open Graph, semantic
headings, crawlable project content, accessible links, structured page
hierarchy. Do not hide the entire portfolio inside WebGL.

## 30. What not to do

**Visual clichés:** purple AI gradients, neon cyberpunk, glowing brains,
robot heads, floating AI particles everywhere, holographic UI panels,
excessive glassmorphism, giant gradient text, floating 3D spheres, random
cubes/geometric shapes, crypto aesthetics, generic space/galaxy backgrounds,
excessive stars, generic "AI" holograms.

**UX mistakes:** forcing users through the entire animation, unreadable
text, hidden navigation, making the user wait for animations, GPU
dependency, prioritizing 3D over content, animation that exists only because
it looks cool, making every section interactive, a 90-second intro before
showing who the person is.

**Design mistakes:** huge cards everywhere, everything rounded, excessive
shadows, overused gradients, ten accent colors, massive amounts of tiny
text, visual noise, everything moving simultaneously.

## 31. Experience rule

Every scene must answer one question:

| Scene | Question |
|---|---|
| Intro | Who is this? |
| Desk | What does he do? |
| Hallway | How did he get here? |
| Project Lab | What has he built? |
| Engineering Room | How does he think? |
| AI Lab | What is he exploring? |
| Experiment Room | What does he do beyond his work? |
| White Room | What does he believe? |
| Landscape | What's next? |

If a scene doesn't answer a meaningful question, remove it.

## 32. The most important rule

Don't optimize for "Wow, look at this Three.js animation." Optimize for
"Wow, I remember this person." The technology should disappear behind the
experience. The visitor should remember the journey, the personality, the
projects, the engineering ability, the AI work, the visual identity. **The 3D
is the medium, not the message.**

## 33. Final experience

```
CINEMATIC STORYTELLING + 3D ENVIRONMENT + SCROLL-DRIVEN CAMERA +
REAL PROJECT CASE STUDIES + TECHNICAL STORYTELLING +
SUBTLE CHARACTER ANIMATION + EXCELLENT TYPOGRAPHY + FAST UX
```

Target emotional response: "I've never seen a portfolio like this,"
immediately followed by "And I actually understand what he does."
