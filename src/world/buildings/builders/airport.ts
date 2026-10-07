import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;

/** Runway centreline in local coordinates; the plane in the extras uses it too. */
export const RUNWAY_Z = -21;
export const PLANE_PARK_X = -16;

/**
 * The Airport in local coordinates: a white terminal with a glass front and a
 * blue roof, a control tower, and a runway behind. Front faces +z.
 */
export function buildAirport(): BrickSet {
  const s = new BrickSet();

  s.brick(20, 10, PLATE_H, P.stone, -10, 0, -11, { studs: false }).solid(-10, -11, 10, -1);
  s.brick(16, 6, 4.8, P.interior, -8, PLATE_H, -9, { studs: false, cast: false });

  const wall = { baseY: PLATE_H, rows: 4, color: () => P.white };
  const win = (from: number, to: number) => ({ from, to, rowFrom: 1, rowTo: 2, kind: 'window' as const });
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -3, from: -9, to: 9,
    openings: [{ from: -2, to: 2, rowFrom: 0, rowTo: 2, kind: 'door' }, win(-8, -3), win(3, 8)],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -10, from: -9, to: 9, openings: [win(-7, -1), win(1, 7)] });
  runningBondWall(s, { ...wall, axis: 'z', fixed: -9, from: -9, to: -3, openings: [win(-8, -4)] });
  runningBondWall(s, { ...wall, axis: 'z', fixed: 8, from: -9, to: -3, openings: [win(-8, -4)] });

  const glass = { studs: false, cast: false, finish: 'glass' as const };
  s.brick(2, 0.16, 3.6, P.glass, -2, PLATE_H, -2.58, glass);
  s.brick(2, 0.16, 3.6, P.glass, 0, PLATE_H, -2.58, glass);

  // Entrance canopy on two posts
  for (const x of [-4, 3]) s.brick(1, 1, 3.6, P.steel, x, PLATE_H, -2, { studs: false });
  s.brick(8, 2, PLATE_H, P.steel, -4, PLATE_H + 3.6, -3);

  // Roof: white slab with two layers of blue
  const roofY = PLATE_H + 4 * BRICK_H;
  s.brick(20, 10, PLATE_H, P.white, -10, roofY, -11, { studs: false });
  s.brick(18, 8, PLATE_H, P.accentBlue, -9, roofY + PLATE_H, -10);
  s.brick(14, 6, PLATE_H, P.skyBlue, -7, roofY + 2 * PLATE_H, -9);
  // Sign board on the front edge of the roof
  s.brick(12, 1, 1.8, P.white, -6, roofY + PLATE_H, -2, { studs: false });

  // Control tower
  s.brick(2, 2, PLATE_H, P.stone, 11, 0, -9, { studs: false }).solid(11, -9, 13, -7);
  s.cylinder(0.9, 9.6, P.white, 12, PLATE_H, -8, { segments: 20 });
  s.cylinder(1.6, 1.6, P.glass, 12, 10, -8, { segments: 20, finish: 'glass' });
  s.cylinder(1.9, PLATE_H, P.dark, 12, 11.6, -8, { segments: 20 });
  s.cylinder(0.06, 1.6, P.dark, 12, 12, -8, { segments: 6 });
  s.cylinder(0.15, 0.25, P.beacon, 12, 13.6, -8, { segments: 10, finish: 'glow' });

  // Runway with centreline dashes and threshold bars
  s.brick(46, 6, 0.22, P.runway, -20, 0, RUNWAY_Z - 3, { studs: false, cast: false });
  for (let x = -14; x < 24; x += 4) s.brick(2, 0.4, 0.24, P.white, x, 0, RUNWAY_Z - 0.2, { studs: false, cast: false });
  for (const z of [-23.4, -22.4, -20.2, -19.2]) s.brick(1.6, 0.5, 0.24, P.white, -19.4, 0, z, { studs: false, cast: false });

  // Windsock
  s.cylinder(0.06, 3, P.dark, -14, 0, -16, { segments: 6 });
  s.cylinder(0.3, 0.9, P.cone, -14, 2.2, -15.5, { segments: 10 });

  return s;
}
