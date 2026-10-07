import { BRICK_H, type BrickSet, type Finish } from './BrickSet';
import { PALETTE } from '../palette';

export interface Opening {
  from: number;
  to: number;
  rowFrom: number;
  rowTo: number;
  kind: 'window' | 'door';
}

export interface WallSpec {
  /** 'x' runs left-right, 'z' runs front-back. */
  axis: 'x' | 'z';
  /** The wall's position on the other axis (its min corner). */
  fixed: number;
  from: number;
  to: number;
  baseY: number;
  rows: number;
  color: (row: number) => string;
  /** Optional finish per row, e.g. a glowing neon band. */
  finish?: (row: number) => Finish;
  openings?: Opening[];
}

/**
 * Lays a one-stud-thick wall in running bond (each row offset by half a
 * brick, like a real brick wall), leaving gaps for doors and glazed windows.
 */
export function runningBondWall(set: BrickSet, spec: WallSpec): void {
  const { axis, fixed, from, to, baseY, rows, color, finish, openings = [] } = spec;

  for (let r = 0; r < rows; r++) {
    const y = baseY + r * BRICK_H;
    const c = color(r);
    const f = finish ? finish(r) : 'plastic';
    const isOpen = (p: number) =>
      openings.some((o) => p >= o.from && p < o.to && r >= o.rowFrom && r <= o.rowTo);

    let p = from;
    let first = true;
    while (p < to) {
      if (isOpen(p)) {
        p++;
        first = true;
        continue;
      }
      const max = first && r % 2 === 1 ? 2 : 4;
      let len = 0;
      while (len < max && p + len < to && !isOpen(p + len)) len++;
      if (axis === 'x') set.brick(len, 1, BRICK_H, c, p, y, fixed, { studs: false, finish: f });
      else set.brick(1, len, BRICK_H, c, fixed, y, p, { studs: false, finish: f });
      p += len;
      first = false;
    }
  }

  for (const o of openings) {
    if (o.kind !== 'window') continue;
    const len = o.to - o.from;
    const h = (o.rowTo - o.rowFrom + 1) * BRICK_H;
    const y = baseY + o.rowFrom * BRICK_H;
    const glass = { studs: false, cast: false, finish: 'glass' as const };
    if (axis === 'x') set.brick(len, 0.16, h, PALETTE.glass, o.from, y, fixed + 0.42, glass);
    else set.brick(0.16, len, h, PALETTE.glass, fixed + 0.42, y, o.from, glass);
  }
}
