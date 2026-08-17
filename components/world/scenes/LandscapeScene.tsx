import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';
import { THEME } from '@/lib/theme';
import { LANDSCAPE_START_Z, LANDSCAPE_END_Z, CHARACTER_START_Z, CHARACTER_END_Z } from './landscapeLayout';

type LandscapeSceneProps = {
  simplified: boolean;
};

function Mountains() {
  const centerZ = (LANDSCAPE_START_Z + LANDSCAPE_END_Z) / 2;
  // a simple ridge of low-poly peaks, far off to both sides — calm, distant,
  // fading toward the fog rather than drawing attention (design spec §19)
  const peaks: [number, number, number, string][] = [
    [-22, 5, centerZ - 6, THEME.core.warmGray],
    [-14, 7, centerZ - 14, THEME.material.wallDark],
    [16, 6, centerZ - 10, THEME.core.warmGray],
    [24, 8, centerZ - 18, THEME.material.wallDark],
    [-4, 9, centerZ - 24, THEME.core.metal],
  ];

  return (
    <>
      {peaks.map(([x, height, z, color], i) => (
        <mesh key={i} position={[x, height / 2, z]}>
          <coneGeometry args={[height * 1.1, height, 4]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </>
  );
}

function Traveler({ simplified }: { simplified: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const local = localProgress(scrollState.progress, SCENE_BOUNDS.landscape[0], SCENE_BOUNDS.landscape[1]);
    const z = THREE.MathUtils.lerp(CHARACTER_START_Z, CHARACTER_END_Z, easeInOutCubic(local));
    group.current.position.set(0, 0, z);
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.9, 0]} castShadow={!simplified}>
        <capsuleGeometry args={[0.32, 0.9, 4, 8]} />
        <meshStandardMaterial color={THEME.core.surface} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow={!simplified}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={THEME.material.skin} />
      </mesh>
    </group>
  );
}

export default function LandscapeScene({ simplified }: LandscapeSceneProps) {
  return (
    <>
      <Mountains />
      <Traveler simplified={simplified} />
    </>
  );
}
