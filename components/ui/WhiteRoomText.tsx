import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { WHITE_ROOM_SCENE } from '@/constants/scenes/whiteRoom';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

// The statement reveals once the room is reached, holds, then fades back
// out as the camera moves on into the landscape — no per-item cycling, this
// is the one emotional beat of the scene (design spec §18: "extremely
// minimal — no lengthy copy").
const REVEAL_RANGE: [number, number] = [0.25, 0.6];
const FADE_OUT_SPAN = 0.15; // fraction of the *next* scene's local progress

// Only ever rendered as part of the cinematic experience (pages/index.tsx's
// showCinematic) — the reduced-motion path renders StaticFallback instead.
export default function WhiteRoomText() {
  const rafRef = useRef<number | null>(null);

  useGSAP(() => {
    gsap.set('.white-room-line', { opacity: 0, y: 12 });

    const tick = () => {
      const local = localProgress(scrollState.progress, SCENE_BOUNDS.whiteRoom[0], SCENE_BOUNDS.whiteRoom[1]);
      const reveal = easeInOutCubic(localProgress(local, REVEAL_RANGE[0], REVEAL_RANGE[1]));
      const landscapeLocal = localProgress(scrollState.progress, SCENE_BOUNDS.landscape[0], SCENE_BOUNDS.landscape[1]);
      const fadeOut = easeInOutCubic(localProgress(landscapeLocal, 0, FADE_OUT_SPAN));
      const visible = reveal * (1 - fadeOut);
      gsap.set('.white-room-line', { opacity: visible, y: (1 - visible) * 12 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center text-center px-6'>
      {WHITE_ROOM_SCENE.statement.map((line, i) => (
        <p key={i} className='white-room-line text-3xl md:text-5xl font-bold tracking-tight text-ink'>
          {line}
        </p>
      ))}
    </div>
  );
}
