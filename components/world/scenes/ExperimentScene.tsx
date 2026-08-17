import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';
import { THEME } from '@/lib/theme';
import { EXPERIMENT_SCENE } from '@/constants/scenes/experiment';
import { itemPosition } from './experimentLayout';

type ExperimentSceneProps = {
  simplified: boolean;
};

const ITEM_WINDOW = 1 / EXPERIMENT_SCENE.experiments.length;

// A different primitive shape per experiment so the room reads as a shelf
// of distinct little prototypes rather than a repeated grid — matching the
// spec's "this engineer likes experimenting" playfulness (§17).
const SHAPES = ['torus', 'octahedron', 'cone', 'dodecahedron', 'torusKnot', 'box'] as const;

function ExperimentItem({ index, simplified }: { index: number; simplified: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const [x, z] = itemPosition(index);
  const threshold = index * ITEM_WINDOW;

  useFrame((_, delta) => {
    if (!group.current || !core.current || !light.current) return;
    const local = localProgress(scrollState.progress, SCENE_BOUNDS.experiment[0], SCENE_BOUNDS.experiment[1]);
    const active = easeInOutCubic(localProgress(local, threshold, threshold + ITEM_WINDOW * 0.6));
    core.current.emissiveIntensity = active * 1.2;
    light.current.intensity = active * 1.3;
    // gentle idle spin, only once the item has woken up — a small playful
    // flourish, not motion for its own sake (spec §22)
    group.current.rotation.y += delta * 0.4 * active;
  });

  const shape = SHAPES[index % SHAPES.length];

  return (
    <group position={[x, 1.3, z]} ref={group}>
      <mesh castShadow={!simplified}>
        {shape === 'torus' && <torusGeometry args={[0.32, 0.12, 12, 24]} />}
        {shape === 'octahedron' && <octahedronGeometry args={[0.36, 0]} />}
        {shape === 'cone' && <coneGeometry args={[0.3, 0.5, 8]} />}
        {shape === 'dodecahedron' && <dodecahedronGeometry args={[0.32, 0]} />}
        {shape === 'torusKnot' && <torusKnotGeometry args={[0.22, 0.08, 64, 8]} />}
        {shape === 'box' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
        <meshStandardMaterial color={THEME.core.metal} emissive={THEME.core.accent} emissiveIntensity={0} ref={core} />
      </mesh>
      <pointLight ref={light} color={THEME.material.warmGlow} distance={4} intensity={0} />
    </group>
  );
}

export default function ExperimentScene({ simplified }: ExperimentSceneProps) {
  return (
    <>
      {EXPERIMENT_SCENE.experiments.map((_, i) => (
        <ExperimentItem key={i} index={i} simplified={simplified} />
      ))}
    </>
  );
}
