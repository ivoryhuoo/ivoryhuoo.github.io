import { ROAD_EDGES, ROAD_NODES } from '../data/roads';

export interface Point {
  x: number;
  z: number;
}

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.z - b.z);

const neighbours = new Map<string, string[]>();
for (const [a, b] of ROAD_EDGES) {
  neighbours.set(a, [...(neighbours.get(a) ?? []), b]);
  neighbours.set(b, [...(neighbours.get(b) ?? []), a]);
}

export function nearestNode(p: Point): string {
  let best = '';
  let bestD = Infinity;
  for (const [id, node] of Object.entries(ROAD_NODES)) {
    const d = dist(p, node);
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}

/** Dijkstra over the road graph. Returns node ids from `from` to `to`. */
export function shortestPath(from: string, to: string): string[] {
  const best = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, string>();
  const open = new Set<string>([from]);
  while (open.size) {
    let current = '';
    let currentD = Infinity;
    for (const id of open) {
      const d = best.get(id) ?? Infinity;
      if (d < currentD) {
        currentD = d;
        current = id;
      }
    }
    open.delete(current);
    if (current === to) break;
    for (const next of neighbours.get(current) ?? []) {
      const d = currentD + dist(ROAD_NODES[current], ROAD_NODES[next]);
      if (d < (best.get(next) ?? Infinity)) {
        best.set(next, d);
        prev.set(next, current);
        open.add(next);
      }
    }
  }
  const path = [to];
  while (path[0] !== from) {
    const p = prev.get(path[0]);
    if (!p) return [from, to];
    path.unshift(p);
  }
  return path;
}

/** A route from any point to a road node: straight to the nearest road, then along the streets. */
export function routeTo(start: Point, stop: string): Point[] {
  const nodes = shortestPath(nearestNode(start), stop);
  return [start, ...nodes.map((id) => ROAD_NODES[id])];
}
