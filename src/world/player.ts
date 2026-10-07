import { Vector3 } from 'three';
import { getBuilding, type BuildingId } from '../data/buildings';
import { entranceOf } from '../data/placement';

// Per-frame state lives in plain mutable objects rather than React state, so
// walking and camera movement never trigger re-renders.

export const player = {
  position: new Vector3(0, 0.22, 26),
  /** Facing the camera on load, so Ivory greets visitors. */
  heading: 0,
  target: null as { x: number; z: number } | null,
  enterOnArrival: null as BuildingId | null,
  stuckFor: 0,
};

export const rig = {
  yaw: 0,
  /** True when the current pointer gesture was a drag, so it shouldn't count as a click. */
  moved: false,
};

export function walkTo(x: number, z: number, enter: BuildingId | null = null): void {
  player.target = { x, z };
  player.enterOnArrival = enter;
  player.stuckFor = 0;
}

export function walkToBuilding(id: BuildingId): void {
  const e = entranceOf(getBuilding(id));
  walkTo(e.x, e.z, id);
}
