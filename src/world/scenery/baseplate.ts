import { BrickSet, PLATE_H } from '../bricks/BrickSet';
import { PALETTE } from '../palette';
import { ROAD_TILES } from '../../data/roads';
import { BEACH, GRASS_HALF } from '../land';

/** How far the sea reaches in every direction from the centre. */
export const SEA_SIZE = 460;

/** The island (studded grass on a smooth sand beach, in a calm sea) and the streets. */
export function buildBaseplate(): BrickSet {
  const set = new BrickSet();
  const g = GRASS_HALF;
  const s = GRASS_HALF + BEACH;
  set.brick(SEA_SIZE, SEA_SIZE, 0.3, PALETTE.sea, -SEA_SIZE / 2, -PLATE_H - 0.25, -SEA_SIZE / 2, { studs: false, cast: false });
  set.brick(s * 2, s * 2, PLATE_H - 0.08, PALETTE.sand, -s, -PLATE_H, -s, { studs: false, cast: false });
  set.brick(g * 2, g * 2, PLATE_H, PALETTE.grass, -g, -PLATE_H, -g, { cast: false });
  // Streets are smooth tiles laid over the studs.
  for (const t of ROAD_TILES) set.brick(t.w, t.d, 0.22, PALETTE.path, t.x, 0, t.z, { studs: false, cast: false });
  return set;
}
