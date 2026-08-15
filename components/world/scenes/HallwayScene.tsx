import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';
import { THEME } from '@/lib/theme';
import { HALLWAY_SCENE } from '@/constants/scenes/hallway';
import {
  HALLWAY_START_Z,
  HALLWAY_END_Z,
  HALLWAY_WIDTH,
  FIRST_DOOR_Z,
  DOOR_SPACING,
} from './hallwayLayout';

type HallwaySceneProps = {
  simplified: boolean;
};

// Always-on ceiling fixtures give the corridor a visible baseline — the
// door lights are a scroll-driven accent on top of this, not the only
// light source, otherwise the stretch past the last door reads as pure
// black once its activation window has come and gone.
const CEILING_LIGHT_COUNT = 4;

function Corridor({ simplified }: { simplified: boolean }) {
  const length = HALLWAY_START_Z - HALLWAY_END_Z;
  const centerZ = (HALLWAY_START_Z + HALLWAY_END_Z) / 2;
  const ceilingLights = Array.from({ length: CEILING_LIGHT_COUNT }, (_, i) => {
    const t = (i + 0.5) / CEILING_LIGHT_COUNT;
    return HALLWAY_START_Z - t * length;
  });

  return (
    <>
      <mesh
        position={[-HALLWAY_WIDTH / 2, 4, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={!simplified}
      >
        <planeGeometry args={[length, 8]} />
        <meshStandardMaterial color={THEME.material.wallDark} />
      </mesh>
      <mesh
        position={[HALLWAY_WIDTH / 2, 4, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={!simplified}
      >
        <planeGeometry args={[length, 8]} />
        <meshStandardMaterial color={THEME.material.wallDark} />
      </mesh>
      <mesh position={[0, 4, HALLWAY_END_Z]} receiveShadow={!simplified}>
        <planeGeometry args={[HALLWAY_WIDTH, 8]} />
        <meshStandardMaterial color={THEME.material.wallDarkAlt} />
      </mesh>
      <pointLight position={[0, 2.4, HALLWAY_END_Z + 3]} intensity={1.6} color={THEME.material.warmGlow} distance={8} />
      {ceilingLights.map((z, i) => (
        <pointLight key={i} position={[0, 3.6, z]} intensity={1.1} color={THEME.material.warmGlow} distance={9} />
      ))}
    </>
  );
}

// how much of hallway-local progress each door "owns" for its light/label activation
const DOOR_WINDOW = 1 / HALLWAY_SCENE.stages.length;

function Door({ index, side }: { index: number; side: -1 | 1 }) {
  const light = useRef<THREE.PointLight>(null);
  const panel = useRef<THREE.MeshStandardMaterial>(null);
  const z = FIRST_DOOR_Z - index * DOOR_SPACING;
  const threshold = index * DOOR_WINDOW;

  useFrame(() => {
    if (!light.current || !panel.current) return;
    const hallwayLocal = localProgress(scrollState.progress, SCENE_BOUNDS.hallway[0], SCENE_BOUNDS.hallway[1]);
    const active = easeInOutCubic(localProgress(hallwayLocal, threshold, threshold + DOOR_WINDOW * 0.6));
    light.current.intensity = active * 1.8;
    panel.current.emissiveIntensity = active * 0.8;
  });

  return (
    <group position={[side * (HALLWAY_WIDTH / 2), 0, z]}>
      <mesh position={[0, 1.6, 0]} rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 2.6]} />
        <meshStandardMaterial color={THEME.core.ink} emissive={THEME.core.accent} emissiveIntensity={0} ref={panel} />
      </mesh>
      <pointLight ref={light} position={[side * -0.6, 2, 0]} color={THEME.material.warmGlow} distance={3} intensity={0} />
    </group>
  );
}

export default function HallwayScene({ simplified }: HallwaySceneProps) {
  return (
    <>
      <Corridor simplified={simplified} />
      {HALLWAY_SCENE.stages.map((_, i) => (
        <Door key={i} index={i} side={i % 2 === 0 ? -1 : 1} />
      ))}
    </>
  );
}
