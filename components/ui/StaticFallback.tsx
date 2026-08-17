import { SITE, SOCIAL_LINKS } from '@/constants/site';
import { DESK_SCENE } from '@/constants/scenes/desk';
import { HALLWAY_SCENE } from '@/constants/scenes/hallway';
import { LAB_SCENE } from '@/constants/scenes/lab';
import { ENGINEERING_SCENE } from '@/constants/scenes/engineering';
import { AI_LAB_SCENE } from '@/constants/scenes/ai';

// Non-cinematic, stacked presentation of every scene's content — used when
// prefers-reduced-motion is set (spec §28: "replace cinematic camera
// movement with normal section transitions") and when WebGL is unavailable.
// No canvas, no scroll-driven camera, just normal document flow.
export default function StaticFallback() {
  return (
    <>
      <section
        id='about'
        className='min-h-screen flex flex-col items-center justify-center text-center px-6'
      >
        <h2 className='text-4xl md:text-6xl font-bold tracking-tight text-ink'>{SITE.name}</h2>
        <p className='mt-3 text-lg md:text-xl text-ink'>{SITE.role}</p>
        <p className='mt-1 text-xs md:text-sm font-mono uppercase tracking-widest text-warmgray'>
          {SITE.tagline}
        </p>
      </section>

      <section id='work' className='min-h-screen flex flex-col items-center justify-center text-center px-6'>
        {DESK_SCENE.screenLines.map((line, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'text-2xl md:text-3xl font-bold tracking-tight text-ink'
                : i === 1
                  ? 'mt-2 text-base md:text-lg text-ink'
                  : 'mt-3 max-w-md text-sm md:text-base text-warmgray'
            }
          >
            {line}
          </p>
        ))}
        <ul className='mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1'>
          {DESK_SCENE.techStack.map((tech) => (
            <li key={tech} className='text-xs font-mono uppercase tracking-widest text-accent'>
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <section className='min-h-screen flex flex-col items-center justify-center px-6'>
        <h3 className='text-xs font-mono uppercase tracking-widest text-warmgray mb-8'>Career</h3>
        <ol className='flex flex-col gap-6 text-center'>
          {HALLWAY_SCENE.stages.map((stage) => (
            <li key={stage.year}>
              <p className='font-mono text-xs uppercase tracking-widest text-accent'>{stage.year}</p>
              <p className='mt-1 text-xl md:text-2xl font-bold tracking-tight text-ink'>{stage.role}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id='projects' className='min-h-screen flex flex-col items-center justify-center px-6'>
        <h3 className='text-xs font-mono uppercase tracking-widest text-warmgray mb-8'>Projects</h3>
        <ul className='flex flex-col gap-10 text-center max-w-md'>
          {LAB_SCENE.projects.map((project) => (
            <li key={project.title}>
              <p className='text-xl md:text-2xl font-bold tracking-tight text-ink'>{project.title}</p>
              <p className='mt-2 text-sm md:text-base text-warmgray'>{project.tagline}</p>
              <ul className='mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1'>
                {project.stack.map((tech) => (
                  <li key={tech} className='text-xs font-mono uppercase tracking-widest text-accent'>
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className='min-h-screen flex flex-col items-center justify-center px-6'>
        <h3 className='text-xs font-mono uppercase tracking-widest text-warmgray mb-8'>How it works</h3>
        <ol className='flex flex-col gap-6 text-center max-w-md'>
          {ENGINEERING_SCENE.stages.map((stage) => (
            <li key={stage.name}>
              <p className='font-mono text-lg md:text-xl font-bold tracking-widest text-accent'>{stage.name}</p>
              <p className='mt-1 text-sm text-warmgray'>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id='ai' className='min-h-screen flex flex-col items-center justify-center px-6'>
        <h3 className='text-xs font-mono uppercase tracking-widest text-warmgray mb-8'>RAG Pipeline</h3>
        <ol className='flex flex-col gap-6 text-center max-w-md'>
          {AI_LAB_SCENE.stages.map((stage) => (
            <li key={stage.name}>
              <p className='font-mono text-lg md:text-xl font-bold tracking-widest text-accent'>{stage.name}</p>
              <p className='mt-1 text-sm text-warmgray'>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id='contact' className='min-h-screen flex flex-col items-center justify-center text-center px-6'>
        <h3 className='text-2xl md:text-3xl font-bold tracking-tight text-ink'>Let&apos;s build something.</h3>
        <ul className='mt-6 flex gap-6 text-sm font-mono uppercase tracking-widest'>
          <li>
            <a href={SOCIAL_LINKS.github} className='text-warmgray hover:text-accent transition-colors'>
              GitHub
            </a>
          </li>
          <li>
            <a href={SOCIAL_LINKS.linkedin} className='text-warmgray hover:text-accent transition-colors'>
              LinkedIn
            </a>
          </li>
          <li>
            <a href={SOCIAL_LINKS.email} className='text-warmgray hover:text-accent transition-colors'>
              Email
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
