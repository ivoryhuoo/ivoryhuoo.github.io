import { BRICK_H, BrickSet, PLATE_H } from '../bricks/BrickSet';
import { PALETTE } from '../palette';
import { BUILDINGS } from '../../data/buildings';
import { rectToWorld } from '../../data/placement';
import { ROAD_EDGES, ROAD_NODES, ROAD_TILES, RUNWAY } from '../../data/roads';
import { GRASS_HALF, onGrass as onLand } from '../land';


type R = [number, number, number, number];

/** Streets, the runway and every building plot (with a margin) stay clear of scenery. */
const RESERVED: R[] = [
  ...ROAD_TILES.map((t): R => [t.x - 1, t.z - 1, t.x + t.w + 1, t.z + t.d + 1]),
  [RUNWAY.x - 1, RUNWAY.z - 1, RUNWAY.x + RUNWAY.w + 1, RUNWAY.z + RUNWAY.d + 1],
  ...BUILDINGS.filter((b) => b.status === 'open').map((b): R => {
    const r = rectToWorld(b, b.footprint);
    return [r.minX - 2, r.minZ - 2, r.maxX + 2, r.maxZ + 2];
  }),
];

const overlaps = (x0: number, z0: number, x1: number, z1: number) =>
  RESERVED.some(([a, b, c, d]) => x0 < c && x1 > a && z0 < d && z1 > b);

/** Is the whole rectangle on grass (not sand, not sea)? */
const onGrass = (x0: number, z0: number, x1: number, z1: number) =>
  onLand(x0, z0) && onLand(x1, z0) && onLand(x0, z1) && onLand(x1, z1);

/** Claims a spot if it's free grass; returns whether it did. */
function claim(x0: number, z0: number, x1: number, z1: number): boolean {
  if (!onGrass(x0, z0, x1, z1) || overlaps(x0, z0, x1, z1)) return false;
  RESERVED.push([x0, z0, x1, z1]);
  return true;
}

// ---------------------------------------------------------------- props

function tree(set: BrickSet, x: number, z: number) {
  for (let i = 0; i < 3; i++) set.brick(1, 1, BRICK_H, PALETTE.brown, x, i * BRICK_H, z, { studs: false });
  set.brick(3, 3, BRICK_H, PALETTE.leaf, x - 1, 3 * BRICK_H, z - 1);
  set.brick(3, 3, BRICK_H, PALETTE.leaf2, x - 1, 4 * BRICK_H, z - 1);
  set.brick(1, 1, BRICK_H, PALETTE.leaf, x, 5 * BRICK_H, z);
  set.solid(x - 0.2, z - 0.2, x + 1.2, z + 1.2);
}

/** A round pink blossom tree, for a little colour among the green ones. */
function blossom(set: BrickSet, x: number, z: number) {
  for (let i = 0; i < 3; i++) set.brick(1, 1, BRICK_H, PALETTE.brown, x, i * BRICK_H, z, { studs: false });
  set.brick(3, 3, BRICK_H, PALETTE.blush, x - 1, 3 * BRICK_H, z - 1);
  set.brick(3, 3, BRICK_H, PALETTE.pink, x - 1, 4 * BRICK_H, z - 1);
  set.brick(1, 1, BRICK_H, PALETTE.blush, x, 5 * BRICK_H, z);
  set.solid(x - 0.2, z - 0.2, x + 1.2, z + 1.2);
}

export function lamp(set: BrickSet, x: number, z: number) {
  for (let i = 0; i < 3; i++) set.brick(1, 1, BRICK_H, PALETTE.dark, x, i * BRICK_H, z, { studs: false });
  set.brick(1, 1, BRICK_H, PALETTE.yellow, x, 3 * BRICK_H, z, { finish: 'glow' });
  set.solid(x, z, x + 1, z + 1);
}

/** A park bench, 3 studs long, running along x (or z when `alongZ`). */
function bench(set: BrickSet, x: number, z: number, alongZ = false) {
  const w = alongZ ? 1 : 3;
  const d = alongZ ? 3 : 1;
  set.brick(alongZ ? 1 : 0.4, alongZ ? 0.4 : 1, 0.6, PALETTE.dark, x, 0, z, { studs: false });
  set.brick(alongZ ? 1 : 0.4, alongZ ? 0.4 : 1, 0.6, PALETTE.dark, alongZ ? x : x + 2.6, 0, alongZ ? z + 2.6 : z, { studs: false });
  set.brick(w, d, 0.25, PALETTE.brown, x, 0.6, z, { studs: false });
  // backrest
  if (alongZ) set.brick(0.25, 3, 0.7, PALETTE.brown, x, 0.85, z, { studs: false });
  else set.brick(3, 0.25, 0.7, PALETTE.brown, x, 0.85, z, { studs: false });
  set.solid(x, z, x + w, z + d);
}

