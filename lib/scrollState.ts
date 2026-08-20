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
  intro: [0, 0.1] as const,
  desk: [0.1, 0.26] as const,
  hallway: [0.26, 0.34] as const,
  lab: [0.34, 0.49] as const,
  engineering: [0.49, 0.61] as const,
  aiLab: [0.61, 0.75] as const,
  whiteRoom: [0.75, 0.85] as const,
  landscape: [0.85, 1] as const,
};

export function localProgress(global: number, start: number, end: number) {
  return Math.min(Math.max((global - start) / (end - start), 0), 1);
}
