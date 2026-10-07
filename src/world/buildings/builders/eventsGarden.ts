import { BRICK_H, BrickSet, PLATE_H } from '../../bricks/BrickSet';
import { PALETTE } from '../../palette';

const P = PALETTE;
const FLOWERS = [P.pink, P.blush, '#FFFFFF'];
const SKIN = ['#EFC7A2', '#C68B59', '#8D5524', '#F1D3B3'];
const OUTFITS = ['#2E4A78', '#C8372D', '#E8B828', '#5DB3A0', '#E86FA5', '#3B3F45', '#7D5BA6'];
const GOWNS = ['#7D5BA6', '#C8372D', '#1F2A44', '#E8B828', '#E86FA5'];
const HAIR = ['#141418', '#5A3A22', '#2A1C15', '#C9A15B', '#8A8A8A'];

/** A two-brick hedge with flowers dotted along the top. */
function hedge(s: BrickSet, w: number, d: number, x: number, z: number) {
  s.brick(w, d, BRICK_H, P.leaf, x, 0, z, { studs: false });
  s.brick(w, d, BRICK_H, P.leaf2, x, BRICK_H, z, { studs: false });
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < d; j++) {
      const n = Math.round(x + i + z + j);
      const color = n % 3 === 0 ? FLOWERS[Math.abs(n) % FLOWERS.length] : P.leaf2;
      s.stud(color, x + i + 0.5, 2 * BRICK_H + 0.1, z + j + 0.5);
    }
  }
  s.solid(x, z, x + w, z + d);
}

/** A seated guest on a chair whose min corner is (x, z), facing +z. */
function seated(s: BrickSet, x: number, z: number, n: number, outfits: string[], seatY = 0.6) {
  s.brick(0.8, 0.6, 0.9, outfits[n % outfits.length], x + 0.1, seatY, z + 0.3, { studs: false });
  s.brick(0.6, 0.6, 0.6, SKIN[n % SKIN.length], x + 0.2, seatY + 0.9, z + 0.3, { studs: false });
  s.brick(0.7, 0.7, 0.2, HAIR[n % HAIR.length], x + 0.15, seatY + 1.5, z + 0.25, { studs: false });
}

/** A standing figure. */
function standing(s: BrickSet, x: number, z: number, body: string, legs: string, hair: string, skirt: boolean) {
  const y0 = 0.22;
  if (skirt) s.brick(1.1, 0.9, 1.5, legs, x - 0.1, y0, z, { studs: false });
  else s.brick(0.9, 0.6, 1.5, legs, x, y0, z + 0.15, { studs: false });
  s.brick(0.9, 0.6, 1.0, body, x, y0 + 1.5, z + 0.15, { studs: false });
  s.brick(0.7, 0.7, 0.7, SKIN[0], x + 0.1, y0 + 2.5, z + 0.1, { studs: false });
  s.brick(0.8, 0.8, 0.25, hair, x + 0.05, y0 + 3.2, z + 0.05, { studs: false });
}

/** West half: the outdoor wedding ceremony. */
function wedding(s: BrickSet) {
  // White aisle runner with petals
  s.brick(2, 13, 0.22, P.white, -7, 0, 3, { studs: false, cast: false });
  const petals: Array<[number, number]> = [[-6.5, 4], [-5.5, 6], [-6.5, 8], [-5.5, 10], [-6.5, 12]];
  petals.forEach(([x, z], i) => s.stud(i % 2 ? P.pink : P.blush, x, 0.32, z));

  // Chairs either side of the aisle, most of them filled
  let n = 0;
  for (const z of [5, 7, 9, 11]) {
    for (const x of [-10, -9, -4, -3]) {
      s.brick(1, 1, 0.6, P.white, x, 0, z, { studs: false });
      s.brick(1, 0.3, 0.9, P.white, x, 0.6, z, { studs: false });
      if ((x * 7 + z * 3) % 4 !== 0) seated(s, x, z, n++, OUTFITS);
    }
  }
  s.solid(-10, 5, -8, 12).solid(-4, 5, -2, 12);

  // The couple under the arch
  standing(s, -7.2, 13.4, '#FFFFFF', '#FFFFFF', '#5A3A22', true);
  standing(s, -5.7, 13.4, '#1E1E24', '#1E1E24', '#141418', false);
  s.cylinder(0.35, 0.2, P.pink, -6.75, 3.67, 13.85, { segments: 12 }); // flower crown
  s.solid(-7.4, 13.3, -4.6, 14.4);

  // Flower arch
  for (const x of [-9, -4]) {
    for (let i = 0; i < 5; i++) s.brick(1, 1, BRICK_H, P.white, x, i * BRICK_H, 15, { studs: false });
    s.solid(x, 15, x + 1, 16);
  }
  s.brick(6, 1, BRICK_H, P.white, -9, 6, 15, { studs: false });
  s.brick(4, 1, BRICK_H, P.white, -8, 7.2, 15, { studs: false });
  s.brick(2, 1, BRICK_H, P.white, -7, 8.4, 15, { studs: false });
  const blooms: Array<[number, number, number]> = [
    [-8.5, 7.2, 15.5], [-3.5, 7.2, 15.5], [-7.5, 8.4, 15.5], [-4.5, 8.4, 15.5],
    [-6.5, 9.6, 15.5], [-5.5, 9.6, 15.5],
    [-9.45, 1.4, 15.5], [-9.45, 3.4, 15.5], [-9.45, 5.2, 15.5],
    [-2.55, 2.2, 15.5], [-2.55, 4.2, 15.5], [-2.55, 6.0, 15.5],
  ];
  blooms.forEach(([x, y, z], i) =>
    s.cylinder(0.42, PLATE_H, FLOWERS[i % FLOWERS.length], x, y, z, { segments: 14, stud: true }),
  );
}