function hydrant(set: BrickSet, x: number, z: number) {
  set.cylinder(0.32, 0.9, PALETTE.red, x + 0.5, 0, z + 0.5, { segments: 10 });
  set.cylinder(0.22, 0.25, PALETTE.yellow, x + 0.5, 0.9, z + 0.5, { segments: 10 });
  set.brick(0.9, 0.24, 0.24, PALETTE.red, x + 0.05, 0.45, z + 0.38, { studs: false });
  set.solid(x + 0.1, z + 0.1, x + 0.9, z + 0.9);
}

/** A brick planter box full of flowers. */
function planter(set: BrickSet, x: number, z: number) {
  set.brick(2, 2, BRICK_H * 0.8, PALETTE.brown, x, 0, z, { studs: false });
  set.brick(2, 2, PLATE_H, PALETTE.leaf2, x, BRICK_H * 0.8, z, { studs: false });
  const petals = [PALETTE.pink, PALETTE.yellow, '#FFFFFF', PALETTE.blush];
  [[0.5, 0.5], [1.5, 0.5], [0.5, 1.5], [1.5, 1.5]].forEach(([dx, dz], i) =>
    set.stud(petals[i], x + dx, BRICK_H * 0.8 + PLATE_H + 0.1, z + dz),
  );
  set.solid(x, z, x + 2, z + 2);
}

/** A red-and-white picnic blanket with a basket. */
function picnic(set: BrickSet, x: number, z: number) {
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      // thick enough to cover the studs underneath, so the checks stay crisp
      set.brick(1, 1, 0.3, (i + j) % 2 ? '#FFFFFF' : PALETTE.red, x + i, 0, z + j, { studs: false, cast: false });
  set.brick(1.2, 0.8, 0.6, PALETTE.tan, x + 2.6, 0.3, z + 0.4, { studs: false });
  set.brick(1.2, 0.15, 0.5, PALETTE.brown, x + 2.6, 0.9, z + 0.72, { studs: false });
}

/** A round lake with lily pads, a pebble shore, a wooden dock and a rowboat. */
function lake(set: BrickSet, cx: number, cz: number, r: number) {
  for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) {
    for (let z = Math.floor(cz - r - 1); z <= cz + r + 1; z++) {
      const d = Math.hypot(x + 0.5 - cx, z + 0.5 - cz);
      if (d <= r) set.brick(1, 1, 0.12, PALETTE.sea, x, 0, z, { studs: false, cast: false });
      else if (d <= r + 1) set.brick(1, 1, 0.3, PALETTE.stone, x, 0, z, { studs: false });
    }
  }
  [[-4, -2], [3, 4], [-2, 5], [5, -3], [-5, 3], [1, -5]].forEach(([dx, dz]) => set.stud(PALETTE.leaf2, cx + dx, 0.2, cz + dz));
  // dock reaching in from the east shore, with a rowboat tied up beside it
  for (let i = 0; i < 6; i++) set.brick(1, 2, 0.25, PALETTE.brown, cx + r - i, 0.35, cz - 1, { studs: false });
  [0, 5].forEach((i) => set.brick(0.3, 0.3, 0.6, PALETTE.brown, cx + r - i + 0.35, 0, cz - 1.3, { studs: false }));
  set.brick(3, 1.4, 0.4, '#FFFFFF', cx + r - 5, 0.12, cz + 1.2, { studs: false });
  set.brick(3, 0.2, 0.15, PALETTE.red, cx + r - 5, 0.52, cz + 1.2, { studs: false });
  set.solid(cx - r - 1, cz - r - 1, cx + r + 1, cz + r + 1);
}

/** A little yellow rubber-duck, facing +x. */
function duck(set: BrickSet, x: number, z: number) {
  set.brick(1, 0.8, 0.45, PALETTE.duck, x, 0.12, z, { studs: false });
  set.brick(0.5, 0.5, 0.45, PALETTE.duck, x + 0.6, 0.57, z + 0.15, { studs: false });
  set.brick(0.3, 0.24, 0.14, PALETTE.beak, x + 1.1, 0.72, z + 0.28, { studs: false });
}

