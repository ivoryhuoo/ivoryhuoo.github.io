import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { PALETTE } from '../../palette';

const P = PALETTE;

/** Where the crane tower stands, and the height its rotating jib sits at. */
export const CRANE = { x: 5.5, z: -11.5, top: 0.2 + 12 * BRICK_H };

/**
 * The Construction Site in local coordinates: a fenced dirt lot with a
 * half-built building, brick piles, cones and a crane tower (the rotating
 * jib is in the extras). The gate is at the front, z = -1.
 */
export function buildConstruction(): BrickSet {
  const s = new BrickSet();
  const fence = { studs: false, cast: false, finish: 'glass' as const };

  // Dirt lot
  s.brick(18, 15, 0.2, P.dirt, -9, 0, -16, { studs: false, cast: false });

  // Chain-link fence with a gate gap at the front
  s.brick(7, 0.2, 1.8, P.steel, -9, 0, -1.2, fence).solid(-9, -1.2, -2, -1);
  s.brick(7, 0.2, 1.8, P.steel, 2, 0, -1.2, fence).solid(2, -1.2, 9, -1);
  s.brick(18, 0.2, 1.8, P.steel, -9, 0, -16, fence).solid(-9, -16, 9, -15.8);
  s.brick(0.2, 15, 1.8, P.steel, -9, 0, -16, fence).solid(-9, -16, -8.8, -1);
  s.brick(0.2, 15, 1.8, P.steel, 8.8, 0, -16, fence).solid(8.8, -16, 9, -1);
  for (const [x, z] of [[-9, -1.2], [-2.2, -1.2], [2, -1.2], [8.8, -1.2], [-9, -16], [8.8, -16], [-9, -8.5], [8.8, -8.5]]) {
    s.brick(0.3, 0.3, 2.0, P.dark, x, 0, z, { studs: false });
  }

  // Half-built building: slab, columns, one finished wall, beams
  s.brick(10, 7, PLATE_H, P.concrete, -7, 0.2, -14, { studs: false }).solid(-7, -14, 3, -7);
  const base = 0.2 + PLATE_H;
  for (const [x, z] of [[-7, -14], [2, -14], [-7, -8], [2, -8]]) {
    for (let i = 0; i < 4; i++) s.brick(1, 1, BRICK_H, P.concrete, x, base + i * BRICK_H, z, { studs: false });
  }
  for (let i = 0; i < 2; i++) s.brick(8, 1, BRICK_H, P.terracotta, -6, base + i * BRICK_H, -14, { studs: false });
  s.brick(10, 1, PLATE_H, P.steel, -7, base + 4 * BRICK_H, -14, { studs: false });
  s.brick(10, 1, PLATE_H, P.steel, -7, base + 4 * BRICK_H, -8, { studs: false });
  s.brick(5, 7, PLATE_H, P.concrete, -7, base + 4 * BRICK_H + PLATE_H, -14);

  // Crane tower
  for (let i = 0; i < 12; i++) s.brick(1, 1, BRICK_H, P.yellow, CRANE.x - 0.5, 0.2 + i * BRICK_H, CRANE.z - 0.5, { studs: false });
  s.solid(CRANE.x - 0.5, CRANE.z - 0.5, CRANE.x + 0.5, CRANE.z + 0.5);

  // Brick piles waiting to be used
  const piles: Array<[number, number, string]> = [[4, -5, P.red], [6, -4, P.accentBlue], [-6, -4, P.yellow]];
  for (const [x, z, c] of piles) {
    for (let i = 0; i < 3; i++) s.brick(2, 1, BRICK_H, c, x - (i % 2) * 0.5, 0.2 + i * BRICK_H, z, { studs: i === 2 });
    s.solid(x - 0.5, z, x + 2, z + 1);
  }

  // Cones at the gate
  for (const x of [-3, 3]) {
    s.cylinder(0.32, 0.8, P.cone, x, 0, -0.3, { segments: 12 });
    s.cylinder(0.22, 0.12, P.white, x, 0.45, -0.3, { segments: 12 });
  }

  // Warning sign board on the fence
  s.brick(6.6, 0.2, 1.8, P.yellow, -8.8, 0.3, -1.0, { studs: false });

  return s;
}
