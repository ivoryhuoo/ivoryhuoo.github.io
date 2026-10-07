import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;
export const STUDIO_ROOF_Y = PLATE_H + 4 * BRICK_H;

/**
 * The Product Studio in local coordinates: a cream workshop with a big glass
 * garage door, a sawtooth roof with north-facing skylights, workbenches with
 * blueprints inside, and a giant light bulb on the roof. Front faces +z.
 */
export function buildProductStudio(): BrickSet {
  const s = new BrickSet();

  s.brick(16, 11, PLATE_H, P.stone, -8, 0, -12, { studs: false }).solid(-8, -12, 8, -1);
  s.brick(14, 8, 4.8, P.interior, -7, PLATE_H, -11, { studs: false, cast: false });

  const wall = { baseY: PLATE_H, rows: 4, color: (r: number) => (r === 0 ? P.concreteDark : P.cream) };
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -3, from: -8, to: 8,
    openings: [
      { from: -7, to: -1, rowFrom: 0, rowTo: 2, kind: 'window' },
      { from: 1, to: 3, rowFrom: 0, rowTo: 2, kind: 'door' },
      { from: 4, to: 7, rowFrom: 1, rowTo: 2, kind: 'window' },
    ],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -12, from: -8, to: 8 });
  for (const fixed of [-8, 7]) {
    runningBondWall(s, { ...wall, axis: 'z', fixed, from: -11, to: -3, openings: [{ from: -9, to: -6, rowFrom: 1, rowTo: 2, kind: 'window' }] });
  }
  s.brick(2, 0.16, 3.6, P.glass, 1, PLATE_H, -2.58, { studs: false, cast: false, finish: 'glass' });

  // Workbenches with blueprints, visible through the garage glass
  for (const x of [-6.5, -3.5]) {
    s.brick(2.6, 2, 1.0, P.brown, x, PLATE_H, -7, { studs: false });
    s.brick(2.2, 1.6, 0.06, P.blueprint, x + 0.2, PLATE_H + 1.0, -6.8, { studs: false, cast: false });
  }

  // Sawtooth roof: three teeth, each high at the back with a glass skylight
  s.brick(16, 10, PLATE_H, P.white, -8, STUDIO_ROOF_Y, -12, { studs: false });
  for (const z0 of [-12, -9, -6]) {
    s.brick(16, 3, 0.6, P.roofGrey, -8, STUDIO_ROOF_Y + PLATE_H, z0, { studs: false });
    s.brick(16, 2, 0.6, P.roofGrey, -8, STUDIO_ROOF_Y + PLATE_H + 0.6, z0, { studs: false });
    s.brick(16, 1, 0.6, P.roofGrey, -8, STUDIO_ROOF_Y + PLATE_H + 1.2, z0);
    s.brick(16, 0.16, 1.8, P.glass, -8, STUDIO_ROOF_Y + PLATE_H, z0 - 0.1, { studs: false, cast: false, finish: 'glass' });
  }

  // Sign fascia along the front of the roof, with a light bulb on top
  s.brick(14, 1, 1.8, P.cream, -7, STUDIO_ROOF_Y + PLATE_H, -3, { studs: false });
  const bulbY = STUDIO_ROOF_Y + PLATE_H + 1.8;
  s.cylinder(0.45, 0.6, P.steel, 5.8, bulbY, -2.5, { segments: 16 });
  s.cylinder(0.75, 1.2, P.yellow, 5.8, bulbY + 0.6, -2.5, { segments: 20, finish: 'glow' });
  s.cylinder(0.45, 0.3, P.yellow, 5.8, bulbY + 1.8, -2.5, { segments: 16, finish: 'glow' });

  return s;
}