/** A flower bed in the shape of a small heart. */
function heartBed(set: BrickSet, cx: number, cz: number, size: number) {
  const petals = [PALETTE.pink, PALETTE.red, PALETTE.blush];
  for (let x = Math.floor(cx - size * 1.2); x <= cx + size * 1.2; x++) {
    for (let z = Math.floor(cz - size * 1.2); z <= cz + size * 1.2; z++) {
      // implicit heart: (x² + y² − 1)³ − x²y³ ≤ 0, with y pointing north
      const u = (x + 0.5 - cx) / size;
      const v = -(z + 0.5 - cz) / size + 0.15;
      if ((u * u + v * v - 1) ** 3 - u * u * v ** 3 <= 0) {
        set.brick(1, 1, PLATE_H, PALETTE.leaf2, x, 0, z, { studs: false, cast: false });
        set.stud(petals[(x * 7 + z * 3) & 1 ? 0 : (x + z) % 3 === 0 ? 1 : 2], x + 0.5, PLATE_H + 0.1, z + 0.5);
      }
    }
  }
}

/** A beach umbrella on the sand. */
function umbrella(set: BrickSet, x: number, z: number, color: string) {
  set.cylinder(0.08, 2.4, '#FFFFFF', x, 0, z, { segments: 6 });
  set.cylinder(1.4, 0.18, color, x, 2.3, z, { segments: 12 });
  set.cylinder(0.7, 0.18, '#FFFFFF', x, 2.48, z, { segments: 12 });
}

/** A bus stop: a glass shelter with a bench, a sign on a post and a timetable. */
function busStop(set: BrickSet, x: number, z: number) {
  set.brick(0.3, 3, 2.4, PALETTE.dark, x, 0, z, { studs: false });
  set.brick(1.6, 3, 0.15, PALETTE.dark, x, 2.4, z, { studs: false });
  set.brick(0.1, 2.6, 1.8, PALETTE.glass, x + 0.3, 0.4, z + 0.2, { studs: false, finish: 'glass' });
  set.brick(0.7, 2.4, 0.25, PALETTE.brown, x + 0.35, 0.6, z + 0.3, { studs: false });
  set.brick(0.15, 0.15, 2.6, PALETTE.dark, x + 1.4, 0, z + 3.4, { studs: false });
  set.brick(0.1, 1, 0.8, PALETTE.accentBlue, x + 1.32, 2.2, z + 3.0, { studs: false });
  set.solid(x, z, x + 1.6, z + 3.6);
}

/** A tiered fountain in a round stone basin. */
function fountain(set: BrickSet, cx: number, cz: number) {
  set.cylinder(3, 0.5, PALETTE.stone, cx, 0, cz, { segments: 20 });
  set.cylinder(2.6, 0.12, PALETTE.sea, cx, 0.5, cz, { segments: 20 });
  set.cylinder(0.4, 1.6, PALETTE.white, cx, 0.5, cz, { segments: 10 });
  set.cylinder(1.3, 0.25, PALETTE.white, cx, 2.1, cz, { segments: 16 });
  set.cylinder(1.1, 0.1, PALETTE.sea, cx, 2.35, cz, { segments: 16 });
  set.cylinder(0.25, 0.8, PALETTE.white, cx, 2.35, cz, { segments: 8 });
  set.cylinder(0.5, 0.2, PALETTE.glass, cx, 3.15, cz, { segments: 10 });
  set.solid(cx - 3, cz - 3, cx + 3, cz + 3);
}

/** A playground: a swing set and a slide. */
function playground(set: BrickSet, x: number, z: number) {
  // swings
  [0, 5].forEach((dx) => set.brick(0.3, 0.3, 3, PALETTE.red, x + dx, 0, z, { studs: false }));
  set.brick(5.3, 0.3, 0.3, PALETTE.red, x, 3, z, { studs: false });
  [1.5, 3.5].forEach((dx) => {
    set.brick(0.05, 0.05, 2, PALETTE.dark, x + dx, 1, z + 0.1, { studs: false, cast: false });
    set.brick(0.05, 0.05, 2, PALETTE.dark, x + dx + 0.6, 1, z + 0.1, { studs: false, cast: false });
    set.brick(0.8, 0.4, 0.12, PALETTE.yellow, x + dx - 0.1, 0.95, z, { studs: false });
  });
  // slide
  set.brick(2, 2, 2.4, PALETTE.teal, x + 7, 0, z - 1);
  for (let i = 0; i < 4; i++) set.brick(1.2, 1, 0.3, PALETTE.yellow, x + 7.4, 2.4 - i * 0.6, z + 1 + i, { studs: false });
  set.solid(x, z - 1, x + 9, z + 5);
}

