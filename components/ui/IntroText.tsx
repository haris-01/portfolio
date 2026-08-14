import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';
import { INTRO_SCENE } from '@/constants/scenes/intro';
import { scrollState, easeInOutCubic } from '@/lib/scrollState';

type IntroTextProps = {
  reducedMotion: boolean;
};

// text reveals in the final stretch of the approach, once the entrance is close
const REVEAL_START = 0.75;

export default function IntroText({ reducedMotion }: IntroTextProps) {
  const rafRef = useRef<number | null>(null);

  useGSAP(() => {
    const split = new SplitText('.intro-name', { type: 'chars' });

    if (reducedMotion) {
      gsap.set(split.chars, { yPercent: 0, opacity: 1 });
      gsap.set(['.intro-role', '.intro-tagline'], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(split.chars, { yPercent: 100, opacity: 0 });
    gsap.set(['.intro-role', '.intro-tagline'], { opacity: 0, y: 12 });

    const tick = () => {
      const reveal = easeInOutCubic(
        Math.min(Math.max((scrollState.progress - REVEAL_START) / (1 - REVEAL_START), 0), 1)
      );
      gsap.set(split.chars, { yPercent: (1 - reveal) * 100, opacity: reveal });
      gsap.set(['.intro-role', '.intro-tagline'], { opacity: reveal, y: (1 - reveal) * 12 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-24 md:pb-32 text-center'>
      <h1 className='intro-name text-4xl md:text-6xl font-bold tracking-tight text-ink'>
        {INTRO_SCENE.name}
      </h1>
      <p className='intro-role mt-3 text-lg md:text-xl text-ink'>{INTRO_SCENE.role}</p>
      <p className='intro-tagline mt-1 text-xs md:text-sm font-mono uppercase tracking-widest text-warmgray'>
        {INTRO_SCENE.tagline}
      </p>
    </div>
  );
}
