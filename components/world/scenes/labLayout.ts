import { HALLWAY_END_Z } from './hallwayLayout';

// Shared geometry constants for the project lab scene, used by both the
// scene mesh (LabScene) and the camera path (ScrollRig) so they can't drift
// out of sync with each other. POD_COUNT must match
// constants/scenes/lab.ts's LAB_SCENE.projects.length.
export const LAB_START_Z = HALLWAY_END_Z; // continues directly from the hallway
export const LAB_WIDTH = 18;
export const POD_COUNT = 3;
export const POD_SPACING = 12;
export const FIRST_POD_Z = LAB_START_Z - 10;
export const LAST_POD_Z = FIRST_POD_Z - (POD_COUNT - 1) * POD_SPACING;
export const LAB_END_Z = LAST_POD_Z - 10;

export function podPosition(index: number): [number, number] {
  const z = FIRST_POD_Z - index * POD_SPACING;
  const x = index % 2 === 0 ? -5 : 5;
  return [x, z];
}
