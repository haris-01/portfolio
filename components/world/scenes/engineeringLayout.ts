import { LAB_END_Z } from './labLayout';

// Shared geometry constants for the engineering room scene, used by both
// the scene mesh (EngineeringScene) and the camera path (ScrollRig) so they
// can't drift out of sync with each other. NODE_COUNT must match
// constants/scenes/engineering.ts's ENGINEERING_SCENE.stages.length.
export const ENGINEERING_START_Z = LAB_END_Z; // continues directly from the lab
export const ENGINEERING_WIDTH = 8;
export const NODE_COUNT = 7;
export const NODE_SPACING = 7;
export const FIRST_NODE_Z = ENGINEERING_START_Z - 6;
export const LAST_NODE_Z = FIRST_NODE_Z - (NODE_COUNT - 1) * NODE_SPACING;
export const ENGINEERING_END_Z = LAST_NODE_Z - 6;

export function nodePosition(index: number): [number, number] {
  const z = FIRST_NODE_Z - index * NODE_SPACING;
  const x = index % 2 === 0 ? -3 : 3;
  return [x, z];
}
