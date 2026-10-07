import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MeshStandardMaterial, type Group, type Material, type Mesh, type MeshBasicMaterial } from 'three';
import { boxGeometry, cylinderGeometry, material } from './bricks/materials';
import type { Collider } from './bricks/BrickSet';
import { isBlocked } from './collision';
import { player, rig } from './player';
import { useCanvasTexture } from './useCanvasTexture';
import { PALETTE } from './palette';
import { BUILDINGS, type BuildingId } from '../data/buildings';
import { entranceOf } from '../data/placement';
import { taxi } from './taxi';
import { useWorld } from '../state/useWorld';
import { prefersReducedMotion } from '../lib/motion';
import type { KeyState } from '../hooks/useKeyboard';

/** Change these to restyle the character. */
const LOOK = {
  skin: '#EFC7A2',
  hair: '#141418',
  shirt: '#F29AB8',
  shirtTrim: '#E07FA2',
  button: '#FFFFFF',
  pants: '#1C1C21',
  belt: '#0E0E10',
  buckle: '#C9CCD1',
  shoe: '#0B0B0D',
};

const SPEED = 7;
const RADIUS = 0.7;
const GROUND_Y = 0.22;
const ENTER_RANGE = 3.2;

type V3 = [number, number, number];

function Part({ size, color, position, rotation, mat }: {
  size: V3;
  color?: string;
  position?: V3;
  rotation?: V3;
  mat?: Material | Material[];
}) {
  return (
    <mesh
      geometry={boxGeometry(size[0], size[1], size[2])}
      material={mat ?? material(color ?? '#ff00ff')}
      position={position}
      rotation={rotation}
      castShadow
    />
  );
}

