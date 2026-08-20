import { THEME } from '@/lib/theme';
import { LANDSCAPE_START_Z, LANDSCAPE_END_Z } from './landscapeLayout';

type LandscapeSceneProps = {
  simplified: boolean;
};

function Mountains() {
  const centerZ = (LANDSCAPE_START_Z + LANDSCAPE_END_Z) / 2;
  // a simple ridge of low-poly peaks, far off to both sides — calm, distant,
  // fading toward the fog rather than drawing attention (design spec §19)
  const peaks: [number, number, number, string][] = [
    [-22, 5, centerZ - 6, THEME.core.warmGray],
    [-14, 7, centerZ - 14, THEME.material.wallDark],
    [16, 6, centerZ - 10, THEME.core.warmGray],
    [24, 8, centerZ - 18, THEME.material.wallDark],
    [-4, 9, centerZ - 24, THEME.core.metal],
  ];

  return (
    <>
      {peaks.map(([x, height, z, color], i) => (
        <mesh key={i} position={[x, height / 2, z]}>
          <coneGeometry args={[height * 1.1, height, 4]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </>
  );
}

export default function LandscapeScene(_props: LandscapeSceneProps) {
  return (
    <>
      <Mountains />
    </>
  );
}
