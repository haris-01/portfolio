import { useSyncExternalStore } from 'react';

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// WebGL support never changes after mount, so subscribe is a no-op.
function subscribe() {
  return () => {};
}

function getServerSnapshot(): boolean | null {
  return null;
}

export function useWebGLSupport() {
  return useSyncExternalStore(subscribe, detectWebGL, getServerSnapshot);
}
