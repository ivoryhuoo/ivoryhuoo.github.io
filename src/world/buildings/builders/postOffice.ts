import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;

/**
 * The Post Office in local coordinates: red brick with white trim, a stepped
 * roof, and a red mailbox out front. Front faces +z (turned to face the
 * street when placed).
 */
export function buildPostOffice(): BrickSet {
  const s = new BrickSet();

  s.brick(14, 10, PLATE_H, P.stone, -7, 0, -11, { studs: false }).solid(-7, -11, 7, -1);
  s.brick(10, 6, 4.8, P.interior, -5, PLATE_H, -9, { studs: false, cast: false });

  const wall = { baseY: PLATE_H, rows: 4, color: (r: number) => (r === 0 || r === 3 ? P.white : P.postRed) };
  const win = (from: number, to: number) => ({ from, to, rowFrom: 1, rowTo: 2, kind: 'window' as const });
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -3, from: -6, to: 6,
    openings: [{ from: -1, to: 1, rowFrom: 0, rowTo: 2, kind: 'door' }, win(-5, -3), win(3, 5)],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -10, from: -6, to: 6, openings: [win(-4, -1), win(1, 4)] });
  runningBondWall(s, { ...wall, axis: 'z', fixed: -6, from: -9, to: -3, openings: [win(-7, -5)] });
  runningBondWall(s, { ...wall, axis: 'z', fixed: 5, from: -9, to: -3, openings: [win(-7, -5)] });
  s.brick(1, 0.34, 3.6, P.brown, -1, PLATE_H, -2.72, { studs: false });
  s.brick(1, 0.34, 3.6, P.brown, 0, PLATE_H, -2.72, { studs: false });

  // Stepped roof, ridge running left to right
  const roofY = PLATE_H + 4 * BRICK_H;
  s.brick(14, 9, PLATE_H, P.white, -7, roofY, -11, { studs: false });
  // Sign fascia above the front wall
  s.brick(12, 1, 1.6, P.white, -6, roofY + PLATE_H, -3, { studs: false });
  for (let i = 0; i < 4; i++) {
    s.brick(14, 8 - 2 * i, 0.6, P.dark, -7, roofY + PLATE_H + i * 0.6, -10.5 + i, { studs: i === 3 });
  }

  // Mailbox
  s.brick(1, 1, 0.6, P.dark, 3, 0, 0, { studs: false });
  s.brick(1, 1, 1.4, P.red, 3, 0.6, 0, { studs: false });
  s.brick(1, 1, 0.2, P.red, 3, 2.0, 0);
  s.brick(0.6, 0.05, 0.12, P.dark, 3.2, 1.6, 1.0, { studs: false, cast: false });
  s.solid(3, 0, 4, 1);

  // Flagpole
  s.cylinder(0.07, 6, P.steel, -5.5, 0, 0.5, { segments: 8 });

  return s;
}
