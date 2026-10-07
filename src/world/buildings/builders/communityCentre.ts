import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;
const BASE_Y = PLATE_H;
const ROWS = 7;

/**
 * The Community Centre in local coordinates: a two-storey terracotta
 * building with a stepped teal roof, a yellow entrance canopy and a
 * bulletin board out front. Front faces +z; the door is at z = -3.
 */
export function buildCommunityCentre(): BrickSet {
  const s = new BrickSet();

  s.brick(20, 13, PLATE_H, P.stone, -10, 0, -15, { studs: false }).solid(-10, -15, 10, -2);
  s.brick(14, 9, 8.4, P.interior, -7, BASE_Y, -13, { studs: false, cast: false });

  // Walls: white base and floor band, terracotta elsewhere
  const wall = {
    baseY: BASE_Y,
    rows: ROWS,
    color: (r: number) => (r === 0 || r === 3 ? P.white : P.terracotta),
  };
  const win = (from: number, to: number, floor: 0 | 1) => ({
    from, to, rowFrom: floor ? 4 : 1, rowTo: floor ? 5 : 2, kind: 'window' as const,
  });
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -4, from: -8, to: 8,
    openings: [
      { from: -2, to: 2, rowFrom: 0, rowTo: 2, kind: 'door' },
      win(-7, -4, 0), win(4, 7, 0),
      win(-7, -5, 1), win(-3, -1, 1), win(1, 3, 1), win(5, 7, 1),
    ],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -14, from: -8, to: 8, openings: [win(-6, -2, 1), win(2, 6, 1)] });
  for (const fixed of [-8, 7]) {
    runningBondWall(s, { ...wall, axis: 'z', fixed, from: -13, to: -4, openings: [win(-11, -8, 0), win(-11, -8, 1)] });
  }

  // Glass doors and a yellow canopy on two posts
  const glass = { studs: false, cast: false, finish: 'glass' as const };
  s.brick(2, 0.16, 3.6, P.glass, -2, BASE_Y, -3.58, glass);
  s.brick(2, 0.16, 3.6, P.glass, 0, BASE_Y, -3.58, glass);
  for (const x of [-3, 2]) s.brick(1, 1, 3.6, P.white, x, BASE_Y, -3, { studs: false });
  s.brick(6, 2, PLATE_H, P.yellow, -3, BASE_Y + 3.6, -3);

  // Stepped gable roof, ridge running left to right
  const roofY = BASE_Y + ROWS * BRICK_H;
  s.brick(18, 12, PLATE_H, P.white, -9, roofY, -15, { studs: false });
  // Sign fascia above the front wall
  s.brick(16, 1, 1.6, P.white, -8, roofY + PLATE_H, -4, { studs: false });
  for (let i = 0; i < 6; i++) {
    s.brick(18, 11 - 2 * i, 0.6, P.roofTeal, -9, roofY + PLATE_H + i * 0.6, -14.5 + i, { studs: i === 5 });
  }

  // Planters by the door
  for (const x of [-8, 6]) {
    s.brick(2, 1, 0.8, P.dark, x, 0, -2, { studs: false, solid: true });
    s.stud(P.pink, x + 0.5, 0.9, -1.5).stud(P.yellow, x + 1.5, 0.9, -1.5);
  }

  // Bulletin board with notes, one per club or cause
  s.brick(0.4, 0.4, 2.8, P.brown, 4, 0, 0, { studs: false });
  s.brick(0.4, 0.4, 2.8, P.brown, 6.6, 0, 0, { studs: false });
  s.brick(3, 0.2, 1.6, P.cork, 4, 1.2, 0.1, { studs: false });
  const notes: Array<[string, number, number]> = [
    [P.blush, 4.3, 2.1], [P.noteBlue, 5.1, 1.5], [P.noteYellow, 5.9, 2.2], [P.noteGreen, 6.3, 1.4], [P.white, 4.6, 1.4],
  ];
  notes.forEach(([c, x, y]) => s.brick(0.55, 0.05, 0.55, c, x, y, 0.3, { studs: false, cast: false }));
  s.solid(4, 0, 7, 0.4);

  return s;
}
