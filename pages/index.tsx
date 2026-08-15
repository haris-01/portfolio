import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import Nav from '@/components/ui/Nav';
import IntroText from '@/components/ui/IntroText';
import DeskText from '@/components/ui/DeskText';
import HallwayText from '@/components/ui/HallwayText';
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

  useGSAP(() => {
    if (reducedMotion) return;

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
  }, [reducedMotion]);

  const showWorld = webglSupported !== false;

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

        {showWorld ? (
          <>
            <div className='fixed inset-0 z-0'>
              <WorldCanvas simplified={isMobile} reducedMotion={reducedMotion} />
            </div>
            <IntroText reducedMotion={reducedMotion} />
            <DeskText reducedMotion={reducedMotion} />
            <HallwayText reducedMotion={reducedMotion} />
            <div id='scroll-trigger' ref={triggerRef} className='relative h-[1200vh]' />
          </>
        ) : (
          <section className='min-h-screen flex flex-col items-center justify-center text-center px-6'>
            <h2 className='text-4xl md:text-6xl font-bold tracking-tight text-ink'>
              {SITE.name}
            </h2>
            <p className='mt-3 text-lg md:text-xl text-ink'>{SITE.role}</p>
            <p className='mt-1 text-xs md:text-sm font-mono uppercase tracking-widest text-warmgray'>
              {SITE.tagline}
            </p>
          </section>
        )}
      </main>
    </>
  );
}
