// A BrickSet is a building described as plain data: a list of bricks, round
// bricks, studs and collision boxes. Builders are pure functions that return
// a BrickSet, and <BrickModel> renders any set. Units are studs: one stud is
// 1 unit wide, a brick is 1.2 tall and a plate is 0.4 tall.

export const BRICK_H = 1.2;
export const PLATE_H = 0.4;
export const STUD_H = 0.2;

export type Finish = 'plastic' | 'glass' | 'glow' | 'metal';

export interface BoxPiece {
  w: number;
  d: number;
  h: number;
  x: number;
  y: number;
  z: number;
  color: string;
  cast: boolean;
  finish: Finish;
}

export interface CylinderPiece {
  r: number;
  h: number;
  x: number;
  y: number;
  z: number;
  color: string;
  cast: boolean;
  segments: number;
  finish: Finish;
}

export interface Stud {
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface Collider {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}

export interface BrickOptions {
  studs?: boolean;
  cast?: boolean;
  solid?: boolean;
  finish?: Finish;
}

export interface CylinderOptions {
  segments?: number;
  cast?: boolean;
  finish?: Finish;
  stud?: boolean;
}

export class BrickSet {
  readonly boxes: BoxPiece[] = [];
  readonly cylinders: CylinderPiece[] = [];
  readonly studs: Stud[] = [];
  readonly colliders: Collider[] = [];

  /** Rectangular brick. (x, z) is the min corner, y is the bottom. */
  brick(
    w: number,
    d: number,
    h: number,
    color: string,
    x: number,
    y: number,
    z: number,
    o: BrickOptions = {},
  ): this {
    this.boxes.push({ w, d, h, x, y, z, color, cast: o.cast ?? true, finish: o.finish ?? 'plastic' });
    if (o.studs ?? true) {
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < d; j++) this.stud(color, x + i + 0.5, y + h + STUD_H / 2, z + j + 0.5);
      }
    }
    if (o.solid) this.solid(x, z, x + w, z + d);
    return this;
  }

  /** Round brick. (x, z) is the centre, y is the bottom. */
  cylinder(r: number, h: number, color: string, x: number, y: number, z: number, o: CylinderOptions = {}): this {
    this.cylinders.push({
      r,
      h,
      x,
      y,
      z,
      color,
      cast: o.cast ?? true,
      segments: o.segments ?? 32,
      finish: o.finish ?? 'plastic',
    });
    if (o.stud) this.stud(color, x, y + h + STUD_H / 2, z);
    return this;
  }

  stud(color: string, x: number, y: number, z: number): this {
    this.studs.push({ x, y, z, color });
    return this;
  }

  /** Height of the tallest piece, e.g. for placing a label above the building. */
  top(): number {
    let t = 0;
    for (const b of this.boxes) t = Math.max(t, b.y + b.h);
    for (const c of this.cylinders) t = Math.max(t, c.y + c.h);
    return t;
  }

  /** Mark a rectangle of ground the player can't walk through. */
  solid(minX: number, minZ: number, maxX: number, maxZ: number): this {
    this.colliders.push({ minX, minZ, maxX, maxZ });
    return this;
  }

  /**
   * This set's colliders moved to a position on the baseplate. A building
   * turned to face north is rotated 180°, which flips both axes.
   */
  collidersAt(ox: number, oz: number, turned = false): Collider[] {
    return this.colliders.map((c) =>
      turned
        ? { minX: ox - c.maxX, minZ: oz - c.maxZ, maxX: ox - c.minX, maxZ: oz - c.minZ }
        : { minX: c.minX + ox, minZ: c.minZ + oz, maxX: c.maxX + ox, maxZ: c.maxZ + oz },
    );
  }
}
