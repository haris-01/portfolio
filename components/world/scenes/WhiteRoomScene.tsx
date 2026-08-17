import { THEME } from '@/lib/theme';
import { WHITE_ROOM_CHARACTER_Z } from './whiteRoomLayout';

// Deliberately close to empty — design spec §18: "remove almost everything
// ... just the character and one statement." No walls, no props, no
// activation lighting. The emotional pause of the journey.
export default function WhiteRoomScene() {
  return (
    <group position={[0, 0, WHITE_ROOM_CHARACTER_Z]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.9, 4, 8]} />
        <meshStandardMaterial color={THEME.core.surface} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={THEME.material.skin} />
      </mesh>
    </group>
  );
}
