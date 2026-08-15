import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';
import { INTRO_SCENE } from '@/constants/scenes/intro';
import { scrollState, easeInOutCubic, localProgress, SCENE_BOUNDS } from '@/lib/scrollState';

type IntroTextProps = {
  reducedMotion: boolean;
};

// text reveals in the final stretch of the approach, once the entrance is
// close, then fades back out as the camera moves on into the next scene
const REVEAL_START = 0.75;
const FADE_OUT_SPAN = 0.15; // fraction of the *next* scene's local progress

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
      const introLocal = localProgress(scrollState.progress, SCENE_BOUNDS.intro[0], SCENE_BOUNDS.intro[1]);
      const reveal = easeInOutCubic(
        localProgress(introLocal, REVEAL_START, 1)
      );
      const nextSceneLocal = localProgress(scrollState.progress, SCENE_BOUNDS.desk[0], SCENE_BOUNDS.desk[1]);
      const fadeOut = easeInOutCubic(localProgress(nextSceneLocal, 0, FADE_OUT_SPAN));
      const visible = reveal * (1 - fadeOut);

      gsap.set(split.chars, { yPercent: (1 - visible) * 100, opacity: visible });
      gsap.set(['.intro-role', '.intro-tagline'], { opacity: visible, y: (1 - visible) * 12 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-24 md:pb-32 text-center'>
      <p className='intro-name text-4xl md:text-6xl font-bold tracking-tight text-ink'>
        {INTRO_SCENE.name}
      </p>
      <p className='intro-role mt-3 text-lg md:text-xl text-ink'>{INTRO_SCENE.role}</p>
      <p className='intro-tagline mt-1 text-xs md:text-sm font-mono uppercase tracking-widest text-warmgray'>
        {INTRO_SCENE.tagline}
      </p>
    </div>
  );
}
