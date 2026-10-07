import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { boxGeometry, cylinderGeometry, material } from '../bricks/materials';
import { PALETTE } from '../palette';
import { prefersReducedMotion } from '../../lib/motion';
import { FEATURES } from './scenery';

/** A hot-air balloon made of stacked rings, with stripes, a basket and ropes. */
function Balloon({ color, x, z, height, phase }: { color: string; x: number; z: number; height: number; phase: number }) {
  const ref = useRef<Group>(null);
  const still = prefersReducedMotion();
  useFrame(({ clock }) => {
    if (!ref.current || still) return;
    const t = clock.elapsedTime * 0.35 + phase;
    ref.current.position.y = height + Math.sin(t) * 1.4;
    ref.current.rotation.y = t * 0.15;
  });
  // ring radii from bottom to top, like a balloon's silhouette
  const rings = [1.2, 2.2, 2.9, 3.2, 3.2, 2.9, 2.3, 1.3];
  return (
    <group ref={ref} position={[x, height, z]}>
      {rings.map((r, i) => (
        <mesh
          key={i}
          position={[0, 2.2 + i * 0.8, 0]}
          geometry={cylinderGeometry(r, 0.8, 16)}
          material={material(i % 2 ? '#FFFFFF' : color)}
          castShadow
        />
      ))}
      {[-0.55, 0.55].flatMap((dx) =>
        [-0.55, 0.55].map((dz) => (
          <mesh key={`${dx}${dz}`} position={[dx, 1.1, dz]} geometry={boxGeometry(0.06, 2.2, 0.06)} material={material(PALETTE.dark)} />
        )),
      )}
      <mesh geometry={boxGeometry(1.4, 0.9, 1.4)} material={material(PALETTE.brown)} castShadow />
    </group>
  );
}

/** A small sailboat bobbing on the sea. */
function Sailboat({ x, z, turn, phase, sail }: { x: number; z: number; turn: number; phase: number; sail: string }) {
  const ref = useRef<Group>(null);
  const still = prefersReducedMotion();
  useFrame(({ clock }) => {
    if (!ref.current || still) return;
    const t = clock.elapsedTime * 1.1 + phase;
    ref.current.position.y = -0.1 + Math.sin(t) * 0.12;
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.05;
  });
  return (
    <group ref={ref} position={[x, -0.1, z]} rotation={[0, turn, 0]}>
      <mesh geometry={boxGeometry(5, 0.8, 1.8)} material={material('#FFFFFF')} castShadow />
      <mesh position={[0, 0.25, 0]} geometry={boxGeometry(5.04, 0.2, 1.84)} material={material(PALETTE.accentBlue)} />
      <mesh position={[0, 2.6, 0]} geometry={boxGeometry(0.15, 4.4, 0.15)} material={material(PALETTE.brown)} />
      <mesh position={[-0.9, 2.8, 0]} geometry={boxGeometry(1.6, 3.2, 0.08)} material={material(sail)} castShadow />
      <mesh position={[0.6, 2.4, 0]} geometry={boxGeometry(1, 2.2, 0.08)} material={material('#FFFFFF')} />
    </group>
  );
}

const CABIN_COLORS = [PALETTE.balloonPink, PALETTE.balloonYellow, PALETTE.teal, '#FFFFFF'];

/** A Ferris wheel that slowly turns; its cabins stay upright. */
function FerrisWheel({ x, z }: { x: number; z: number }) {
  const wheel = useRef<Group>(null);
  const cabins = useRef<Array<Group | null>>([]);
  const still = prefersReducedMotion();
  const R = 7;
  const H = 9;
  const N = 8;
  useFrame(({ clock }) => {
    if (!wheel.current || still) return;
    const a = clock.elapsedTime * 0.18;
    wheel.current.rotation.z = a;
    cabins.current.forEach((c) => c && (c.rotation.z = -a));
  });
  return (
    <group position={[x, 0, z]}>
      {/* A-frame legs on both sides */}
      {[-1.4, 1.4].map((dz) =>
        [-1, 1].map((side) => (
          <mesh
            key={`${dz}${side}`}
            position={[side * 2.4, H / 2, dz]}
            rotation={[0, 0, side * 0.5]}
            geometry={boxGeometry(0.35, H + 0.6, 0.35)}
            material={material(PALETTE.white)}
            castShadow
          />
        )),
      )}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={cylinderGeometry(0.4, 3.4, 10)} material={material(PALETTE.dark)} />
      <group ref={wheel} position={[0, H, 0]}>
        {Array.from({ length: N }, (_, i) => {
          const t = (i / N) * Math.PI * 2;
          return (
            <group key={i}>
              {/* spoke */}
              <mesh rotation={[0, 0, t]} position={[(Math.cos(t) * R) / 2, (Math.sin(t) * R) / 2, 0]} geometry={boxGeometry(R, 0.18, 0.18)} material={material(PALETTE.balloonPink)} />
              {/* rim piece */}
              <mesh
                position={[Math.cos(t + Math.PI / N) * R * 0.98, Math.sin(t + Math.PI / N) * R * 0.98, 0]}
                rotation={[0, 0, t + Math.PI / N + Math.PI / 2]}
                geometry={boxGeometry(2 * R * Math.sin(Math.PI / N) + 0.3, 0.3, 0.3)}
                material={material(PALETTE.white)}
              />
              {/* cabin, hung from the rim, kept upright */}
              <group position={[Math.cos(t) * R, Math.sin(t) * R, 0]} ref={(g) => (cabins.current[i] = g)}>
                <mesh position={[0, -0.9, 0]} geometry={boxGeometry(1.3, 1.2, 1.3)} material={material(CABIN_COLORS[i % CABIN_COLORS.length])} castShadow />
                <mesh position={[0, -0.15, 0]} geometry={boxGeometry(1.5, 0.2, 1.5)} material={material(PALETTE.white)} />
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}

/** Things that move around the island: balloons overhead and boats offshore. */
export function SceneryExtras() {
  return (
    <>
      <FerrisWheel x={FEATURES.ferris.x} z={FEATURES.ferris.z} />
      <Balloon color={PALETTE.balloonPink} x={-60} z={-58} height={22} phase={0} />
      <Balloon color={PALETTE.balloonYellow} x={60} z={44} height={26} phase={2} />
      <Balloon color={PALETTE.teal} x={-52} z={56} height={30} phase={4} />
      <Sailboat x={-92} z={20} turn={0.4} phase={0} sail={PALETTE.balloonPink} />
      <Sailboat x={90} z={-30} turn={-0.6} phase={1.5} sail={PALETTE.balloonYellow} />
      <Sailboat x={30} z={92} turn={1.2} phase={3} sail="#FFFFFF" />
    </>
  );
}
