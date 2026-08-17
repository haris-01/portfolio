import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { EXPERIMENT_SCENE } from '@/constants/scenes/experiment';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

const ITEM_WINDOW = 1 / EXPERIMENT_SCENE.experiments.length;
const FADE_MARGIN = ITEM_WINDOW * 0.15;

// Only ever rendered as part of the cinematic experience (pages/index.tsx's
// showCinematic) — the reduced-motion path renders StaticFallback instead.
export default function ExperimentText() {
  const rafRef = useRef<number | null>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const lastIndex = useRef(-1);

  useGSAP(() => {
    gsap.set('.experiment-label', { opacity: 0 });

    const tick = () => {
      const local = localProgress(scrollState.progress, SCENE_BOUNDS.experiment[0], SCENE_BOUNDS.experiment[1]);
      const index = Math.min(Math.floor(local / ITEM_WINDOW), EXPERIMENT_SCENE.experiments.length - 1);

      if (index !== lastIndex.current && nameRef.current && descriptionRef.current) {
        const item = EXPERIMENT_SCENE.experiments[index];
        nameRef.current.textContent = item.name;
        descriptionRef.current.textContent = item.description;
        lastIndex.current = index;
      }

      const withinWindow = local / ITEM_WINDOW - index;
      const fadeIn = easeInOutCubic(localProgress(withinWindow, 0, FADE_MARGIN / ITEM_WINDOW));
      const fadeOut = 1 - easeInOutCubic(localProgress(withinWindow, 1 - FADE_MARGIN / ITEM_WINDOW, 1));
      const opacity = local <= 0 ? 0 : Math.min(fadeIn, fadeOut);

      gsap.set('.experiment-label', { opacity });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-16 md:pb-24 text-center'>
      <div className='experiment-label'>
        <p ref={nameRef} className='font-mono text-2xl md:text-3xl font-bold tracking-widest text-accent' />
        <p ref={descriptionRef} className='mt-2 text-sm md:text-base text-warmgray' />
      </div>
    </div>
  );
}
