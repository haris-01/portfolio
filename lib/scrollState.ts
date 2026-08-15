// Mutable singleton updated by GSAP ScrollTrigger's onUpdate and read every
// frame inside the R3F render loop. Avoids React state/re-renders on scroll.
export const scrollState = {
  progress: 0,
};

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// The single continuous scroll-trigger's [0, 1] range is divided into a
// contiguous span per scene. Each scene reads its own slice via
// localProgress() rather than the raw global value.
export const SCENE_BOUNDS = {
  intro: [0, 0.5] as const,
  desk: [0.5, 1] as const,
};

export function localProgress(global: number, start: number, end: number) {
  return Math.min(Math.max((global - start) / (end - start), 0), 1);
}
