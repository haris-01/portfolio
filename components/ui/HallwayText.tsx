import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { HALLWAY_SCENE } from '@/constants/scenes/hallway';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

type HallwayTextProps = {
  reducedMotion: boolean;
};

const DOOR_WINDOW = 1 / HALLWAY_SCENE.stages.length;
const FADE_MARGIN = DOOR_WINDOW * 0.15;

export default function HallwayText({ reducedMotion }: HallwayTextProps) {
  const rafRef = useRef<number | null>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const lastIndex = useRef(-1);

  useGSAP(() => {
    if (reducedMotion) {
      gsap.set('.hallway-label', { opacity: 0 });
      return;
    }

    gsap.set('.hallway-label', { opacity: 0 });

    const tick = () => {
      const hallwayLocal = localProgress(scrollState.progress, SCENE_BOUNDS.hallway[0], SCENE_BOUNDS.hallway[1]);
      const index = Math.min(
        Math.floor(hallwayLocal / DOOR_WINDOW),
        HALLWAY_SCENE.stages.length - 1
      );

      if (index !== lastIndex.current && yearRef.current && roleRef.current) {
        yearRef.current.textContent = HALLWAY_SCENE.stages[index].year;
        roleRef.current.textContent = HALLWAY_SCENE.stages[index].role;
        lastIndex.current = index;
      }

      // fade in/out at the edges of each door's window so labels crossfade
      const withinWindow = hallwayLocal / DOOR_WINDOW - index;
      const fadeIn = easeInOutCubic(localProgress(withinWindow, 0, FADE_MARGIN / DOOR_WINDOW));
      const fadeOut = 1 - easeInOutCubic(localProgress(withinWindow, 1 - FADE_MARGIN / DOOR_WINDOW, 1));
      const opacity = hallwayLocal <= 0 || hallwayLocal >= 1 ? 0 : Math.min(fadeIn, fadeOut);

      gsap.set('.hallway-label', { opacity });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-16 md:pb-24 text-center'>
      <div className='hallway-label'>
        <p ref={yearRef} className='font-mono text-xs uppercase tracking-widest text-accent' />
        <p ref={roleRef} className='mt-1 text-2xl md:text-3xl font-bold tracking-tight text-ink' />
      </div>
    </div>
  );
}
