import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;
export const ARCADE_ROOF_Y = PLATE_H + 4 * BRICK_H + PLATE_H;

/** One arcade cabinet with a glowing screen and controls. Faces +z. */
function cabinet(s: BrickSet, x: number, z: number, body: string, screen: string) {
  s.brick(1.4, 1, 2.6, body, x, PLATE_H, z, { studs: false });
  s.brick(1.0, 0.1, 0.8, screen, x + 0.2, PLATE_H + 1.5, z + 1, { studs: false, cast: false, finish: 'glow' });
  s.brick(1.4, 0.4, 0.2, P.dark, x, PLATE_H + 1.1, z + 1, { studs: false });
}

/**
 * The Arcade in local coordinates: a dark purple building with a neon band, a
 * big storefront showing cabinets inside, and a marquee on the roof. Front
 * faces +z (it's turned to face the street when placed).
 */
export function buildArcade(): BrickSet {
  const s = new BrickSet();

  s.brick(16, 11, PLATE_H, P.dark, -8, 0, -12, { studs: false }).solid(-8, -12, 8, -1);
  s.brick(12, 7, 4.8, P.interior, -6, PLATE_H, -10, { studs: false, cast: false });

  const wall = {
    baseY: PLATE_H,
    rows: 4,
    color: (r: number) => (r === 3 ? P.neonPink : P.arcadePurple),
    finish: (r: number) => (r === 3 ? ('glow' as const) : ('plastic' as const)),
  };
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -3, from: -7, to: 7,
    openings: [
      { from: -1, to: 1, rowFrom: 0, rowTo: 2, kind: 'door' },
      { from: -6, to: -2, rowFrom: 0, rowTo: 2, kind: 'window' },
      { from: 2, to: 6, rowFrom: 0, rowTo: 2, kind: 'window' },
    ],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -10, from: -7, to: 7 });
  runningBondWall(s, { ...wall, axis: 'z', fixed: -7, from: -9, to: -3 });
  runningBondWall(s, { ...wall, axis: 'z', fixed: 6, from: -9, to: -3 });

  const glass = { studs: false, cast: false, finish: 'glass' as const };
  s.brick(2, 0.16, 3.6, P.glass, -1, PLATE_H, -2.58, glass);

  // One cabinet per side project: Aftermath Creatures, Uplift, waste awAI, Pitch Perfect
  cabinet(s, -5.5, -8, '#2F7D32', P.ledGreen);
  cabinet(s, -3.5, -8, '#B9A8F5', '#FF9EC6');
  cabinet(s, 2.1, -8, '#2E6FC2', '#A9D8F5');
  cabinet(s, 4.1, -8, '#E8873A', '#FFE58A');

  // Roof and marquee with neon trim
  s.brick(16, 10, PLATE_H, P.arcadePurple, -8, PLATE_H + 4 * BRICK_H, -11);
  s.brick(12, 1, 2.0, P.arcadePurple, -6, ARCADE_ROOF_Y, -3, { studs: false });
  s.brick(12, 1, 0.2, P.neonCyan, -6, ARCADE_ROOF_Y + 2.0, -3, { studs: false, finish: 'glow' });

  // Neon posts at the front corners
  for (const x of [-7, 6]) s.brick(1, 0.3, 4.8, P.neonCyan, x, PLATE_H, -2, { studs: false, finish: 'glow' });

  return s;
}
