import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import Nav from '@/components/ui/Nav';
import IntroText from '@/components/ui/IntroText';
import DeskText from '@/components/ui/DeskText';
import HallwayText from '@/components/ui/HallwayText';
import LabText from '@/components/ui/LabText';
import StaticFallback from '@/components/ui/StaticFallback';
import { SITE } from '@/constants/site';
import { scrollState } from '@/lib/scrollState';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { useIsMobile } from '@/hooks/useIsMobile';

const WorldCanvas = dynamic(() => import('@/components/world/WorldCanvas'), {
  ssr: false,
});

const SCROLL_TRIGGER_SELECTOR = '#scroll-trigger';

export default function Home() {
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebGLSupport();
  const isMobile = useIsMobile();
  const triggerRef = useRef<HTMLDivElement>(null);

  // The cinematic scroll-driven 3D experience only runs when WebGL is
  // available AND the visitor hasn't asked for reduced motion — spec §28
  // calls for normal section transitions instead of the scroll-jacked
  // camera in that case, not just a frozen first frame of it. Every text
  // overlay component below (IntroText, DeskText, ...) is therefore only
  // ever mounted with reducedMotion=false in practice.
  const showCinematic = webglSupported !== false && !reducedMotion;

  useGSAP(() => {
    if (!showCinematic) return;

    const st = gsap.timeline({
      scrollTrigger: {
        trigger: SCROLL_TRIGGER_SELECTOR,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          scrollState.progress = self.progress;
        },
      },
    });

    return () => {
      st.scrollTrigger?.kill();
    };
  }, [showCinematic]);

  return (
    <>
      <Head>
        <title>{`${SITE.name} — ${SITE.role}`}</title>
        <meta name='description' content={SITE.description} />
        <meta property='og:title' content={`${SITE.name} — ${SITE.role}`} />
        <meta property='og:description' content={SITE.description} />
        <meta property='og:type' content='website' />
      </Head>

      <Nav />

      <main className='bg-background'>
        <h1 className='sr-only'>{`${SITE.name} — ${SITE.role}`}</h1>

        {showCinematic ? (
          <>
            <div className='fixed inset-0 z-0'>
              <WorldCanvas simplified={isMobile} />
            </div>
            <IntroText />
            <DeskText />
            <HallwayText />
            <LabText />
            <div id='scroll-trigger' ref={triggerRef} className='relative h-[1600vh]' />
          </>
        ) : (
          <StaticFallback />
        )}
      </main>
    </>
  );
}
