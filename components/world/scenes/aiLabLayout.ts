import { ENGINEERING_END_Z } from './engineeringLayout';

// Shared geometry constants for the AI lab scene, used by both the scene
// mesh (AiLabScene) and the camera path (ScrollRig) so they can't drift out
// of sync with each other. STAGE_COUNT must match
// constants/scenes/ai.ts's AI_LAB_SCENE.stages.length.
export const AI_LAB_START_Z = ENGINEERING_END_Z; // continues directly from the engineering room
export const STAGE_COUNT = 8;
export const STAGE_SPACING = 8;
export const FIRST_STAGE_Z = AI_LAB_START_Z - 6;
export const LAST_STAGE_Z = FIRST_STAGE_Z - (STAGE_COUNT - 1) * STAGE_SPACING;
export const AI_LAB_END_Z = LAST_STAGE_Z - 6;

// Unlike the earlier rooms' rigid alternating-sides layout, stage markers
// drift in x/y with the pipeline stage — the design spec calls for this
// scene to feel "gradually more abstract" as it moves away from the
// physical workshop (§16), so positions loosen up rather than staying on a
// fixed grid.
export function stagePosition(index: number): [number, number, number] {
  const z = FIRST_STAGE_Z - index * STAGE_SPACING;
  const x = Math.sin(index * 2.1) * 3.5;
  const y = 1.4 + Math.cos(index * 1.6) * 0.6;
  return [x, y, z];
}
