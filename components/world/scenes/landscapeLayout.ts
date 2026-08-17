import { WHITE_ROOM_END_Z } from './whiteRoomLayout';

// Shared geometry constants for the final landscape scene, used by both the
// scene mesh (LandscapeScene) and the camera path (ScrollRig).
export const LANDSCAPE_START_Z = WHITE_ROOM_END_Z; // continues directly from the white room
export const LANDSCAPE_LENGTH = 40;
export const LANDSCAPE_END_Z = LANDSCAPE_START_Z - LANDSCAPE_LENGTH;
// the character walks from the white room's exit toward the horizon as the scene plays out
export const CHARACTER_START_Z = LANDSCAPE_START_Z;
export const CHARACTER_END_Z = LANDSCAPE_END_Z + 6;
