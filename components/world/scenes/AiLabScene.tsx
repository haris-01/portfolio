import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';
import { THEME } from '@/lib/theme';
import { AI_LAB_SCENE } from '@/constants/scenes/ai';
import { AI_LAB_START_Z, AI_LAB_END_Z, STAGE_COUNT, stagePosition } from './aiLabLayout';

type AiLabSceneProps = {
  simplified: boolean;
};

const STAGE_WINDOW = 1 / STAGE_COUNT;

function StageMarker({ index }: { index: number }) {
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const [x, y, z] = stagePosition(index);
  const threshold = index * STAGE_WINDOW;

  useFrame(() => {
    if (!core.current || !light.current) return;
    const local = localProgress(scrollState.progress, SCENE_BOUNDS.aiLab[0], SCENE_BOUNDS.aiLab[1]);
    const active = easeInOutCubic(localProgress(local, threshold, threshold + STAGE_WINDOW * 0.6));
    core.current.emissiveIntensity = active * 1.4;
    light.current.intensity = active * 1.4;
  });

  return (
    <group position={[x, y, z]}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={THEME.core.metal}
          emissive={THEME.core.accent}
          emissiveIntensity={0}
          ref={core}
        />
      </mesh>
      <pointLight ref={light} color={THEME.material.warmGlow} distance={5} intensity={0} />
    </group>
  );
}

// A field of small, dim, static points scattered through the space —
// texture for the "gradually more abstract" void (design spec §16),
// not meant to draw the eye on their own.
function AmbientParticles({ simplified }: { simplified: boolean }) {
  const count = simplified ? 24 : 48;
  const positions = useMemo(() => {
    const length = AI_LAB_START_Z - AI_LAB_END_Z;
    const pts: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = Math.sin(i * 12.9) * 4.5;
      const y = 0.6 + Math.abs(Math.cos(i * 7.3)) * 3;
      const z = AI_LAB_START_Z - t * length + Math.sin(i * 3.1) * 2;
      pts.push([x, y, z]);
    }
    return pts;
  }, [count]);

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color={THEME.core.warmGray} emissive={THEME.core.warmGray} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </>
  );
}

// The query traveling through the pipeline, wandering between each stage's
// drifted position rather than a straight line — same continuous-motion
// idea as the engineering room's Packet, adapted to this scene's looser
// layout.
function Query() {
  const mesh = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!mesh.current || !light.current) return;
    const local = localProgress(scrollState.progress, SCENE_BOUNDS.aiLab[0], SCENE_BOUNDS.aiLab[1]);
    const span = local * (STAGE_COUNT - 1);
    const i = Math.min(Math.floor(span), STAGE_COUNT - 2);
    const t = easeInOutCubic(span - i);
    const [ax, ay, az] = stagePosition(i);
    const [bx, by, bz] = stagePosition(i + 1);
    mesh.current.position.set(
      THREE.MathUtils.lerp(ax, bx, t),
      THREE.MathUtils.lerp(ay, by, t),
      THREE.MathUtils.lerp(az, bz, t)
    );
    light.current.position.copy(mesh.current.position);
  });

  return (
    <>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={THEME.core.accent} emissive={THEME.core.accent} emissiveIntensity={1.8} />
      </mesh>
      <pointLight ref={light} color={THEME.core.accent} intensity={1} distance={6} />
    </>
  );
}

export default function AiLabScene({ simplified }: AiLabSceneProps) {
  return (
    <>
      {AI_LAB_SCENE.stages.map((_, i) => (
        <StageMarker key={i} index={i} />
      ))}
      <AmbientParticles simplified={simplified} />
      <Query />
    </>
  );
}