function drawFace(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = LOOK.skin;
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = 'rgba(232,111,165,.35)';
  for (const [x, y] of [[30, 84], [98, 84]]) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#1E1E24';
  for (const [x, y] of [[42, 64], [86, 64]]) {
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#FFFFFF';
  for (const [x, y] of [[45, 61], [89, 61]]) {
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#1E1E24';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(64, 80, 16, 0.18 * Math.PI, 0.82 * Math.PI);
  ctx.stroke();
}

interface Props {
  colliders: Collider[];
  keys: MutableRefObject<KeyState>;
}

export function Character({ colliders, keys }: Props) {
  const root = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const walk = useRef({ phase: 0, swing: 0, wave: 0, hasMoved: false });

  const face = useCanvasTexture(128, 128, drawFace);
  const headMaterials = useMemo(() => {
    const skin = material(LOOK.skin);
    const front = new MeshStandardMaterial({ map: face, roughness: 0.5 });
    // BoxGeometry face order: +x, -x, +y, -y, +z (front), -z
    return [skin, skin, skin, skin, front, skin];
  }, [face]);

  const entrances = useMemo(
    () =>
      BUILDINGS.filter((b) => b.status === 'open').map((b) => ({ id: b.id, ...entranceOf(b) })),
    [],
  );

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const world = useWorld.getState();
    const k = keys.current;
    const pos = player.position;

    // Riding the taxi: hide the character and let the taxi move the player.
    if (taxi.active) {
      if (root.current) root.current.visible = false;
      if (world.nearby) world.setNearby(null);
      return;
    }
    if (root.current && !root.current.visible) root.current.visible = true;

    let mx = 0;
    let mz = 0;

    // 1. Work out which way to go: keys win over click-to-walk.
    if (!world.open) {
      const forward = Number(!!(k.w || k.arrowup)) - Number(!!(k.s || k.arrowdown));
      const strafe = Number(!!(k.d || k.arrowright)) - Number(!!(k.a || k.arrowleft));
      if (forward || strafe) {
        player.target = null;
        player.enterOnArrival = null;
        mx = -Math.sin(rig.yaw) * forward + Math.cos(rig.yaw) * strafe;
        mz = -Math.cos(rig.yaw) * forward - Math.sin(rig.yaw) * strafe;
      } else if (player.target) {
        const dx = player.target.x - pos.x;
        const dz = player.target.z - pos.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.25) player.target = null;
        else {
          mx = dx / dist;
          mz = dz / dist;
        }
      }
    }

    // 2. Move, sliding along walls one axis at a time.
    let moving = false;
    const len = Math.hypot(mx, mz);
    if (len > 0) {
      mx /= len;
      mz /= len;
      const step = SPEED * dt;
      const ox = pos.x;
      const oz = pos.z;
      // If something put us inside a collider (like stepping out of the taxi), let us walk out.
      const inside = isBlocked(ox, oz, RADIUS, colliders);
      if (inside || !isBlocked(ox + mx * step, oz, RADIUS, colliders)) pos.x = ox + mx * step;
      if (inside || !isBlocked(pos.x, oz + mz * step, RADIUS, colliders)) pos.z = oz + mz * step;
      moving = Math.hypot(pos.x - ox, pos.z - oz) > step * 0.2;

      if (player.target) {
        player.stuckFor = moving ? 0 : player.stuckFor + dt;
        if (player.stuckFor > 0.35) {
          player.target = null;
          player.enterOnArrival = null;
        }
      }

      const want = Math.atan2(mx, mz);
      const diff = Math.atan2(Math.sin(want - player.heading), Math.cos(want - player.heading));
      player.heading += diff * Math.min(1, dt * 12);
    }

    // 3. Animate the walk cycle.
    const w = walk.current;
    w.swing += ((moving ? 1 : 0) - w.swing) * Math.min(1, dt * 10);
    if (moving) w.phase += dt * 11;
    const swing = Math.sin(w.phase) * 0.65 * w.swing;
    // Wave hello on arrival, until the visitor starts moving.
    if (moving) w.hasMoved = true;
    const t = clock.elapsedTime;
    const waving = !w.hasMoved && !prefersReducedMotion() && t > 0.8 && t < 5;
    w.wave += ((waving ? 1 : 0) - w.wave) * Math.min(1, dt * 6);
    legL.current?.rotation.set(swing, 0, 0);
    legR.current?.rotation.set(-swing, 0, 0);
    armL.current?.rotation.set(-swing, 0, 0);
    armR.current?.rotation.set(swing * (1 - w.wave), 0, w.wave * (2.6 + Math.sin(t * 10) * 0.35));
    if (root.current) {
      root.current.position.set(pos.x, GROUND_Y + Math.abs(Math.sin(w.phase)) * 0.08 * w.swing, pos.z);
      root.current.rotation.y = player.heading;
    }

    // 4. Check for nearby doors.
    let near: BuildingId | null = null;
    for (const e of entrances) {
      if (Math.hypot(e.x - pos.x, e.z - pos.z) < ENTER_RANGE) near = e.id;
    }
    if (near !== world.nearby) world.setNearby(near);
    if (!player.target && player.enterOnArrival) {
      if (near === player.enterOnArrival && !world.open) world.openBuilding(near);
      player.enterOnArrival = null;
    }
  });

  return (
    <group ref={root} position={player.position.toArray()} rotation={[0, player.heading, 0]}>
      {/* Black dress pants and shoes */}
      {([[legL, -0.31], [legR, 0.31]] as const).map(([ref, x]) => (
        <group key={x} ref={ref} position={[x, 1.3, 0]}>
          <Part size={[0.55, 1.1, 0.62]} color={LOOK.pants} position={[0, -0.55, 0]} />
          <Part size={[0.58, 0.22, 0.72]} color={LOOK.shoe} position={[0, -1.19, 0.04]} />
        </group>
      ))}
      <Part size={[1.24, 0.3, 0.68]} color={LOOK.pants} position={[0, 1.42, 0]} />
      <Part size={[1.27, 0.12, 0.71]} color={LOOK.belt} position={[0, 1.58, 0]} />
      <Part size={[0.22, 0.1, 0.02]} color={LOOK.buckle} position={[0, 1.58, 0.365]} />

      {/* Pink button-up shirt, tucked in */}
      <Part size={[1.3, 1.2, 0.74]} color={LOOK.shirt} position={[0, 2.23, 0]} />
      <Part size={[0.08, 1.0, 0.02]} color={LOOK.shirtTrim} position={[0, 2.15, 0.375]} />
      {[2.6, 2.3, 2.0, 1.75].map((y) => (
        <Part key={y} size={[0.07, 0.07, 0.02]} color={LOOK.button} position={[0, y, 0.39]} />
      ))}
      <Part size={[0.34, 0.14, 0.05]} color={LOOK.shirtTrim} position={[-0.18, 2.78, 0.37]} rotation={[0, 0, -0.4]} />
      <Part size={[0.34, 0.14, 0.05]} color={LOOK.shirtTrim} position={[0.18, 2.78, 0.37]} rotation={[0, 0, 0.4]} />

      {/* Arms with shirt cuffs */}
      {([[armL, -0.86], [armR, 0.86]] as const).map(([ref, x]) => (
        <group key={x} ref={ref} position={[x, 2.72, 0]}>
          <Part size={[0.4, 1.05, 0.46]} color={LOOK.shirt} position={[0, -0.45, 0]} />
          <Part size={[0.42, 0.1, 0.48]} color={LOOK.shirtTrim} position={[0, -0.94, 0]} />
          <Part size={[0.36, 0.3, 0.4]} color={LOOK.skin} position={[0, -1.13, 0]} />
        </group>
      ))}

      {/* Neck and head */}
      <mesh geometry={cylinderGeometry(0.22, 0.16, 12)} material={material(LOOK.skin)} position={[0, 2.9, 0]} />
      <mesh geometry={boxGeometry(1, 0.95, 0.95)} material={headMaterials} position={[0, 3.45, 0]} castShadow />

      {/* Long black hair: falls down the back, framed at the sides, with bangs */}
      <Part size={[1.1, 0.3, 1.06]} color={LOOK.hair} position={[0, 3.99, 0]} />
      <Part size={[1.16, 2.1, 0.3]} color={LOOK.hair} position={[0, 3.05, -0.55]} />
      <Part size={[0.14, 0.8, 0.62]} color={LOOK.hair} position={[-0.56, 3.6, -0.18]} />
      <Part size={[0.14, 0.8, 0.62]} color={LOOK.hair} position={[0.56, 3.6, -0.18]} />
      <Part size={[1.1, 0.18, 0.14]} color={LOOK.hair} position={[0, 3.84, 0.47]} />
      <Part size={[0.42, 0.3, 0.14]} color={LOOK.hair} position={[0.33, 3.74, 0.47]} />
      <mesh geometry={cylinderGeometry(0.3, 0.2, 16)} material={material(LOOK.hair)} position={[0, 4.24, 0]} castShadow />

      <Html position={[0, 5, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <div className="name-tag">Ivory</div>
      </Html>
    </group>
  );
}

/** Pulsing ring showing where a click-to-walk is headed. */
export function TargetMarker() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = player.target;
    mesh.visible = !!t;
    if (t) {
      mesh.position.set(t.x, 0.25, t.z);
      (mesh.material as MeshBasicMaterial).opacity = 0.6 + Math.sin(clock.elapsedTime * 6) * 0.3;
    }
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} visible={false}>
      <ringGeometry args={[0.45, 0.7, 24]} />
      <meshBasicMaterial color={PALETTE.yellow} transparent opacity={0.9} />
    </mesh>
  );
}
