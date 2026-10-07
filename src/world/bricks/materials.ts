import { BoxGeometry, CylinderGeometry, MeshStandardMaterial, type BufferGeometry } from 'three';
import type { Finish } from './BrickSet';

// Shared caches: thousands of bricks reuse a handful of geometries and materials.

const materials = new Map<string, MeshStandardMaterial>();

export function material(color: string, finish: Finish = 'plastic'): MeshStandardMaterial {
  const key = `${color}:${finish}`;
  let m = materials.get(key);
  if (!m) {
    m = new MeshStandardMaterial({ color, roughness: 0.42, metalness: 0 });
    if (finish === 'glass') {
      m.transparent = true;
      m.opacity = 0.55;
      m.roughness = 0.1;
    } else if (finish === 'glow') {
      m.emissive.set(color);
      m.emissiveIntensity = 0.45;
    } else if (finish === 'metal') {
      m.metalness = 0.6;
      m.roughness = 0.3;
    }
    materials.set(key, m);
  }
  return m;
}

const geometries = new Map<string, BufferGeometry>();

export function boxGeometry(w: number, h: number, d: number): BufferGeometry {
  const key = `box:${w}:${h}:${d}`;
  let g = geometries.get(key);
  if (!g) {
    g = new BoxGeometry(w, h, d);
    geometries.set(key, g);
  }
  return g;
}

export function cylinderGeometry(r: number, h: number, segments = 32): BufferGeometry {
  const key = `cyl:${r}:${h}:${segments}`;
  let g = geometries.get(key);
  if (!g) {
    g = new CylinderGeometry(r, r, h, segments);
    geometries.set(key, g);
  }
  return g;
}

export const studGeometry = new CylinderGeometry(0.3, 0.3, 0.2, 16);
