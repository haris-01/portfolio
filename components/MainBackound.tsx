import { useEffect, useRef } from 'react';

export default function MainBackound() {
  const raf = useRef<number | null>(null);
  const pos = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;

    pos.current.x = window.innerWidth / 2;
    pos.current.y = window.innerHeight / 2;
    pos.current.tx = pos.current.x;
    pos.current.ty = pos.current.y;

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };

    const animate = () => {
      const p = pos.current;

      p.x += (p.tx - p.x) * 0.1;
      p.y += (p.ty - p.y) * 0.1;

      root.style.setProperty('--x', `${p.x}px`);
      root.style.setProperty('--y', `${p.y}px`);

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', onMove);
    animate();

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div className='dot-bg' />
      <div className='glow-bg' />
    </>
  );
}
