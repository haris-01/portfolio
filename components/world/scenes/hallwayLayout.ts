// Shared geometry constants for the hallway scene, used by both the scene
// mesh (HallwayScene) and the camera path (ScrollRig) so they can't drift
// out of sync with each other. DOOR_COUNT must match
// constants/scenes/hallway.ts's HALLWAY_SCENE.stages.length.
export const HALLWAY_START_Z = -34; // just past the desk room's back wall
export const DOOR_COUNT = 5;
export const DOOR_SPACING = 7;
export const HALLWAY_WIDTH = 6;
export const FIRST_DOOR_Z = HALLWAY_START_Z - 6;
export const LAST_DOOR_Z = FIRST_DOOR_Z - (DOOR_COUNT - 1) * DOOR_SPACING;
export const HALLWAY_END_Z = LAST_DOOR_Z - 6;
