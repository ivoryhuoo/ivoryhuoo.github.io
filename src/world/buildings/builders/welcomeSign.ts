import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { PALETTE } from '../../palette';

const P = PALETTE;

/** A roadside welcome sign on two posts above a flower bed. Front faces +z. */
export function buildWelcomeSign(): BrickSet {
  const s = new BrickSet();

  // Flower bed
  s.brick(10, 2, PLATE_H, P.leaf2, -5, 0, 1, { studs: false });
  const flowers = [P.pink, P.yellow, '#FFFFFF', P.red];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 2; j++) {
      const c = (i + j) % 2 === 0 ? flowers[(i + j * 3) % flowers.length] : P.leaf;
      s.stud(c, -5 + i + 0.5, PLATE_H + 0.1, 1 + j + 0.5);
    }
  }

  // Posts, board and gold frame
  s.brick(1, 0.5, 4 * BRICK_H, P.white, -4, 0, -0.25, { studs: false });
  s.brick(1, 0.5, 4 * BRICK_H, P.white, 3, 0, -0.25, { studs: false });
  s.brick(10, 0.5, 2.8, P.signPink, -5, 1.6, 0.25, { studs: false });
  s.brick(10, 1, PLATE_H, P.gold, -5, 4.4, 0);
  s.brick(10, 1, PLATE_H, P.gold, -5, 1.2, 0, { studs: false });

  s.solid(-5, 0, 5, 3);
  return s;
}
