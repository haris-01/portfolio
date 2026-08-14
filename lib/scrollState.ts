// Mutable singleton updated by GSAP ScrollTrigger's onUpdate and read every
// frame inside the R3F render loop. Avoids React state/re-renders on scroll.
export const scrollState = {
  progress: 0,
};

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
