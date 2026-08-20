import { Canvas } from '@react-three/fiber';
import Environment from '@/components/world/Environment';
import IntroScene from '@/components/world/scenes/IntroScene';
import DeskScene from '@/components/world/scenes/DeskScene';
import HallwayScene from '@/components/world/scenes/HallwayScene';
import LabScene from '@/components/world/scenes/LabScene';
import EngineeringScene from '@/components/world/scenes/EngineeringScene';
import AiLabScene from '@/components/world/scenes/AiLabScene';
import WhiteRoomScene from '@/components/world/scenes/WhiteRoomScene';
import LandscapeScene from '@/components/world/scenes/LandscapeScene';
import ScrollRig from '@/components/world/ScrollRig';

type WorldCanvasProps = {
  simplified: boolean;
};

// Only ever mounted for the cinematic experience (pages/index.tsx's
// showCinematic) — the reduced-motion path renders StaticFallback instead,
// so this component never needs to render a non-scroll-driven variant.
export default function WorldCanvas({ simplified }: WorldCanvasProps) {
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
      <Environment simplified={simplified} />
      <IntroScene simplified={simplified} />
      <DeskScene simplified={simplified} />
      <HallwayScene simplified={simplified} />
      <LabScene simplified={simplified} />
      <EngineeringScene simplified={simplified} />
      <AiLabScene simplified={simplified} />
      <WhiteRoomScene />
      <LandscapeScene simplified={simplified} />
      <ScrollRig simplified={simplified} />
    </Canvas>
  );
}
