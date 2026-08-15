import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, easeInOutCubic } from '@/lib/scrollState';

type IntroSceneProps = {
  simplified: boolean;
};

function Workshop() {
  const doorHinge = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!doorHinge.current) return;
    // door begins opening in the final stretch of the approach (progress 0.8 -> 1)
    const openAmount = Math.min(Math.max((scrollState.progress - 0.8) / 0.2, 0), 1);
    doorHinge.current.rotation.y = -easeInOutCubic(openAmount) * (Math.PI * 0.6);
  });

  return (
    <group position={[0, 0, -14]}>
      {/* main building volume */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 6, 8]} />
        <meshStandardMaterial color='#30302E' />
      </mesh>
      {/* roof */}
      <mesh position={[0, 6.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[7.2, 2.2, 4]} />
        <meshStandardMaterial color='#171717' />
      </mesh>
      {/* door, hinged on its left edge */}
      <group ref={doorHinge} position={[-0.8, 1.6, 4.01]}>
        <mesh position={[0.8, 0, 0]}>
          <planeGeometry args={[1.6, 3.2]} />
          <meshStandardMaterial color='#171717' side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* door frame light */}
      <pointLight position={[0, 2.6, 4.5]} intensity={2} color='#C6511F' distance={4} />
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.8, 6]} />
        <meshStandardMaterial color='#5A4632' />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[1.1, 2, 8]} />
        <meshStandardMaterial color='#7C8A5C' />
      </mesh>
    </group>
  );
}

function Character() {
  return (
    <group position={[1.4, 0, -8]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.9, 4, 8]} />
        <meshStandardMaterial color='#E8E5DD' />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color='#D9C9AE' />
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
      <Character />
      {trees.map((position, i) => (
        <Tree key={i} position={position} />
      ))}
    </>
  );
}
