import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { boxGeometry, cylinderGeometry, material } from './bricks/materials';
import { stepTaxi, taxi } from './taxi';
import { DISPLAY_FONT, useCanvasTexture } from './useCanvasTexture';

const YELLOW = '#F7C531';

function drawChecker(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const n = 16;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#111111' : '#F5F5F5';
      ctx.fillRect((i * w) / n, (j * h) / 2, w / n, h / 2);
    }
  }
}

function drawRoofSign(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#FFFBEA';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#111111';
  ctx.font = `800 54px ${DISPLAY_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAXI', w / 2, h / 2 + 3);
}

/** A yellow brick-built cab. It faces +z; the group is turned to its heading. */
export function Taxi() {
  const ref = useRef<Group>(null);
  const checker = useCanvasTexture(256, 32, drawChecker);
  const roof = useCanvasTexture(256, 80, drawRoofSign);

  useFrame((_, rawDt) => {
    stepTaxi(Math.min(rawDt, 0.05));
    const g = ref.current;
    if (!g) return;
    g.visible = taxi.visible;
    g.position.set(taxi.x, 0.22, taxi.z);
    g.rotation.y = taxi.heading;
  });

  const yellow = material(YELLOW);
  const tinted = material('#2A3240', 'glass');
  return (
    <group ref={ref} visible={false}>
      <mesh geometry={boxGeometry(1.9, 0.7, 4)} material={yellow} position={[0, 0.75, 0]} castShadow />
      <mesh geometry={boxGeometry(1.7, 0.7, 2)} material={yellow} position={[0, 1.45, -0.2]} castShadow />
      <mesh geometry={boxGeometry(1.74, 0.5, 1.6)} material={tinted} position={[0, 1.45, -0.2]} />
      <mesh geometry={boxGeometry(1.5, 0.5, 2.04)} material={tinted} position={[0, 1.45, -0.2]} />
      {[-0.96, 0.96].map((x) => (
        <mesh key={x} position={[x, 0.8, 0]} rotation={[0, x > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <planeGeometry args={[3.4, 0.22]} />
          <meshStandardMaterial map={checker} />
        </mesh>
      ))}
      <mesh position={[0, 2.0, -0.2]}>
        <boxGeometry args={[0.9, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFFBEA" />
      </mesh>
      {[0.16, -0.16].map((z) => (
        <mesh key={z} position={[0, 2.0, -0.2 + z * 1.0]} rotation={[0, z > 0 ? 0 : Math.PI, 0]}>
          <planeGeometry args={[0.86, 0.26]} />
          <meshBasicMaterial map={roof} />
        </mesh>
      ))}
      {[
        [-0.95, -1.3],
        [0.95, -1.3],
        [-0.95, 1.3],
        [0.95, 1.3],
      ].map(([x, z]) => (
        <mesh
          key={`${x}${z}`}
          geometry={cylinderGeometry(0.38, 0.3, 16)}
          material={material('#111216')}
          position={[x, 0.38, z]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        />
      ))}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} geometry={boxGeometry(0.4, 0.2, 0.05)} material={material('#FFF4C2', 'glow')} position={[x, 0.85, 2.01]} />
      ))}
    </group>
  );
}