/** A food truck with an awning and a hatch. */
function foodTruck(set: BrickSet, x: number, z: number) {
  set.brick(6, 3, 2.6, '#FFFFFF', x, 0.5, z, { studs: false });
  set.brick(2, 3, 1.8, PALETTE.pink, x + 6, 0.5, z, { studs: false });
  set.brick(1.6, 0.1, 0.8, PALETTE.glass, x + 6.2, 1.5, z - 0.05, { studs: false, finish: 'glass' });
  set.brick(3.4, 0.1, 1, PALETTE.interior, x + 1.3, 1.4, z + 3, { studs: false });
  set.brick(4, 1, 0.12, PALETTE.pink, x + 1, 2.6, z + 3, { studs: false });
  set.brick(6, 3, 0.25, PALETTE.pink, x, 3.1, z, { studs: false });
  [0.8, 4.8].forEach((dx) => set.cylinder(0.5, 1, PALETTE.dark, x + dx + 0.5, 0, z - 0.05, { segments: 10 }));
  set.solid(x, z, x + 8, z + 4);
}

/** An ice-cream cart under a striped umbrella. */
function iceCream(set: BrickSet, x: number, z: number) {
  set.brick(2.4, 1.4, 1.2, PALETTE.blush, x, 0.4, z, { studs: false });
  set.brick(2.4, 1.4, 0.15, '#FFFFFF', x, 1.6, z, { studs: false });
  [[0.5, PALETTE.pink], [1.2, '#FFFFFF'], [1.9, PALETTE.yellow]].forEach(([dx, c]) =>
    set.stud(c as string, x + (dx as number), 1.85, z + 0.7),
  );
  [0.3, 2.1].forEach((dx) => set.cylinder(0.35, 0.7, PALETTE.dark, x + dx, 0, z + 1.4, { segments: 10 }));
  umbrella(set, x + 1.2, z + 0.7, PALETTE.pink);
  set.solid(x, z, x + 2.4, z + 1.6);
}

