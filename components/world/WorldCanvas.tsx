import { Canvas } from '@react-three/fiber';
import IntroScene from '@/components/world/scenes/IntroScene';
import ScrollRig from '@/components/world/ScrollRig';

type WorldCanvasProps = {
  simplified: boolean;
  reducedMotion: boolean;
};

export default function WorldCanvas({ simplified, reducedMotion }: WorldCanvasProps) {
  return (
    <Canvas
      shadows={!simplified}
      dpr={simplified ? [1, 1.5] : [1, 2]}
      camera={{
        fov: simplified ? 58 : 45,
        near: 0.1,
        far: 200,
        position: simplified ? [0, 3, 15] : [0, 4.5, 16],
      }}
      gl={{ antialias: !simplified }}
    >
      <IntroScene simplified={simplified} />
      {!reducedMotion && <ScrollRig simplified={simplified} />}
    </Canvas>
  );
}
