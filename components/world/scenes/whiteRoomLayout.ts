import { AI_LAB_EXIT_END_Z } from './aiLabLayout';

// Shared geometry constants for the white room scene — deliberately sparse
// (design spec §18: "remove almost everything"), so there's just a start/end
// span and a character position, not a repeating item layout like the
// earlier rooms.
export const WHITE_ROOM_START_Z = AI_LAB_EXIT_END_Z; // continues directly from AI lab, past the folded experiment beat
export const WHITE_ROOM_LENGTH = 26;
export const WHITE_ROOM_END_Z = WHITE_ROOM_START_Z - WHITE_ROOM_LENGTH;
export const WHITE_ROOM_CHARACTER_Z = WHITE_ROOM_START_Z - WHITE_ROOM_LENGTH / 2;
