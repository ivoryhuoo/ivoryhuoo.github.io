import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, type Group, type InstancedMesh, type Mesh } from 'three';
import type { BrickSet, Stud } from './BrickSet';
import { boxGeometry, cylinderGeometry, material, studGeometry } from './materials';
import { prefersReducedMotion } from '../../lib/motion';

// Tiny gaps between bricks make the seams read as separate pieces.
const SEAM = 0.04;
// Intro: each brick drops from this high, lower bricks first.
const DROP = 14;
const FALL = 0.45;
const SPREAD = 1.4;

interface Props {
  set: BrickSet;
  /** Seconds after load to start the brick-by-brick build. Omit to show it built. */
  introDelay?: number;
  onBuilt?: () => void;
}

/** Renders any BrickSet. Studs are drawn as one instanced mesh per colour. */
export const BrickModel = memo(function BrickModel({ set, introDelay, onBuilt }: Props) {
  const animate = introDelay !== undefined && !prefersReducedMotion();
  const meshes = useRef<Array<Mesh | null>>([]);
  const studGroup = useRef<Group>(null);
  const finished = useRef(!animate);

  const pieces = useMemo(
    () => [
      ...set.boxes.map((b) => ({ y: b.y, rest: b.y + b.h / 2 })),
      ...set.cylinders.map((c) => ({ y: c.y, rest: c.y + c.h / 2 })),
    ],
    [set],
  );
  const maxY = useMemo(() => pieces.reduce((m, p) => Math.max(m, p.y), 1), [pieces]);

  const studGroups = useMemo(() => {
    const byColor = new Map<string, Stud[]>();
    for (const stud of set.studs) {
      const list = byColor.get(stud.color);
      if (list) list.push(stud);
      else byColor.set(stud.color, [stud]);
    }
    return [...byColor.entries()];
  }, [set]);

  useFrame(({ clock }) => {
    if (finished.current) return;
    const t = clock.elapsedTime - (introDelay ?? 0);
    let landed = true;
    for (let i = 0; i < pieces.length; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const start = (pieces[i].y / maxY) * SPREAD + (i % 5) * 0.04;
      const k = Math.min(1, Math.max(0, (t - start) / FALL));
      if (k < 1) landed = false;
      mesh.visible = k > 0;
      const eased = 1 - Math.pow(1 - k, 3);
      mesh.position.y = pieces[i].rest + (1 - eased) * DROP;
    }
    if (landed) {
      finished.current = true;
      if (studGroup.current) studGroup.current.visible = true;
      onBuilt?.();
    }
  });

  const n = set.boxes.length;
  return (
    <group>
      {set.boxes.map((b, i) => (
        <mesh
          key={`b${i}`}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          visible={!animate}
          geometry={boxGeometry(b.w - SEAM, b.h - SEAM / 2, b.d - SEAM)}
          material={material(b.color, b.finish)}
          position={[b.x + b.w / 2, b.y + b.h / 2, b.z + b.d / 2]}
          castShadow={b.cast}
          receiveShadow
        />
      ))}
      {set.cylinders.map((c, i) => (
        <mesh
          key={`c${i}`}
          ref={(el) => {
            meshes.current[n + i] = el;
          }}
          visible={!animate}
          geometry={cylinderGeometry(c.r, c.h - SEAM / 2, c.segments)}
          material={material(c.color, c.finish)}
          position={[c.x, c.y + c.h / 2, c.z]}
          castShadow={c.cast}
          receiveShadow
        />
      ))}
      <group ref={studGroup} visible={!animate}>
        {studGroups.map(([color, studs]) => (
          <StudInstances key={color} color={color} studs={studs} />
        ))}
      </group>
    </group>
  );
});

const dummy = new Object3D();

function StudInstances({ color, studs }: { color: string; studs: Stud[] }) {
  const ref = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    studs.forEach((s, i) => {
      dummy.position.set(s.x, s.y, s.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [studs]);

  return (
    <instancedMesh
      ref={ref}
      args={[studGeometry, material(color), studs.length]}
      castShadow={studs.length < 800}
      receiveShadow
    />
  );
}
