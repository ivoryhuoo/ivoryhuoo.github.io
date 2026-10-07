import { useCallback, useMemo, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { BrickModel } from './bricks/BrickModel';
import type { BrickSet } from './bricks/BrickSet';
import { buildBaseplate } from './scenery/baseplate';
import { buildScenery } from './scenery/scenery';
import { SceneryExtras } from './scenery/SceneryExtras';
import { BUILDERS } from './buildings/builders';
import { EXTRAS } from './buildings/extras';
import { Character, TargetMarker } from './Character';
import { CameraRig } from './CameraRig';
import { Environment } from './Environment';
import { Taxi } from './TaxiCab';
import { ISLAND } from './land';
import { rig, walkTo } from './player';
import { BUILDINGS, type Building } from '../data/buildings';
import { rotationOf } from '../data/placement';
import { useKeyboard } from '../hooks/useKeyboard';
import { useWorld } from '../state/useWorld';
import { prefersReducedMotion } from '../lib/motion';

const clampX = (v: number) => Math.max(ISLAND.minX, Math.min(ISLAND.maxX, v));
const clampZ = (v: number) => Math.max(ISLAND.minZ, Math.min(ISLAND.maxZ, v));

// Built once: every open building's brick model.
const PLACED = BUILDINGS.filter((b) => b.status === 'open').map((b) => ({ building: b, bricks: BUILDERS[b.id]() }));

// Buildings closest to where you spawn are built first in the intro.
const SPAWN = { x: 0, z: 26 };
const ORDER = [...PLACED]
  .sort((a, b) => {
    const da = Math.hypot(a.building.origin.x - SPAWN.x, a.building.origin.z - SPAWN.z);
    const db = Math.hypot(b.building.origin.x - SPAWN.x, b.building.origin.z - SPAWN.z);
    return da - db;
  })
  .map((p) => p.building.id);

/** Places one building on the baseplate. Clicking it opens it straight away. */
function BuildingSlot({ building, bricks }: { building: Building; bricks: BrickSet }) {
  const [built, setBuilt] = useState(prefersReducedMotion);
  const onBuilt = useCallback(() => setBuilt(true), []);
  const Extras = EXTRAS[building.id];
  const delay = 0.6 + ORDER.indexOf(building.id) * 0.35;

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!rig.moved) useWorld.getState().openBuilding(building.id);
  };

  return (
    <group position={[building.origin.x, 0, building.origin.z]} rotation={[0, rotationOf(building), 0]} onClick={onClick}>
      <BrickModel set={bricks} introDelay={delay} onBuilt={onBuilt} />
      {built && Extras && <Extras />}
    </group>
  );
}

export function World() {
  const keys = useKeyboard();
  const baseplate = useMemo(buildBaseplate, []);
  const scenery = useMemo(buildScenery, []);

  const colliders = useMemo(
    () => [
      ...scenery.colliders,
      ...PLACED.flatMap(({ building: b, bricks }) => bricks.collidersAt(b.origin.x, b.origin.z, b.facing === 'north')),
    ],
    [scenery],
  );

  const onGroundClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!rig.moved && !useWorld.getState().riding) walkTo(clampX(e.point.x), clampZ(e.point.z));
  };

  return (
    <>
      <Environment />

      <group onClick={onGroundClick}>
        <BrickModel set={baseplate} />
        <BrickModel set={scenery} />
        <SceneryExtras />
      </group>

      {PLACED.map(({ building, bricks }) => (
        <BuildingSlot key={building.id} building={building} bricks={bricks} />
      ))}

      <Character colliders={colliders} keys={keys} />
      <TargetMarker />
      <Taxi />
      <CameraRig />
    </>
  );
}
