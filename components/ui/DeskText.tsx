import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { DESK_SCENE } from '@/constants/scenes/desk';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

type DeskTextProps = {
  reducedMotion: boolean;
};

// screen copy reveals first, then the tech stack chips, in the back half of
// the desk scene's local progress range
const COPY_RANGE: [number, number] = [0.55, 0.8];
const STACK_RANGE: [number, number] = [0.8, 1];

export default function DeskText({ reducedMotion }: DeskTextProps) {
  const rafRef = useRef<number | null>(null);

  useGSAP(() => {
    if (reducedMotion) {
      // the reduced-motion fallback is a single static shot of Scene 01;
      // later scenes stay hidden until a proper non-cinematic, stacked
      // fallback layout exists for the full journey (see docs/ARCHITECTURE.md)
      gsap.set('.desk-copy, .desk-stack', { opacity: 0, y: 10 });
      return;
    }

    gsap.set('.desk-copy, .desk-stack', { opacity: 0, y: 10 });

    const tick = () => {
      const local = localProgress(scrollState.progress, SCENE_BOUNDS.desk[0], SCENE_BOUNDS.desk[1]);
      const copy = easeInOutCubic(localProgress(local, COPY_RANGE[0], COPY_RANGE[1]));
      const stack = easeInOutCubic(localProgress(local, STACK_RANGE[0], STACK_RANGE[1]));
      gsap.set('.desk-copy', { opacity: copy, y: (1 - copy) * 10 });
      gsap.set('.desk-stack', { opacity: stack, y: (1 - stack) * 10 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-16 md:pb-24 text-center px-6'>
      <div className='desk-copy max-w-md'>
        {DESK_SCENE.screenLines.map((line, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'text-2xl md:text-3xl font-bold tracking-tight text-ink'
                : i === 1
                  ? 'mt-2 text-base md:text-lg text-ink'
                  : 'mt-3 text-sm md:text-base text-warmgray'
            }
          >
            {line}
          </p>
        ))}
      </div>
      <ul className='desk-stack mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1'>
        {DESK_SCENE.techStack.map((tech) => (
          <li key={tech} className='text-xs font-mono uppercase tracking-widest text-accent'>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}
