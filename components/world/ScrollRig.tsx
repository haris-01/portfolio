import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, easeInOutCubic, SCENE_BOUNDS } from '@/lib/scrollState';
import { HALLWAY_END_Z } from '@/components/world/scenes/hallwayLayout';
import { LAST_POD_Z, POD_COUNT, podPosition } from '@/components/world/scenes/labLayout';
import { LAST_NODE_Z, NODE_COUNT, nodePosition } from '@/components/world/scenes/engineeringLayout';
import { STAGE_COUNT, stagePosition } from '@/components/world/scenes/aiLabLayout';

const [LAST_POD_X] = podPosition(POD_COUNT - 1);
const [LAST_NODE_X] = nodePosition(NODE_COUNT - 1);
const [LAST_STAGE_X, LAST_STAGE_Y, LAST_STAGE_Z] = stagePosition(STAGE_COUNT - 1);

type ScrollRigProps = {
  simplified: boolean;
};

type Waypoint = {
  at: number; // global scrollState.progress, ascending, first must be 0, last 1
  pos: [number, number, number];
  look: [number, number, number];
};

// The camera path is a sequence of waypoints, one per scene boundary.
// Outside (establishing shot) -> workshop entrance -> desk interior -> down
// the career hallway. Portrait/mobile framing sits closer at every leg so
// the scene fills a tall, narrow viewport instead of leaving empty ground
// around it.
const WAYPOINTS: Waypoint[] = [
  { at: 0, pos: [0, 3, 22], look: [0, 3, -14] },
  { at: SCENE_BOUNDS.desk[0], pos: [0, 1.8, 2.5], look: [0, 1.7, -14] },
  { at: SCENE_BOUNDS.hallway[0], pos: [0, 2.1, -18.5], look: [0, 1.7, -22.5] },
  { at: SCENE_BOUNDS.lab[0], pos: [0, 1.7, HALLWAY_END_Z + 5], look: [0, 1.6, HALLWAY_END_Z + 1] },
  { at: SCENE_BOUNDS.engineering[0], pos: [LAST_POD_X * 0.4, 2, LAST_POD_Z + 6], look: [LAST_POD_X, 1.8, LAST_POD_Z] },
  { at: SCENE_BOUNDS.aiLab[0], pos: [LAST_NODE_X * 0.4, 2, LAST_NODE_Z + 5], look: [LAST_NODE_X, 1.6, LAST_NODE_Z] },
  {
    at: 1,
    pos: [LAST_STAGE_X * 0.5, LAST_STAGE_Y + 0.6, LAST_STAGE_Z + 5],
    look: [LAST_STAGE_X, LAST_STAGE_Y, LAST_STAGE_Z],
  },
];

const WAYPOINTS_MOBILE: Waypoint[] = [
  { at: 0, pos: [0, 3, 15], look: [0, 3, -14] },
  { at: SCENE_BOUNDS.desk[0], pos: [0, 1.8, 2.5], look: [0, 1.7, -14] },
  { at: SCENE_BOUNDS.hallway[0], pos: [0, 2.1, -17.5], look: [0, 1.7, -22.5] },
  { at: SCENE_BOUNDS.lab[0], pos: [0, 1.7, HALLWAY_END_Z + 5], look: [0, 1.6, HALLWAY_END_Z + 1] },
  { at: SCENE_BOUNDS.engineering[0], pos: [LAST_POD_X * 0.4, 2, LAST_POD_Z + 6], look: [LAST_POD_X, 1.8, LAST_POD_Z] },
  { at: SCENE_BOUNDS.aiLab[0], pos: [LAST_NODE_X * 0.4, 2, LAST_NODE_Z + 5], look: [LAST_NODE_X, 1.6, LAST_NODE_Z] },
  {
    at: 1,
    pos: [LAST_STAGE_X * 0.5, LAST_STAGE_Y + 0.6, LAST_STAGE_Z + 5],
    look: [LAST_STAGE_X, LAST_STAGE_Y, LAST_STAGE_Z],
  },
];

function sampleWaypoints(waypoints: Waypoint[], progress: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  let i = 0;
  while (i < waypoints.length - 2 && progress > waypoints[i + 1].at) i++;
  const a = waypoints[i];
  const b = waypoints[i + 1];
  const span = b.at - a.at;
  const t = span > 0 ? easeInOutCubic(Math.min(Math.max((progress - a.at) / span, 0), 1)) : 0;
  outPos.set(...a.pos).lerp(new THREE.Vector3(...b.pos), t);
  outLook.set(...a.look).lerp(new THREE.Vector3(...b.look), t);
}

export default function ScrollRig({ simplified }: ScrollRigProps) {
  const { camera } = useThree();
  const waypoints = simplified ? WAYPOINTS_MOBILE : WAYPOINTS;
  const currentPos = useRef(new THREE.Vector3(...waypoints[0].pos));
  const currentLook = useRef(new THREE.Vector3(...waypoints[0].look));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    sampleWaypoints(waypoints, scrollState.progress, targetPos.current, targetLook.current);

    // gentle smoothing so scroll-scrub still reads as a fluid camera move
    const smoothing = 1 - Math.pow(0.001, delta);
    currentPos.current.lerp(targetPos.current, smoothing);
    currentLook.current.lerp(targetLook.current, smoothing);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}
