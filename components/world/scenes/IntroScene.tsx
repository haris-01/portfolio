import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, easeInOutCubic, localProgress, SCENE_BOUNDS } from '@/lib/scrollState';
import { THEME } from '@/lib/theme';

type IntroSceneProps = {
  simplified: boolean;
};

function Workshop() {
  const doorHinge = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!doorHinge.current) return;
    // door begins opening in the final stretch of the intro approach (its own
    // local progress, not raw global scrollState.progress)
    const introLocal = localProgress(scrollState.progress, SCENE_BOUNDS.intro[0], SCENE_BOUNDS.intro[1]);
    const openAmount = localProgress(introLocal, 0.8, 1);
    doorHinge.current.rotation.y = -easeInOutCubic(openAmount) * (Math.PI * 0.6);
  });

  return (
    <group position={[0, 0, -14]}>
      {/* main building volume */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 6, 8]} />
        <meshStandardMaterial color={THEME.core.metal} />
      </mesh>
      {/* roof */}
      <mesh position={[0, 6.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[7.2, 2.2, 4]} />
        <meshStandardMaterial color={THEME.core.ink} />
      </mesh>
      {/* door, hinged on its left edge */}
      <group ref={doorHinge} position={[-0.8, 1.6, 4.01]}>
        <mesh position={[0.8, 0, 0]}>
          <planeGeometry args={[1.6, 3.2]} />
          <meshStandardMaterial color={THEME.core.ink} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* door frame light */}
      <pointLight position={[0, 2.6, 4.5]} intensity={2} color={THEME.core.accent} distance={4} />
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.8, 6]} />
        <meshStandardMaterial color={THEME.material.wood} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[1.1, 2, 8]} />
        <meshStandardMaterial color={THEME.material.foliage} />
      </mesh>
    </group>
  );
}

export default function IntroScene({ simplified }: IntroSceneProps) {
  const trees = useMemo<[number, number, number][]>(
    () =>
      simplified
        ? [[-6, 0, -6]]
        : [
            [-6, 0, -6],
            [6.5, 0, -4],
            [-8, 0, -2],
          ],
    [simplified]
  );

  return (
    <>
      <Workshop />
      {trees.map((position, i) => (
        <Tree key={i} position={position} />
      ))}
    </>
  );
}
