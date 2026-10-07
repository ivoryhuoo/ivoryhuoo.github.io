import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;
const DOME_Z = -9.5;

/**
 * City Hall in local coordinates: centred on x = 0, front steps facing +z,
 * doorway at z = -1.
 */
export function buildCityHall(): BrickSet {
  const s = new BrickSet();

  // Platform and front steps
  s.brick(20, 12, 0.8, P.stone, -10, 0, -15, { studs: false });
  s.brick(12, 2, PLATE_H, P.stone, -6, 0, -3, { studs: false });
  s.brick(12, 1, PLATE_H, P.stone, -6, PLATE_H, -3, { studs: false });
  s.solid(-10, -15, 10, -3).solid(-6, -3, 6, -1);

  // Dark interior so the windows read as rooms, not holes
  s.brick(14, 6, 7.2, P.interior, -7, 0.8, -13, { studs: false, cast: false });

  // Walls: tan base course, white above
  const wall = { baseY: 0.8, rows: 6, color: (r: number) => (r === 0 ? P.tan : P.white) };
  const win = (from: number, to: number) => ({ from, to, rowFrom: 2, rowTo: 3, kind: 'window' as const });
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -7, from: -8, to: 8,
    openings: [{ from: -2, to: 2, rowFrom: 0, rowTo: 2, kind: 'door' }, win(-6, -4), win(4, 6)],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -14, from: -8, to: 8, openings: [win(-6, -4), win(-1, 1), win(4, 6)] });
  runningBondWall(s, { ...wall, axis: 'z', fixed: -8, from: -13, to: -7, openings: [win(-11, -9)] });
  runningBondWall(s, { ...wall, axis: 'z', fixed: 7, from: -13, to: -7, openings: [win(-11, -9)] });

  // Double doors
  s.brick(2, 0.34, 3.6, P.brown, -2, 0.8, -6.72, { studs: false });
  s.brick(2, 0.34, 3.6, P.brown, 0, 0.8, -6.72, { studs: false });
  s.cylinder(0.1, 0.3, P.gold, -0.3, 2.3, -6.32, { segments: 10 });
  s.cylinder(0.1, 0.3, P.gold, 0.3, 2.3, -6.32, { segments: 10 });

  // Portico columns
  for (const x of [-6.5, -4.5, -2.5, 2.5, 4.5, 6.5]) {
    s.brick(1, 1, PLATE_H, P.tan, x - 0.5, 0.8, -5, { studs: false });
    for (let i = 0; i < 5; i++) s.cylinder(0.4, BRICK_H, P.white, x, 1.2 + i * BRICK_H, -4.5, { segments: 20 });
    s.brick(1, 1, 0.8, P.tan, x - 0.5, 7.2, -5, { studs: false });
  }

  // Roof slab, studded red roof plate and stepped pediment
  s.brick(18, 12, 0.8, P.white, -9, 8, -15, { studs: false });
  s.brick(18, 11, PLATE_H, P.red, -9, 8.8, -15);
  const pediment: Array<[number, number]> = [[18, -9], [14, -7], [10, -5], [6, -3], [2, -1]];
  pediment.forEach(([w, x], i) => s.brick(w, 1, BRICK_H, i % 2 ? P.tan : P.white, x, 8.8 + i * BRICK_H, -4));

  // Dome
  s.cylinder(3.2, BRICK_H, P.white, 0, 9.2, DOME_Z);
  s.cylinder(3.45, PLATE_H, P.tan, 0, 10.4, DOME_Z);
  const dome: Array<[number, number]> = [[3.0, 10.8], [2.6, 11.6], [2.0, 12.4], [1.2, 13.2]];
  dome.forEach(([r, y]) => s.cylinder(r, 0.8, P.teal, 0, y, DOME_Z));
  s.cylinder(0.5, 0.6, P.gold, 0, 14.0, DOME_Z, { segments: 20 });
  s.cylinder(0.07, 4.2, P.dark, 0, 14.6, DOME_Z, { segments: 10 });

  // Hedges either side of the steps
  s.brick(2, 1, BRICK_H, P.leaf, -9, 0, -2, { solid: true });
  s.brick(2, 1, BRICK_H, P.leaf, 7, 0, -2, { solid: true });

  return s;
}
