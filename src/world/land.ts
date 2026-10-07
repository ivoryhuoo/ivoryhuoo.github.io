// The island the town sits on: a square of studded grass with a sandy beach
// around it, in a calm sea. Everything that needs the island's edges (the
// baseplate, walking limits, scenery, the minimap) asks this file.

/** Half the width of the grass, in studs. */
export const GRASS_HALF = 75;
/** Width of the sand beach around the grass. */
export const BEACH = 4;

export const ISLAND = {
  minX: -GRASS_HALF - BEACH,
  maxX: GRASS_HALF + BEACH,
  minZ: -GRASS_HALF - BEACH,
  maxZ: GRASS_HALF + BEACH,
};

/** On the grass? */
export const onGrass = (x: number, z: number) => Math.abs(x) < GRASS_HALF && Math.abs(z) < GRASS_HALF;

/** Where you can walk: the grass and most of the beach. */
export const walkable = (x: number, z: number) =>
  Math.abs(x) < GRASS_HALF + BEACH - 1 && Math.abs(z) < GRASS_HALF + BEACH - 1;
