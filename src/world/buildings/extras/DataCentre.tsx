import { useFrame } from '@react-three/fiber';
import { material } from '../../bricks/materials';
import { PALETTE } from '../../palette';
import { prefersReducedMotion } from '../../../lib/motion';
import { Sign } from './Sign';

const P = PALETTE;

/** Lit sign, plus blinking rack lights and roof beacons (shared with the airport tower). */
export function DataCentreExtras() {
  const still = prefersReducedMotion();
  useFrame(({ clock }) => {
    if (still) return;
    const t = clock.elapsedTime;
    material(P.ledBlue, 'glow').emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 5);
    material(P.ledGreen, 'glow').emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 3.3 + 1.7);
    material(P.beacon, 'glow').emissiveIntensity = Math.sin(t * 2) > 0.6 ? 1.6 : 0.15;
  });
  return <Sign text="Data Centre" position={[0, 7.8, -1.97]} size={[13, 1.7]} bg={PALETTE.concreteDark} fg="#7FD0FF" lit />;
}
