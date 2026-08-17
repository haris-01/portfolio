import CharacterModel from '@/components/world/CharacterModel';
import { WHITE_ROOM_CHARACTER_Z } from './whiteRoomLayout';

// Deliberately close to empty — design spec §18: "remove almost everything
// ... just the character and one statement." No walls, no props, no
// activation lighting. The emotional pause of the journey.
export default function WhiteRoomScene() {
  return (
    <group position={[0, 0, WHITE_ROOM_CHARACTER_Z]}>
      <CharacterModel />
    </group>
  );
}
