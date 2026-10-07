import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { boxGeometry, cylinderGeometry, material } from '../../bricks/materials';
import { PALETTE } from '../../palette';
import { CRANE } from '../builders/construction';
import { prefersReducedMotion } from '../../../lib/motion';
import { Sign } from './Sign';

/** The crane's jib slowly swings round, carrying a pallet of bricks. */
export function ConstructionExtras() {
  const jib = useRef<Group>(null);
  const still = prefersReducedMotion();
  useFrame(({ clock }) => {
    if (jib.current && !still) jib.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 1.2;
  });
  const yellow = material(PALETTE.yellow);
  return (
    <>
      <Sign text="Under Construction" position={[-5.5, 1.2, -0.77]} size={[6.3, 1.6]} bg={PALETTE.yellow} fg="#1A1A1A" />
      <group ref={jib} position={[CRANE.x, CRANE.top, CRANE.z]}>
        <mesh geometry={boxGeometry(14, 0.6, 0.6)} material={yellow} position={[3, 0.3, 0]} castShadow />
        <mesh geometry={boxGeometry(1.2, 1.2, 1.2)} material={material('#2A3240')} position={[0, 1.2, 0]} castShadow />
        <mesh geometry={boxGeometry(1.6, 1.2, 1)} material={material(PALETTE.concrete)} position={[-3.4, -0.3, 0]} castShadow />
        <mesh geometry={cylinderGeometry(0.04, 6, 6)} material={material(PALETTE.dark)} position={[8, -3, 0]} />
        <mesh geometry={boxGeometry(1.6, 0.2, 1.2)} material={material(PALETTE.brown)} position={[8, -6.1, 0]} castShadow />
        {[
          [PALETTE.red, -0.4],
          [PALETTE.accentBlue, 0.4],
        ].map(([c, z]) => (
          <mesh key={c} geometry={boxGeometry(1.4, 0.5, 0.7)} material={material(c as string)} position={[8, -5.75, z as number]} castShadow />
        ))}
      </group>
    </>
  );
}
