import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { AI_LAB_SCENE } from '@/constants/scenes/ai';
import { EXPERIMENT_SCENE } from '@/constants/scenes/experiment';
import { EXPERIMENT_BEAT_START } from '@/components/world/scenes/aiLabLayout';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

const STAGE_COUNT = AI_LAB_SCENE.stages.length;
const BEAT_COUNT = EXPERIMENT_SCENE.experiments.length;
const STAGE_WINDOW = EXPERIMENT_BEAT_START / STAGE_COUNT;
const BEAT_WINDOW = (1 - EXPERIMENT_BEAT_START) / BEAT_COUNT;

// Only ever rendered as part of the cinematic experience (pages/index.tsx's
// showCinematic) — the reduced-motion path renders StaticFallback instead.
//
// Cycles through the RAG pipeline stages, then — once local progress passes
// EXPERIMENT_BEAT_START — through the folded "experiment" beat items, which
// used to be a standalone scene/text component (ExperimentText). Both lists
// share this one label so the beat reads as part of AI lab, not a separate
// stop (docs/DESIGN_DIRECTION.md Rev. 2).
export default function AiLabText() {
  const rafRef = useRef<number | null>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const lastIndex = useRef(-1);

  useGSAP(() => {
    gsap.set('.ai-lab-label', { opacity: 0 });

    const tick = () => {
      const local = localProgress(scrollState.progress, SCENE_BOUNDS.aiLab[0], SCENE_BOUNDS.aiLab[1]);

      let windowStart: number;
      let windowSize: number;
      let combinedIndex: number;
      let item: { name: string; description: string };

      if (local < EXPERIMENT_BEAT_START) {
        const index = Math.min(Math.floor(local / STAGE_WINDOW), STAGE_COUNT - 1);
        windowStart = index * STAGE_WINDOW;
        windowSize = STAGE_WINDOW;
        combinedIndex = index;
        item = AI_LAB_SCENE.stages[index];
      } else {
        const beatIndex = Math.min(Math.floor((local - EXPERIMENT_BEAT_START) / BEAT_WINDOW), BEAT_COUNT - 1);
        windowStart = EXPERIMENT_BEAT_START + beatIndex * BEAT_WINDOW;
        windowSize = BEAT_WINDOW;
        combinedIndex = STAGE_COUNT + beatIndex;
        item = EXPERIMENT_SCENE.experiments[beatIndex];
      }

      if (combinedIndex !== lastIndex.current && nameRef.current && descriptionRef.current) {
        nameRef.current.textContent = item.name;
        descriptionRef.current.textContent = item.description;
        lastIndex.current = combinedIndex;
      }

      const withinWindow = (local - windowStart) / windowSize;
      const fadeIn = easeInOutCubic(localProgress(withinWindow, 0, 0.15));
      const fadeOut = 1 - easeInOutCubic(localProgress(withinWindow, 0.85, 1));
      const opacity = local <= 0 ? 0 : Math.min(fadeIn, fadeOut);

      gsap.set('.ai-lab-label', { opacity });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-16 md:pb-24 text-center'>
      <div className='ai-lab-label'>
        <p ref={nameRef} className='font-mono text-2xl md:text-3xl font-bold tracking-widest text-accent' />
        <p ref={descriptionRef} className='mt-2 text-sm md:text-base text-warmgray' />
      </div>
    </div>
  );
}
