import type { Building, Rect } from './buildings';

/** Y rotation for a building's model. */
export const rotationOf = (b: Building): number => (b.facing === 'north' ? Math.PI : 0);

/** A point in a building's local coordinates, on the baseplate. */
export function toWorld(b: Building, x: number, z: number): { x: number; z: number } {
  return b.facing === 'north'
    ? { x: b.origin.x - x, z: b.origin.z - z }
    : { x: b.origin.x + x, z: b.origin.z + z };
}

/** A local rectangle, on the baseplate. */
export function rectToWorld(b: Building, r: Rect): Rect {
  const a = toWorld(b, r.minX, r.minZ);
  const c = toWorld(b, r.maxX, r.maxZ);
  return {
    minX: Math.min(a.x, c.x),
    minZ: Math.min(a.z, c.z),
    maxX: Math.max(a.x, c.x),
    maxZ: Math.max(a.z, c.z),
  };
}

export const entranceOf = (b: Building) => toWorld(b, b.entrance.x, b.entrance.z);
