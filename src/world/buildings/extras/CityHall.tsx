import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { drawCanadianFlag } from '../../../lib/mapleLeaf';
import { prefersReducedMotion } from '../../../lib/motion';
import { useCanvasTexture } from '../../useCanvasTexture';
import { Sign } from './Sign';

/** City Hall's sign and a waving Canadian flag. */
export function CityHallExtras() {
  const flag = useRef<Group>(null);
  const still = prefersReducedMotion();
  const cloth = useCanvasTexture(512, 256, drawCanadianFlag);
  useFrame(({ clock }) => {
    if (flag.current && !still) flag.current.rotation.y = Math.sin(clock.elapsedTime * 2.2) * 0.28;
  });
  return (
    <>
      <Sign text="City Hall" position={[0, 9.9, -2.97]} size={[12, 1.5]} bg="#F3F1EA" fg="#2A3240" />
      <group ref={flag} position={[0, 18.5, -9.5]}>
        <mesh position={[1.35, -0.68, 0]} castShadow>
          <boxGeometry args={[2.6, 1.3, 0.04]} />
          <meshStandardMaterial map={cloth} roughness={0.7} />
        </mesh>
      </group>
    </>
  );
}