/** Deterministic random numbers, so trees and flowers land in the same spots every load. */
function seededRandom(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Where the bigger features sit. The lake fills one side of the heart's middle. */
export const FEATURES = {
  lake: { x: -29, z: -14, r: 9 },
  fountain: { x: 0, z: -36 },
  /** The Ferris wheel (drawn in SceneryExtras, since it turns). */
  ferris: { x: 30, z: -14 },
  heartBed: { x: -11, z: 21, size: 4 },
  picnics: [
    [50, 46],
    [-64, 40],
    [14, 52],
    [-62, -64],
  ] as Array<[number, number]>,
};

/** Trees, lamp posts, benches, flowers and the rest of the island's decoration. */
/** Street lamps every so often along each stretch of road, alternating sides. */
function streetLamps(): Array<[number, number]> {
  const spots: Array<[number, number]> = [];
  const seen = new Set<string>();
  for (const [a, b] of ROAD_EDGES_FOR_LAMPS()) {
    const p = ROAD_NODES[a];
    const q = ROAD_NODES[b];
    const len = Math.hypot(q.x - p.x, q.z - p.z);
    const steps = Math.floor(len / 9);
    for (let i = 1; i <= steps; i++) {
      const t = i / (steps + 1);
      const x = p.x + (q.x - p.x) * t;
      const z = p.z + (q.z - p.z) * t;
      const side = i % 2 ? 1 : -1;
      const along = p.x === q.x ? 'z' : 'x';
      const lx = Math.round(along === 'z' ? x + side * 3.5 - 0.5 : x - 0.5);
      const lz = Math.round(along === 'x' ? z + side * 3.5 - 0.5 : z - 0.5);
      const key = `${lx},${lz}`;
      if (!seen.has(key)) {
        seen.add(key);
        spots.push([lx, lz]);
      }
    }
  }
  return spots;
}

/** Every stretch of road, as pairs of node ids (from the taxi graph). */
const ROAD_EDGES_FOR_LAMPS = () => ROAD_EDGES;

/** Trees, lamp posts, benches, flowers and the rest of the island's decoration. */
export function buildScenery(): BrickSet {
  const set = new BrickSet();
  const rand = seededRandom(11);

  // The bigger features first, so nothing else lands on them
  const L = FEATURES.lake;
  if (claim(L.x - L.r - 1, L.z - L.r - 1, L.x + L.r + 1, L.z + L.r + 1)) {
    lake(set, L.x, L.z, L.r);
    duck(set, L.x - 3, L.z - 1);
    duck(set, L.x + 1, L.z + 3);
    duck(set, L.x - 1, L.z - 4);
    duck(set, L.x - 5, L.z + 2);
  }
  const F = FEATURES.fountain;
  if (claim(F.x - 3, F.z - 3, F.x + 3, F.z + 3)) fountain(set, F.x, F.z);
  const W = FEATURES.ferris;
  claim(W.x - 5, W.z - 3, W.x + 5, W.z + 3); // kept clear for the wheel
  if (claim(14, -24, 23, -18)) playground(set, 14, -23);
  if (claim(3.2, 3, 4.8, 6.6)) busStop(set, 3.2, 3);
  if (claim(-20, 5, -12, 9)) foodTruck(set, -20, 5);
  if (claim(9, 6, 12, 8)) iceCream(set, 9, 6);
  const hb = FEATURES.heartBed;
  if (claim(hb.x - hb.size * 1.3, hb.z - hb.size * 1.3, hb.x + hb.size * 1.3, hb.z + hb.size * 1.3)) {
    heartBed(set, hb.x, hb.z, hb.size);
  }
  FEATURES.picnics.forEach(([x, z]) => claim(x, z, x + 4, z + 4) && picnic(set, x, z));

  // Street lamps along every road
  streetLamps().forEach(([x, z]) => {
    if (claim(x, z, x + 1, z + 1)) lamp(set, x, z);
  });

  // Benches, hydrants and planters
  const benches: Array<[number, number, boolean]> = [
    [-3, -32, false], [1, -32, false], // by the fountain
    [-26, -2.5, false], [-36, -10, true], // by the lake
    [3.5, 30, true], [-4.5, 30, true], [3.5, 12, true], // along the avenue
    [24, -4, false], [36, -4, false], // by the Ferris wheel
    [55, 30, false], [-60, 30, false], [40, 60, false], [-30, 60, false],
  ];
  benches.forEach(([x, z, alongZ]) => {
    if (claim(x, z, x + (alongZ ? 1 : 3), z + (alongZ ? 3 : 1))) bench(set, x, z, alongZ);
  });
  const hydrants: Array<[number, number]> = [[3, -4], [-4, 38], [24, 11], [-26, 11], [38, -37], [-40, -37]];
  hydrants.forEach(([x, z]) => claim(x, z, x + 1, z + 1) && hydrant(set, x, z));
  const planters: Array<[number, number]> = [[-5, 16], [3.5, 24], [-12, -5], [10, -5], [-5, -41], [3, -41]];
  planters.forEach(([x, z]) => claim(x, z, x + 2, z + 2) && planter(set, x, z));

  // Beach umbrellas along the sand
  const umbrellaColors = [PALETTE.pink, PALETTE.yellow, PALETTE.teal, PALETTE.red];
  const shore = GRASS_HALF + 2;
  [[-50, shore], [-15, shore], [20, shore], [55, shore], [shore, 40], [-shore, -20], [shore, -50]].forEach(([x, z], i) =>
    umbrella(set, x, z, umbrellaColors[i % umbrellaColors.length]),
  );

  // Trees: scattered wherever there's room; about one in six is a pink blossom
  for (let n = 0, tries = 0; n < 130 && tries < 6000; tries++) {
    const x = Math.floor(-GRASS_HALF + 2 + rand() * (GRASS_HALF * 2 - 4));
    const z = Math.floor(-GRASS_HALF + 2 + rand() * (GRASS_HALF * 2 - 4));
    if (!claim(x - 2, z - 2, x + 3, z + 3)) continue;
    if (n % 6 === 0) blossom(set, x, z);
    else tree(set, x, z);
    n++;
  }

  // Flowers
  const petals = [PALETTE.red, PALETTE.yellow, PALETTE.pink, '#FFFFFF'];
  for (let n = 0, tries = 0; n < 320 && tries < 9000; tries++) {
    const x = Math.floor(-GRASS_HALF + 1 + rand() * (GRASS_HALF * 2 - 2));
    const z = Math.floor(-GRASS_HALF + 1 + rand() * (GRASS_HALF * 2 - 2));
    if (!onGrass(x, z, x + 1, z + 1) || overlaps(x, z, x + 1, z + 1)) continue;
    set.brick(1, 1, PLATE_H, PALETTE.leaf2, x, 0, z, { studs: false, cast: false });
    set.stud(petals[n % petals.length], x + 0.5, PLATE_H + 0.1, z + 0.5);
    n++;
  }
  return set;
}
