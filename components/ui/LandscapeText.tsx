import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { LANDSCAPE_SCENE } from '@/constants/scenes/landscape';
import { SOCIAL_LINKS } from '@/constants/site';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

const REVEAL_RANGE: [number, number] = [0.4, 0.75];

// Only ever rendered as part of the cinematic experience (pages/index.tsx's
// showCinematic) — the reduced-motion path renders StaticFallback instead.
export default function LandscapeText() {
  const rafRef = useRef<number | null>(null);

  useGSAP(() => {
    gsap.set('.landscape-cta', { opacity: 0, y: 12 });

    const tick = () => {
      const local = localProgress(scrollState.progress, SCENE_BOUNDS.landscape[0], SCENE_BOUNDS.landscape[1]);
      const visible = easeInOutCubic(localProgress(local, REVEAL_RANGE[0], REVEAL_RANGE[1]));
      gsap.set('.landscape-cta', { opacity: visible, y: (1 - visible) * 12 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center text-center px-6'>
      <div className='landscape-cta'>
        <p className='text-3xl md:text-5xl font-bold tracking-tight text-ink'>{LANDSCAPE_SCENE.cta}</p>
        <ul className='pointer-events-auto mt-6 flex justify-center gap-6 text-sm font-mono uppercase tracking-widest'>
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
      </div>
    </div>
  );
}
