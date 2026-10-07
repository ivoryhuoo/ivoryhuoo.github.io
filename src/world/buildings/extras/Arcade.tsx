import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, NearestFilter, SRGBColorSpace, TextureLoader, type Group } from 'three';
import { PALETTE } from '../../palette';
import { ARCADE_ROOF_Y } from '../builders/arcade';
import { arcadeArt } from '../../../lib/assets';
import { prefersReducedMotion } from '../../../lib/motion';
import { Sign } from './Sign';

/** The three Aftermath Creatures peek over the marquee: [sprite, x, width/height]. */
const MASCOTS: Array<[string, number, number]> = [
  ['NormalHuman', -4, 167 / 285],
  ['NormalRobot', 0, 167 / 316],
  ['NormalZombie', 4, 167 / 285],
];
const HEIGHT = 4.2;
/** The robot is drawn taller (antenna), so scale it to line its head up with the others. */
const heightOf = (name: string) => (name.includes('Robot') ? (HEIGHT * 316) / 284 : HEIGHT);

function Mascot({ name, x, aspect, phase }: { name: string; x: number; aspect: number; phase: number }) {
  const ref = useRef<Group>(null);
  const still = prefersReducedMotion();
  const texture = useMemo(() => {
    const t = new TextureLoader().load(arcadeArt(name));
    t.magFilter = NearestFilter;
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [name]);
  useFrame(({ clock }) => {
    if (ref.current && !still) ref.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 2 + phase)) * 0.35;
  });
  return (
    <group ref={ref}>
      <mesh position={[x, ARCADE_ROOF_Y + heightOf(name) / 2, -6]}>
        <planeGeometry args={[heightOf(name) * aspect, heightOf(name)]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.5} side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function ArcadeExtras() {
  return (
    <>
      <Sign
        text="Arcade"
        position={[0, ARCADE_ROOF_Y + 1.0, -1.97]}
        size={[11.6, 1.8]}
        bg={PALETTE.arcadePurple}
        fg={PALETTE.neonPink}
        lit
      />
      {MASCOTS.map(([name, x, aspect], i) => (
        <Mascot key={name} name={name} x={x} aspect={aspect} phase={i * 0.9} />
      ))}
    </>
  );
}
