import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, easeInOutCubic } from '@/lib/scrollState';

type ScrollRigProps = {
  simplified: boolean;
};

// Establishing shot (far, wide) -> slow dolly toward the workshop entrance.
// Portrait/mobile framing sits closer so the scene fills a tall, narrow viewport.
const START_POS = new THREE.Vector3(0, 3, 22);
const START_LOOK = new THREE.Vector3(0, 3, -14);
const END_POS = new THREE.Vector3(0, 1.8, 2.5);
const END_LOOK = new THREE.Vector3(0, 1.7, -14);

const START_POS_MOBILE = new THREE.Vector3(0, 3, 15);
const END_POS_MOBILE = new THREE.Vector3(0, 1.8, 2.5);

export default function ScrollRig({ simplified }: ScrollRigProps) {
  const { camera } = useThree();
  const startPos = simplified ? START_POS_MOBILE : START_POS;
  const endPos = simplified ? END_POS_MOBILE : END_POS;
  const currentPos = useRef(new THREE.Vector3().copy(startPos));
  const currentLook = useRef(new THREE.Vector3().copy(START_LOOK));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const eased = easeInOutCubic(scrollState.progress);
    targetPos.current.lerpVectors(startPos, endPos, eased);
    targetLook.current.lerpVectors(START_LOOK, END_LOOK, eased);

    // gentle smoothing so scroll-scrub still reads as a fluid camera move
    const smoothing = 1 - Math.pow(0.001, delta);
    currentPos.current.lerp(targetPos.current, smoothing);
    currentLook.current.lerp(targetLook.current, smoothing);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}
