import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';
import { THEME } from '@/lib/theme';
import { LAB_SCENE } from '@/constants/scenes/lab';
import { LAB_START_Z, LAB_END_Z, LAB_WIDTH, podPosition } from './labLayout';

type LabSceneProps = {
  simplified: boolean;
};

const CEILING_LIGHT_COUNT = 3;

function Room({ simplified }: { simplified: boolean }) {
  const length = LAB_START_Z - LAB_END_Z;
  const centerZ = (LAB_START_Z + LAB_END_Z) / 2;
  const ceilingLights = Array.from({ length: CEILING_LIGHT_COUNT }, (_, i) => {
    const t = (i + 0.5) / CEILING_LIGHT_COUNT;
    return LAB_START_Z - t * length;
  });

  return (
    <>
      <mesh
        position={[-LAB_WIDTH / 2, 4.5, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={!simplified}
      >
        <planeGeometry args={[length, 9]} />
        <meshStandardMaterial color={THEME.material.wallDark} />
      </mesh>
      <mesh
        position={[LAB_WIDTH / 2, 4.5, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={!simplified}
      >
        <planeGeometry args={[length, 9]} />
        <meshStandardMaterial color={THEME.material.wallDark} />
      </mesh>
      <mesh position={[0, 4.5, LAB_END_Z]} receiveShadow={!simplified}>
        <planeGeometry args={[LAB_WIDTH, 9]} />
        <meshStandardMaterial color={THEME.material.wallDarkAlt} />
      </mesh>
      <pointLight position={[0, 3, LAB_END_Z + 4]} intensity={1.6} color={THEME.material.warmGlow} distance={9} />
      {ceilingLights.map((z, i) => (
        <pointLight key={i} position={[0, 4, z]} intensity={1.1} color={THEME.material.warmGlow} distance={11} />
      ))}
    </>
  );
}

const POD_WINDOW = 1 / LAB_SCENE.projects.length;

function Pod({ index }: { index: number }) {
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const [x, z] = podPosition(index);
  const threshold = index * POD_WINDOW;

  useFrame(() => {
    if (!screen.current || !light.current) return;
    const labLocal = localProgress(scrollState.progress, SCENE_BOUNDS.lab[0], SCENE_BOUNDS.lab[1]);
    const active = easeInOutCubic(localProgress(labLocal, threshold, threshold + POD_WINDOW * 0.6));
    screen.current.emissiveIntensity = active * 1.4;
    light.current.intensity = active * 1.8;
  });

  return (
    <group position={[x, 0, z]}>
      {/* pedestal */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.9]} />
        <meshStandardMaterial color={THEME.core.metal} />
      </mesh>
      {/* installation screen/display */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[1.4, 1.6, 0.08]} />
        <meshStandardMaterial color={THEME.core.ink} emissive={THEME.core.accent} emissiveIntensity={0} ref={screen} />
      </mesh>
      <pointLight ref={light} position={[0, 2, 0.6]} color={THEME.material.warmGlow} distance={6} intensity={0} />
    </group>
  );
}

export default function LabScene({ simplified }: LabSceneProps) {
  return (
    <>
      <Room simplified={simplified} />
      {LAB_SCENE.projects.map((_, i) => (
        <Pod key={i} index={i} />
      ))}
    </>
  );
}
