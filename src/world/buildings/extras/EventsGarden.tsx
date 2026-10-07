import { PALETTE } from '../../palette';
import { Sign } from './Sign';

/** The sign over the entrance arch, and the gala banner on the stage (both face north). */
export function EventsGardenExtras() {
  return (
    <>
      <Sign
        text="Events Garden"
        position={[0, 5.5, -0.82]}
        rotation={[0, Math.PI, 0]}
        size={[5.8, 1.25]}
        bg="#FFFFFF"
        fg={PALETTE.navy}
      />
      <Sign
        text="Gala Night"
        position={[6, 3.2, 16.97]}
        rotation={[0, Math.PI, 0]}
        size={[6.5, 0.9]}
        bg={PALETTE.navy}
        fg={PALETTE.gold}
        lit
      />
    </>
  );
}
