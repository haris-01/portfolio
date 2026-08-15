type EnvironmentProps = {
  simplified: boolean;
};

// Shared ground, fog, and key lighting — rendered once and shared by every
// scene, since the whole journey is meant to read as one connected world
// (design spec §6) rather than several disconnected environments.
export default function Environment({ simplified }: EnvironmentProps) {
  return (
    <>
      <fog attach='fog' args={['#F3F1EB', 12, simplified ? 32 : 45]} />
      <ambientLight intensity={0.65} color='#F3F1EB' />
      <directionalLight position={[8, 10, 6]} intensity={1.1} color='#FFF3E4' castShadow={!simplified} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color='#DAD5C8' />
      </mesh>
    </>
  );
}
