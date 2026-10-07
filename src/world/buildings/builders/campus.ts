import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;
export const CAMPUS_ROOF_Y = PLATE_H + 5 * BRICK_H;
export const TOWER_BASE_Y = CAMPUS_ROOF_Y + 2 * PLATE_H;

/**
 * The Campus in local coordinates (styled after Western): a stone hall with tall narrow windows,
 * a purple roof and a clock tower. Front faces +z.
 */
export function buildCampus(): BrickSet {
  const s = new BrickSet();

  s.brick(18, 12, PLATE_H, P.stone, -9, 0, -13, { studs: false }).solid(-9, -13, 9, -1);
  s.brick(14, 8, 6.0, P.interior, -7, PLATE_H, -11, { studs: false, cast: false });

  const wall = { baseY: PLATE_H, rows: 5, color: (r: number) => (r === 4 ? P.westernPurple : P.campusStone) };
  const tall = (x: number) => ({ from: x, to: x + 1, rowFrom: 1, rowTo: 3, kind: 'window' as const });
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -3, from: -8, to: 8,
    openings: [{ from: -1, to: 1, rowFrom: 0, rowTo: 2, kind: 'door' }, ...[-7, -5, -3, 2, 4, 6].map(tall)],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -12, from: -8, to: 8, openings: [-7, -5, -3, 2, 4, 6].map(tall) });
  for (const fixed of [-8, 7]) {
    runningBondWall(s, { ...wall, axis: 'z', fixed, from: -11, to: -3, openings: [-10, -8, -6].map(tall) });
  }
  s.brick(1, 0.34, 3.6, P.brown, -1, PLATE_H, -2.72, { studs: false });
  s.brick(1, 0.34, 3.6, P.brown, 0, PLATE_H, -2.72, { studs: false });

  // Roof
  s.brick(18, 11, PLATE_H, P.campusStone, -9, CAMPUS_ROOF_Y, -13, { studs: false });
  s.brick(16, 9, PLATE_H, P.westernPurple, -8, CAMPUS_ROOF_Y + PLATE_H, -12);
  // Purple parapet carrying the sign
  s.brick(16, 1, 1.6, P.westernPurple, -8, CAMPUS_ROOF_Y + PLATE_H, -3, { studs: false });

  // Clock tower with a stepped purple spire
  for (let i = 0; i < 4; i++) s.brick(4, 4, BRICK_H, P.campusStone, -2, TOWER_BASE_Y + i * BRICK_H, -7, { studs: false });
  const top = TOWER_BASE_Y + 4 * BRICK_H;
  s.brick(4, 4, PLATE_H, P.westernPurple, -2, top, -7, { studs: false });
  s.brick(3, 3, 0.6, P.westernPurple, -1.5, top + PLATE_H, -6.5, { studs: false });
  s.brick(2, 2, 0.6, P.westernPurple, -1, top + PLATE_H + 0.6, -6, { studs: false });
  s.brick(1, 1, 0.6, P.westernPurple, -0.5, top + PLATE_H + 1.2, -5.5, { studs: false });
  s.cylinder(0.08, 1.4, P.gold, 0, top + PLATE_H + 1.8, -5, { segments: 6 });

  // Steps and purple banners
  s.brick(6, 1, 0.2, P.stone, -3, 0, -1, { studs: false, cast: false });
  for (const x of [-5.9, 5.1]) s.brick(0.8, 0.1, 2.2, P.westernPurple, x, 2.2, -1.95, { studs: false, cast: false });

  return s;
}
