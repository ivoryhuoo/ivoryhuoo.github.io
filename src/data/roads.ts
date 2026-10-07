// The street network. The ring road is drawn as a pixel-art heart, one
// "pixel" every 14 studs, with an avenue running up the middle from the tip.
//
// ROAD_TILES are what gets laid on the baseplate and drawn on the minimap;
// ROAD_NODES and ROAD_EDGES are the graph the taxi drives on. All coordinates
// are on the baseplate (stud units).

export interface Tile {
  x: number;
  z: number;
  w: number;
  d: number;
}

/** Road width in studs; the centre lines below sit in the middle of it. */
export const ROAD_W = 4;

/**
 * The heart's outline, clockwise from the top of the left lobe. Each corner is
 * a grid point (14-stud pixels), so every stretch of road is straight and the
 * shape reads as pixel art on the map.
 *
 *    .XX.XX.
 *    XXXXXXX
 *    XXXXXXX
 *    .XXXXX.
 *    ..XXX..
 *    ...X...
 */
const HEART: Array<[string, number, number]> = [
  ['A', -35, -42], ['B', -7, -42], ['C', -7, -28], ['D', 7, -28], ['E', 7, -42], ['F', 35, -42],
  ['G', 35, -28], ['H', 49, -28], ['I', 49, 0], ['J', 35, 0], ['K', 35, 14], ['L', 21, 14],
  ['M', 21, 28], ['N', 7, 28], ['O', 7, 42], ['TIP', 0, 42], ['Q', -7, 42], ['R', -7, 28], ['S', -21, 28], // S is also the Events Garden's stop
  ['T', -21, 14], ['U', -35, 14], ['V', -35, 0], ['W', -49, 0], ['X', -49, -28], ['Y', -35, -28],
];

/** Taxi stops beside each door, each on one of the heart's straight stretches. */
const STOPS: Record<string, [number, number]> = {
  CAs: [-21, -42], // Campus
  APs: [21, -42], // Airport
  CSs: [-47, -28], // Construction Site
  PSs: [46, -28], // Product Studio
  CCs: [-48, 0], // Community Centre
  DCs: [46, 0], // Data Centre
  POs: [-30, 14], // Post Office
  ARs: [32, 14], // Arcade
};

/** The avenue up the middle of the heart, from the tip to City Hall. */
const AVENUE: Array<[string, number, number]> = [
  ['TIP', 0, 42],
  ['WS', 0, 20], // the welcome sign
  ['BUS', 0, 6], // bus stop
  ['CH', 0, -7], // City Hall
];

export const ROAD_NODES: Record<string, { x: number; z: number }> = {};
for (const [id, x, z] of [...HEART, ...AVENUE]) ROAD_NODES[id] = { x, z };
for (const [id, [x, z]] of Object.entries(STOPS)) ROAD_NODES[id] = { x, z };

const onSegment = (p: { x: number; z: number }, a: { x: number; z: number }, b: { x: number; z: number }) =>
  (a.x === b.x && p.x === a.x && p.z >= Math.min(a.z, b.z) && p.z <= Math.max(a.z, b.z)) ||
  (a.z === b.z && p.z === a.z && p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x));

export const ROAD_EDGES: Array<[string, string]> = [];
export const ROAD_TILES: Tile[] = [];

function addStretch(from: string, to: string, includeStops: boolean) {
  const a = ROAD_NODES[from];
  const b = ROAD_NODES[to];
  // Stops on this stretch, in order from `from` to `to`
  const stops = includeStops
    ? Object.keys(STOPS)
        .filter((id) => onSegment(ROAD_NODES[id], a, b))
        .sort((p, q) => Math.hypot(ROAD_NODES[p].x - a.x, ROAD_NODES[p].z - a.z) - Math.hypot(ROAD_NODES[q].x - a.x, ROAD_NODES[q].z - a.z))
    : [];
  const chain = [from, ...stops, to];
  for (let i = 0; i < chain.length - 1; i++) ROAD_EDGES.push([chain[i], chain[i + 1]]);
  const h = ROAD_W / 2;
  ROAD_TILES.push({
    x: Math.min(a.x, b.x) - h,
    z: Math.min(a.z, b.z) - h,
    w: Math.abs(a.x - b.x) + ROAD_W,
    d: Math.abs(a.z - b.z) + ROAD_W,
  });
}

HEART.forEach(([id], i) => addStretch(id, HEART[(i + 1) % HEART.length][0], true));
for (let i = 0; i < AVENUE.length - 1; i++) addStretch(AVENUE[i][0], AVENUE[i + 1][0], false);

/** The Airport's runway, north of the terminal (see the airport builder). */
export const RUNWAY: Tile = { x: 1, z: -69, w: 46, d: 6 };
