import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { boxGeometry, material } from '../../bricks/materials';
import { PALETTE } from '../../palette';
import { PLANE_PARK_X, RUNWAY_Z } from '../builders/airport';
import { prefersReducedMotion } from '../../../lib/motion';
import { Sign } from './Sign';

const CYCLE = 24;
const GROUND = 0.9;

/** Where the plane is `t` seconds into its loop: parked, take-off roll, climb, gone. */
function flight(t: number) {
  if (t < 3) return { x: PLANE_PARK_X, y: GROUND, pitch: 0, visible: true };
  if (t < 12) {
    const k = (t - 3) / 9;
    const x = PLANE_PARK_X + 52 * k * k;
    const lift = Math.max(0, x - 8);
    return { x, y: GROUND + Math.pow(lift, 1.6) * 0.08, pitch: Math.min(0.25, lift * 0.02), visible: true };
  }
  if (t < 16) {
    const k = t - 12;
    return { x: 36 + k * 14, y: GROUND + 16.5 + k * 4, pitch: 0.25, visible: true };
  }
  return { x: PLANE_PARK_X, y: GROUND, pitch: 0, visible: false };
}

/** A small brick airliner, nose pointing +x. */
function Plane() {
  const white = material('#FAFAFA');
  const blue = material(PALETTE.accentBlue);
  const dark = material('#2A3240');
  return (
    <group>
      <mesh geometry={boxGeometry(6, 1, 1)} material={white} castShadow />
      <mesh geometry={boxGeometry(0.8, 0.7, 0.8)} material={white} position={[3.3, -0.05, 0]} castShadow />
      <mesh geometry={boxGeometry(0.5, 0.25, 0.84)} material={dark} position={[3.2, 0.2, 0]} />
      <mesh geometry={boxGeometry(5.2, 0.15, 1.02)} material={blue} position={[0, -0.2, 0]} />
      <mesh geometry={boxGeometry(1.4, 0.15, 7)} material={white} position={[0.2, -0.2, 0]} castShadow />
      <mesh geometry={boxGeometry(1.4, 0.16, 0.6)} material={blue} position={[0.2, -0.2, 3.3]} />
      <mesh geometry={boxGeometry(1.4, 0.16, 0.6)} material={blue} position={[0.2, -0.2, -3.3]} />
      <mesh geometry={boxGeometry(0.9, 1.4, 0.12)} material={blue} position={[-2.7, 1.1, 0]} castShadow />
      <mesh geometry={boxGeometry(0.8, 0.1, 2.4)} material={white} position={[-2.7, 0.3, 0]} />
      {[-1.6, 1.6].map((z) => (
        <mesh key={z} geometry={boxGeometry(1.0, 0.5, 0.5)} material={material(PALETTE.steel)} position={[0.4, -0.55, z]} />
      ))}
    </group>
  );
}

export function AirportExtras() {
  const plane = useRef<Group>(null);
  const still = prefersReducedMotion();
  useFrame(({ clock }) => {
    const g = plane.current;
    if (!g) return;
    const f = flight(still ? 0 : clock.elapsedTime % CYCLE);
    g.visible = f.visible;
    g.position.set(f.x, f.y, RUNWAY_Z);
    g.rotation.z = f.pitch;
  });
  return (
    <>
      <Sign text="Airport" position={[0, 6.5, -0.97]} size={[11.5, 1.6]} bg="#FFFFFF" fg={PALETTE.accentBlue} />
      <group ref={plane}>
        <Plane />
      </group>
    </>
  );
}
