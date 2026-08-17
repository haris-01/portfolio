import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';
import { THEME } from '@/lib/theme';
import { ENGINEERING_SCENE } from '@/constants/scenes/engineering';
import {
  ENGINEERING_START_Z,
  ENGINEERING_END_Z,
  ENGINEERING_WIDTH,
  FIRST_NODE_Z,
  LAST_NODE_Z,
  NODE_SPACING,
  nodePosition,
} from './engineeringLayout';

type EngineeringSceneProps = {
  simplified: boolean;
};

const CEILING_LIGHT_COUNT = 4;

function Room({ simplified }: { simplified: boolean }) {
  const length = ENGINEERING_START_Z - ENGINEERING_END_Z;
  const centerZ = (ENGINEERING_START_Z + ENGINEERING_END_Z) / 2;
  const ceilingLights = Array.from({ length: CEILING_LIGHT_COUNT }, (_, i) => {
    const t = (i + 0.5) / CEILING_LIGHT_COUNT;
    return ENGINEERING_START_Z - t * length;
  });

  return (
    <>
      <mesh
        position={[-ENGINEERING_WIDTH / 2, 4, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={!simplified}
      >
        <planeGeometry args={[length, 8]} />
        <meshStandardMaterial color={THEME.material.wallDark} />
      </mesh>
      <mesh
        position={[ENGINEERING_WIDTH / 2, 4, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={!simplified}
      >
        <planeGeometry args={[length, 8]} />
        <meshStandardMaterial color={THEME.material.wallDark} />
      </mesh>
      <mesh position={[0, 4, ENGINEERING_END_Z]} receiveShadow={!simplified}>
        <planeGeometry args={[ENGINEERING_WIDTH, 8]} />
        <meshStandardMaterial color={THEME.material.wallDarkAlt} />
      </mesh>
      <pointLight
        position={[0, 3, ENGINEERING_END_Z + 4]}
        intensity={1.6}
        color={THEME.material.warmGlow}
        distance={9}
      />
      {ceilingLights.map((z, i) => (
        <pointLight key={i} position={[0, 4, z]} intensity={1.1} color={THEME.material.warmGlow} distance={11} />
      ))}
    </>
  );
}

const NODE_WINDOW = 1 / ENGINEERING_SCENE.stages.length;

function Node({ index, side }: { index: number; side: -1 | 1 }) {
  const panel = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const [x, z] = nodePosition(index);
  const threshold = index * NODE_WINDOW;

  useFrame(() => {
    if (!panel.current || !light.current) return;
    const local = localProgress(scrollState.progress, SCENE_BOUNDS.engineering[0], SCENE_BOUNDS.engineering[1]);
    const active = easeInOutCubic(localProgress(local, threshold, threshold + NODE_WINDOW * 0.6));
    panel.current.emissiveIntensity = active * 1.2;
    light.current.intensity = active * 1.6;
  });

  return (
    <group position={[x, 0, z]}>
      {/* server rack */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color={THEME.core.metal} />
      </mesh>
      {/* status panel */}
      <mesh position={[side > 0 ? -0.41 : 0.41, 1.3, 0]} rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
        <planeGeometry args={[0.6, 0.5]} />
        <meshStandardMaterial color={THEME.core.ink} emissive={THEME.core.accent} emissiveIntensity={0} ref={panel} />
      </mesh>
      <pointLight ref={light} position={[side > 0 ? -0.6 : 0.6, 1.3, 0]} color={THEME.material.warmGlow} distance={5} intensity={0} />
    </group>
  );
}

// The traveling "packet" — a small sphere gliding down the central aisle
// from the first node to the last as the scene plays out, visualizing data
// moving through the pipeline (design spec §15) independent of which node
// is currently highlighted.
function Packet() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!mesh.current) return;
    const local = localProgress(scrollState.progress, SCENE_BOUNDS.engineering[0], SCENE_BOUNDS.engineering[1]);
    const z = THREE.MathUtils.lerp(FIRST_NODE_Z, LAST_NODE_Z, easeInOutCubic(local));
    mesh.current.position.set(0, 1.3, z);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.14, 16, 16]} />
      <meshStandardMaterial color={THEME.core.accent} emissive={THEME.core.accent} emissiveIntensity={1.6} />
      <pointLight color={THEME.core.accent} intensity={1.2} distance={NODE_SPACING} />
    </mesh>
  );
}

export default function EngineeringScene({ simplified }: EngineeringSceneProps) {
  return (
    <>
      <Room simplified={simplified} />
      {ENGINEERING_SCENE.stages.map((_, i) => (
        <Node key={i} index={i} side={i % 2 === 0 ? -1 : 1} />
      ))}
      <Packet />
    </>
  );
}
