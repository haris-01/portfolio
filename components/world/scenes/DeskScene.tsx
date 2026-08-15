import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, localProgress, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';

type DeskSceneProps = {
  simplified: boolean;
};

// Room shell, open on the near (larger z) side facing the workshop entrance.
const ROOM_BACK_Z = -34;
const ROOM_FRONT_Z = -16;
const ROOM_CENTER_Z = (ROOM_BACK_Z + ROOM_FRONT_Z) / 2;
const ROOM_DEPTH = ROOM_FRONT_Z - ROOM_BACK_Z;
const ROOM_WIDTH = 16;

const DESK_Z = -22;

function Room() {
  return (
    <>
      <mesh position={[0, 4, ROOM_BACK_Z]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, 8]} />
        <meshStandardMaterial color='#30302E' />
      </mesh>
      <mesh position={[-ROOM_WIDTH / 2, 4, ROOM_CENTER_Z]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, 8]} />
        <meshStandardMaterial color='#262624' />
      </mesh>
      <mesh position={[ROOM_WIDTH / 2, 4, ROOM_CENTER_Z]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_DEPTH, 8]} />
        <meshStandardMaterial color='#262624' />
      </mesh>
    </>
  );
}

function Desk() {
  const screenGlow = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (!screenGlow.current) return;
    const local = localProgress(scrollState.progress, SCENE_BOUNDS.desk[0], SCENE_BOUNDS.desk[1]);
    // monitor wakes as the camera settles in front of the desk
    const wake = easeInOutCubic(Math.min(Math.max((local - 0.15) / 0.25, 0), 1));
    screenGlow.current.emissiveIntensity = wake * 1.4;
  });

  return (
    <group position={[0, 0, DESK_Z]}>
      {/* desk surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.08, 1.6]} />
        <meshStandardMaterial color='#5A4632' />
      </mesh>
      {/* legs */}
      {[
        [-1.6, 0.375, -0.65],
        [1.6, 0.375, -0.65],
        [-1.6, 0.375, 0.65],
        [1.6, 0.375, 0.65],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.08, 0.75, 0.08]} />
          <meshStandardMaterial color='#30302E' />
        </mesh>
      ))}
      {/* monitor stand */}
      <mesh position={[0, 0.95, -0.5]} castShadow>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial color='#171717' />
      </mesh>
      {/* monitor screen */}
      <mesh position={[0, 1.4, -0.5]} castShadow>
        <boxGeometry args={[1.3, 0.8, 0.05]} />
        <meshStandardMaterial color='#171717' emissive='#C6511F' emissiveIntensity={0} ref={screenGlow} />
      </mesh>
      {/* keyboard */}
      <mesh position={[0, 0.8, 0.25]} castShadow>
        <boxGeometry args={[0.9, 0.04, 0.3]} />
        <meshStandardMaterial color='#8F8B82' />
      </mesh>
      {/* mouse */}
      <mesh position={[0.7, 0.8, 0.3]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.2]} />
        <meshStandardMaterial color='#8F8B82' />
      </mesh>
      {/* notebook */}
      <mesh position={[-1, 0.8, 0.35]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[0.35, 0.5]} />
        <meshStandardMaterial color='#E8E5DD' />
      </mesh>
      {/* coffee cup */}
      <mesh position={[1.2, 0.85, -0.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.07, 0.14, 12]} />
        <meshStandardMaterial color='#171717' />
      </mesh>
      {/* desk lamp */}
      <group position={[-1.4, 0.75, -0.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color='#30302E' />
        </mesh>
        <mesh position={[0.1, 0.55, 0]} rotation={[0, 0, -0.5]} castShadow>
          <coneGeometry args={[0.1, 0.2, 12]} />
          <meshStandardMaterial color='#30302E' />
        </mesh>
        <pointLight position={[0.15, 0.5, 0]} intensity={0.6} color='#FFE9C7' distance={2} />
      </group>
    </group>
  );
}

function Character({ simplified }: { simplified: boolean }) {
  return (
    <group position={[0, 0, DESK_Z + 0.7]}>
      <mesh position={[0, 0.55, 0]} castShadow={!simplified}>
        <capsuleGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial color='#E8E5DD' />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow={!simplified}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color='#D9C9AE' />
      </mesh>
    </group>
  );
}

export default function DeskScene({ simplified }: DeskSceneProps) {
  return (
    <>
      <Room />
      <Desk />
      <Character simplified={simplified} />
    </>
  );
}
