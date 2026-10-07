import { getBuilding, type BuildingId } from '../data/buildings';
import { routeTo, type Point } from '../lib/routing';
import { useWorld } from '../state/useWorld';
import { player, walkToBuilding } from './player';

const MAX_SPEED = 20;
const ACCEL = 14;

/** The taxi's state. Taxi.tsx draws it; stepTaxi moves it each frame. */
export const taxi = {
  visible: false,
  active: false,
  x: 0,
  z: 0,
  heading: 0,
  speed: 0,
  path: [] as Point[],
  seg: 0,
  dest: null as BuildingId | null,
};

/** Pick the player up where they stand and drive them to a building. */
export function callTaxi(id: BuildingId): void {
  const start = { x: player.position.x, z: player.position.z };
  taxi.path = routeTo(start, getBuilding(id).stop);
  taxi.seg = 1;
  taxi.x = start.x;
  taxi.z = start.z;
  taxi.speed = 0;
  taxi.dest = id;
  taxi.active = true;
  taxi.visible = true;
  player.target = null;
  player.enterOnArrival = null;
  const world = useWorld.getState();
  world.closeBuilding();
  world.setRiding(true);
}

function remaining(): number {
  let d = Math.hypot(taxi.path[taxi.seg].x - taxi.x, taxi.path[taxi.seg].z - taxi.z);
  for (let i = taxi.seg; i < taxi.path.length - 1; i++) {
    d += Math.hypot(taxi.path[i + 1].x - taxi.path[i].x, taxi.path[i + 1].z - taxi.path[i].z);
  }
  return d;
}

function arrive() {
  taxi.active = false;
  useWorld.getState().setRiding(false);
  // Step out on the kerb side, then walk to the door.
  const rightX = Math.cos(taxi.heading);
  const rightZ = -Math.sin(taxi.heading);
  player.position.set(taxi.x + rightX * 1.6, player.position.y, taxi.z + rightZ * 1.6);
  player.heading = taxi.heading;
  if (taxi.dest) walkToBuilding(taxi.dest);
}

export function stepTaxi(dt: number): void {
  if (!taxi.active) return;
  if (taxi.seg >= taxi.path.length) return arrive();

  const left = remaining();
  taxi.speed = Math.min(MAX_SPEED, taxi.speed + ACCEL * dt);
  if (left < 8) taxi.speed = Math.max(3, Math.min(taxi.speed, left * 2.5));
  let step = taxi.speed * dt;

  while (step > 0 && taxi.seg < taxi.path.length) {
    const target = taxi.path[taxi.seg];
    const dx = target.x - taxi.x;
    const dz = target.z - taxi.z;
    const d = Math.hypot(dx, dz);
    if (d > 0.01) {
      const want = Math.atan2(dx, dz);
      const diff = Math.atan2(Math.sin(want - taxi.heading), Math.cos(want - taxi.heading));
      taxi.heading += diff * Math.min(1, dt * 10);
    }
    if (d <= step) {
      taxi.x = target.x;
      taxi.z = target.z;
      taxi.seg++;
      step -= d;
    } else {
      taxi.x += (dx / d) * step;
      taxi.z += (dz / d) * step;
      step = 0;
    }
  }

  player.position.set(taxi.x, player.position.y, taxi.z);
  if (taxi.seg >= taxi.path.length) arrive();
}
