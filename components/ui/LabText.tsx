import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { LAB_SCENE } from '@/constants/scenes/lab';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

type LabTextProps = {
  reducedMotion: boolean;
};

const POD_WINDOW = 1 / LAB_SCENE.projects.length;
const FADE_MARGIN = POD_WINDOW * 0.15;

export default function LabText({ reducedMotion }: LabTextProps) {
  const rafRef = useRef<number | null>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const stackRef = useRef<HTMLUListElement>(null);
  const lastIndex = useRef(-1);

  useGSAP(() => {
    if (reducedMotion) {
      gsap.set('.lab-label', { opacity: 0 });
      return;
    }

    gsap.set('.lab-label', { opacity: 0 });

    const tick = () => {
      const labLocal = localProgress(scrollState.progress, SCENE_BOUNDS.lab[0], SCENE_BOUNDS.lab[1]);
      const index = Math.min(Math.floor(labLocal / POD_WINDOW), LAB_SCENE.projects.length - 1);

      if (index !== lastIndex.current && titleRef.current && taglineRef.current && stackRef.current) {
        const project = LAB_SCENE.projects[index];
        titleRef.current.textContent = project.title;
        taglineRef.current.textContent = project.tagline;
        stackRef.current.innerHTML = project.stack
          .map((tech) => `<li class="text-xs font-mono uppercase tracking-widest text-accent">${tech}</li>`)
          .join('');
        lastIndex.current = index;
      }

      const withinWindow = labLocal / POD_WINDOW - index;
      const fadeIn = easeInOutCubic(localProgress(withinWindow, 0, FADE_MARGIN / POD_WINDOW));
      const fadeOut = 1 - easeInOutCubic(localProgress(withinWindow, 1 - FADE_MARGIN / POD_WINDOW, 1));
      const opacity = labLocal <= 0 ? 0 : Math.min(fadeIn, fadeOut);

      gsap.set('.lab-label', { opacity });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-16 md:pb-24 text-center px-6'>
      <div className='lab-label max-w-md'>
        <p ref={titleRef} className='text-2xl md:text-3xl font-bold tracking-tight text-ink' />
        <p ref={taglineRef} className='mt-2 text-sm md:text-base text-warmgray' />
        <ul ref={stackRef} className='mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1' />
      </div>
    </div>
  );
}
