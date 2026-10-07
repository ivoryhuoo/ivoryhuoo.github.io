import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { PALETTE } from '../../palette';
import { prefersReducedMotion } from '../../../lib/motion';
import { Sign } from './Sign';

export function PostOfficeExtras() {
  const flag = useRef<Group>(null);
  const still = prefersReducedMotion();
  useFrame(({ clock }) => {
    if (flag.current && !still) flag.current.rotation.y = Math.sin(clock.elapsedTime * 2.4 + 1) * 0.3;
  });
  return (
    <>
      <Sign text="Post Office" position={[0, 6.4, -1.97]} size={[11.5, 1.4]} bg="#FFFFFF" fg={PALETTE.postRed} />
      <group ref={flag} position={[-5.5, 5.9, 0.5]}>
        <mesh position={[0.9, -0.55, 0]} castShadow>
          <boxGeometry args={[1.8, 1.1, 0.06]} />
          <meshStandardMaterial color={PALETTE.accentBlue} />
        </mesh>
      </group>
    </>
  );
}