/** East half: the gala, with a stage, red carpet and round dinner tables. */
function gala(s: BrickSet) {
  // Red carpet up to the stage
  s.brick(2, 10, 0.22, P.red, 5, 0, 4, { studs: false, cast: false });

  // Stage, backdrop with gold trim, podium and spotlights
  s.brick(8, 4, 0.8, P.interior, 2, 0, 14, { studs: false }).solid(2, 14, 10, 18);
  s.brick(8, 1, 3.6, P.navy, 2, 0.8, 17, { studs: false });
  s.brick(8, 1, PLATE_H, P.gold, 2, 4.4, 17);
  s.brick(1, 1, 1.4, P.brown, 5.5, 0.8, 15, { studs: false });
  s.cylinder(0.05, 0.5, P.dark, 6, 2.2, 15.3, { segments: 6 });
  for (const x of [2.5, 9.5]) s.cylinder(0.3, PLATE_H, P.yellow, x, 4.8, 17.5, { segments: 14, finish: 'glow' });

  // Round tables: white cloth, gold centrepiece with a candle, gold chairs, some guests
  let n = 0;
  const tables: Array<[number, number]> = [[3.2, 6], [3.2, 10.5], [9, 6], [9, 10.5]];
  for (const [cx, cz] of tables) {
    s.cylinder(1.0, 1.0, '#FFFFFF', cx, 0, cz, { segments: 24 });
    s.cylinder(0.25, 0.6, P.gold, cx, 1.0, cz, { segments: 12 });
    s.cylinder(0.08, 0.3, P.yellow, cx, 1.6, cz, { segments: 8, finish: 'glow' });
    const seats: Array<[number, number]> = [[cx - 1.6, cz], [cx + 1.6, cz], [cx, cz - 1.6], [cx, cz + 1.6]];
    seats.forEach(([sx, sz], i) => {
      s.brick(0.8, 0.8, 0.6, P.gold, sx - 0.4, 0, sz - 0.4, { studs: false });
      if ((i + n) % 2 === 0) seated(s, sx - 0.5, sz - 0.6, n, GOWNS);
      n++;
    });
    s.solid(cx - 1.9, cz - 1.9, cx + 1.9, cz + 1.9);
  }
}

/**
 * The Events Garden in local coordinates: one hedged lawn holding a wedding
 * ceremony (west) and a gala (east). The entrance is the gap in the north
 * hedge (z = 0), with a stone path down the middle.
 */
export function buildEventsGarden(): BrickSet {
  const s = new BrickSet();

  hedge(s, 1, 19, -12, 0);
  hedge(s, 1, 19, 11, 0);
  hedge(s, 22, 1, -11, 18);
  hedge(s, 9, 1, -11, 0);
  hedge(s, 9, 1, 2, 0);

  for (const x of [-3, 2]) {
    for (let i = 0; i < 2; i++) s.brick(1, 1, BRICK_H, P.dark, x, i * BRICK_H, -2, { studs: false });
    s.brick(1, 1, BRICK_H, P.yellow, x, 2 * BRICK_H, -2, { finish: 'glow' });
    s.solid(x, -2, x + 1, -1);
  }

  s.brick(2, 17, 0.22, P.path, -1, 0, 1, { studs: false, cast: false });

  // Entrance arch with a sign board
  for (const x of [-2.6, 2.0]) s.brick(0.6, 0.6, 4.8, P.white, x, 0, -0.8, { studs: false });
  s.brick(6, 0.4, 1.4, P.white, -3, 4.8, -0.8, { studs: false });
  s.brick(6, 0.6, 0.3, P.gold, -3, 6.2, -0.9, { studs: false });

  wedding(s);
  gala(s);
  return s;
}
