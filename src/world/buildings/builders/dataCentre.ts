import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { runningBondWall } from '../../bricks/wall';
import { PALETTE } from '../../palette';

const P = PALETTE;

/**
 * The Data Centre in local coordinates: a low concrete building with a glass
 * front, rows of server racks with blinking lights, and rooftop cooling.
 * Front faces +z; the door is at z = -2.
 */
export function buildDataCentre(): BrickSet {
  const s = new BrickSet();

  // Concrete pad and dark floor
  s.brick(16, 12, PLATE_H, P.stone, -8, 0, -13, { studs: false }).solid(-8, -13, 8, -1);
  s.brick(12, 8, 0.1, P.interior, -6, PLATE_H, -11, { studs: false, cast: false });

  // Walls: dark base, concrete body, blue accent band on top
  const wall = {
    baseY: PLATE_H,
    rows: 5,
    color: (r: number) => (r === 0 ? P.concreteDark : r === 4 ? P.accentBlue : P.concrete),
  };
  const win = (from: number, to: number) => ({ from, to, rowFrom: 1, rowTo: 2, kind: 'window' as const });
  runningBondWall(s, {
    ...wall, axis: 'x', fixed: -3, from: -7, to: 7,
    openings: [{ from: -1, to: 1, rowFrom: 0, rowTo: 2, kind: 'door' }, win(-6, -2), win(2, 6)],
  });
  runningBondWall(s, { ...wall, axis: 'x', fixed: -12, from: -7, to: 7 });
  runningBondWall(s, { ...wall, axis: 'z', fixed: -7, from: -11, to: -3, openings: [win(-9, -5)] });
  runningBondWall(s, { ...wall, axis: 'z', fixed: 6, from: -11, to: -3, openings: [win(-9, -5)] });

  // Glass sliding doors
  const glass = { studs: false, cast: false, finish: 'glass' as const };
  s.brick(1, 0.16, 3.6, P.glass, -1, PLATE_H, -2.58, glass);
  s.brick(1, 0.16, 3.6, P.glass, 0, PLATE_H, -2.58, glass);

  // Server racks, two rows, each with a column of status lights on the front
  for (const z of [-6, -9]) {
    for (const x of [-6, -5, -4, -3, 2, 3, 4, 5]) {
      s.brick(1, 1, 3 * BRICK_H, P.rack, x, PLATE_H, z, { studs: false });
      for (let k = 0; k < 5; k++) {
        const led = (x + k) % 2 === 0 ? P.ledBlue : P.ledGreen;
        s.brick(0.5, 0.1, 0.14, led, x + 0.25, 0.9 + k * 0.6, z + 1, { studs: false, cast: false, finish: 'glow' });
      }
    }
  }

  // Roof with cooling units and an antenna
  const roofY = PLATE_H + 5 * BRICK_H;
  s.brick(16, 11, PLATE_H, P.roofGrey, -8, roofY, -13);
  // Sign fascia along the front of the roof
  s.brick(14, 1, 2.0, P.concreteDark, -7, roofY + PLATE_H, -3, { studs: false });
  for (const x of [-6, -1]) {
    s.brick(3, 3, BRICK_H, P.steel, x, roofY + PLATE_H, -11, { studs: false });
    s.cylinder(1.1, 0.2, P.dark, x + 1.5, roofY + PLATE_H + BRICK_H, -9.5, { segments: 20 });
  }
  s.cylinder(0.08, 5, P.dark, 5, roofY + PLATE_H, -10, { segments: 8 });
  s.cylinder(0.2, 0.3, P.beacon, 5, roofY + PLATE_H + 5, -10, { segments: 12, finish: 'glow' });

  // Cooling pipes up the east wall, backup generator on the west side
  for (const z of [-10, -8, -6]) s.cylinder(0.3, 5.6, P.steel, 7.5, PLATE_H, z, { segments: 12 });
  s.brick(2, 3, 1.8, P.yellow, -10, 0, -9, { studs: false, solid: true });
  s.brick(2, 3, PLATE_H, P.dark, -10, 1.8, -9);

  return s;
}
