import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { ENGINEERING_SCENE } from '@/constants/scenes/engineering';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

const STAGE_WINDOW = 1 / ENGINEERING_SCENE.stages.length;
const FADE_MARGIN = STAGE_WINDOW * 0.15;

// Only ever rendered as part of the cinematic experience (pages/index.tsx's
// showCinematic) — the reduced-motion path renders StaticFallback instead.
export default function EngineeringText() {
  const rafRef = useRef<number | null>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const lastIndex = useRef(-1);

  useGSAP(() => {
    gsap.set('.engineering-label', { opacity: 0 });

    const tick = () => {
      const local = localProgress(scrollState.progress, SCENE_BOUNDS.engineering[0], SCENE_BOUNDS.engineering[1]);
      const index = Math.min(Math.floor(local / STAGE_WINDOW), ENGINEERING_SCENE.stages.length - 1);

      if (index !== lastIndex.current && nameRef.current && descriptionRef.current) {
        const stage = ENGINEERING_SCENE.stages[index];
        nameRef.current.textContent = stage.name;
        descriptionRef.current.textContent = stage.description;
        lastIndex.current = index;
      }

      const withinWindow = local / STAGE_WINDOW - index;
      const fadeIn = easeInOutCubic(localProgress(withinWindow, 0, FADE_MARGIN / STAGE_WINDOW));
      const fadeOut = 1 - easeInOutCubic(localProgress(withinWindow, 1 - FADE_MARGIN / STAGE_WINDOW, 1));
      const opacity = local <= 0 ? 0 : Math.min(fadeIn, fadeOut);

      gsap.set('.engineering-label', { opacity });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-16 md:pb-24 text-center'>
      <div className='engineering-label'>
        <p ref={nameRef} className='font-mono text-2xl md:text-3xl font-bold tracking-widest text-accent' />
        <p ref={descriptionRef} className='mt-2 text-sm md:text-base text-warmgray' />
      </div>
    </div>
  );
}
