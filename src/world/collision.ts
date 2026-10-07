import type { Collider } from './bricks/BrickSet';
import { walkable } from './land';

export function isBlocked(x: number, z: number, radius: number, colliders: Collider[]): boolean {
  // The island's shore is the edge of the world.
  if (!walkable(x, z)) return true;
  for (const c of colliders) {
    if (x > c.minX - radius && x < c.maxX + radius && z > c.minZ - radius && z < c.maxZ + radius) {
      return true;
    }
  }
  return false;
}
