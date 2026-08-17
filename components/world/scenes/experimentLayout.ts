import { AI_LAB_END_Z } from './aiLabLayout';

// Shared geometry constants for the experiment room scene, used by both the
// scene mesh (ExperimentScene) and the camera path (ScrollRig) so they
// can't drift out of sync with each other. ITEM_COUNT must match
// constants/scenes/experiment.ts's EXPERIMENT_SCENE.experiments.length.
export const EXPERIMENT_START_Z = AI_LAB_END_Z; // continues directly from the AI lab
export const EXPERIMENT_WIDTH = 10;
export const ITEM_COUNT = 6;
export const ITEM_SPACING = 8;
export const FIRST_ITEM_Z = EXPERIMENT_START_Z - 6;
export const LAST_ITEM_Z = FIRST_ITEM_Z - (ITEM_COUNT - 1) * ITEM_SPACING;
export const EXPERIMENT_END_Z = LAST_ITEM_Z - 6;

export function itemPosition(index: number): [number, number] {
  const z = FIRST_ITEM_Z - index * ITEM_SPACING;
  const x = index % 2 === 0 ? -3.5 : 3.5;
  return [x, z];
}
