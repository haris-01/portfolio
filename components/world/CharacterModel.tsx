import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { THEME } from '@/lib/theme';
import { CHARACTER_MODEL } from '@/constants/character';

type CharacterModelProps = {
  simplified?: boolean;
  seated?: boolean;
};

// The primitive stand-in used everywhere until a real model exists — see
// docs/3D_MODELS.md. `seated` shrinks and lowers the body for the desk
// scene; every other scene uses the standing proportions.
function PrimitiveCharacter({ simplified, seated }: CharacterModelProps) {
  const radius = seated ? 0.3 : 0.32;
  const bodyLength = seated ? 0.5 : 0.9;
  const bodyY = seated ? 0.55 : 0.9;
  const headY = seated ? 1.15 : 1.72;

  return (
    <>
      <mesh position={[0, bodyY, 0]} castShadow={!simplified}>
        <capsuleGeometry args={[radius, bodyLength, 4, 8]} />
        <meshStandardMaterial color={THEME.core.surface} />
      </mesh>
      <mesh position={[0, headY, 0]} castShadow={!simplified}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={THEME.material.skin} />
      </mesh>
    </>
  );
}

function GltfCharacter({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} />;
}

// Single source of the portfolio's character, used across the intro, desk,
// white room, and landscape scenes. Renders the real model once
// constants/character.ts's CHARACTER_MODEL.url is set; until then (and
// while the model is loading), falls back to the primitive placeholder —
// nothing else in a scene needs to change either way.
export default function CharacterModel({ simplified, seated }: CharacterModelProps) {
  if (!CHARACTER_MODEL.url) {
    return <PrimitiveCharacter simplified={simplified} seated={seated} />;
  }

  return (
    <Suspense fallback={<PrimitiveCharacter simplified={simplified} seated={seated} />}>
      <GltfCharacter url={CHARACTER_MODEL.url} scale={CHARACTER_MODEL.scale} />
    </Suspense>
  );
}
