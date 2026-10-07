import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, Fog, type DirectionalLight, type HemisphereLight } from 'three';
import { daylight, mixHex, skyColor } from '../lib/daylight';
import { useWorld } from '../state/useWorld';
import { material } from './bricks/materials';
import { PALETTE } from './palette';
import { player } from './player';

/**
 * Sky, fog and lighting. The time of day follows the visitor's local clock
 * (or the day/night toggle): at night the sky goes dark and lamps and
 * windows glow. The sun's shadow box follows the player so shadows stay sharp
 * across the whole town.
 */
export function Environment() {
  const scene = useThree((s) => s.scene);
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const sky = useMemo(() => new Color(), []);
  const fog = useMemo(() => new Fog('#A9DBF5', 90, 220), []);
  const light = useRef({ current: -1, checkedAt: -10, target: 1 });

  useEffect(() => {
    scene.background = sky;
    scene.fog = fog;
    const s = sun.current;
    if (s) scene.add(s.target);
    return () => {
      if (s) scene.remove(s.target);
    };
  }, [scene, sky, fog]);

  useFrame(({ clock }, dt) => {
    const l = light.current;
    // Re-read the clock once a second; ease toward it so toggles fade smoothly.
    if (clock.elapsedTime - l.checkedAt > 1) {
      l.target = daylight(useWorld.getState().timeMode);
      l.checkedAt = clock.elapsedTime;
    }
    if (l.current < 0) l.current = l.target;
    l.current += (l.target - l.current) * Math.min(1, dt * 2.5);
    const d = l.current;

    sky.set(skyColor(d));
    fog.color.copy(sky);
    if (hemi.current) hemi.current.intensity = 0.3 + 0.9 * d;
    const s = sun.current;
    if (s) {
      s.intensity = 0.35 + 1.85 * d;
      s.color.set(mixHex('#9DB4FF', '#FFF4E0', d));
      const { x, z } = player.position;
      s.position.set(x + 40, 70, z + 30);
      s.target.position.set(x, 0, z);
      s.target.updateMatrixWorld();
    }
    material(PALETTE.yellow, 'glow').emissiveIntensity = 0.45 + (1 - d) * 1.4;
    const glass = material(PALETTE.glass, 'glass');
    glass.emissive.set('#FFCF7A');
    glass.emissiveIntensity = (1 - d) * 0.7;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={['#ffffff', '#5f8a45', 1.2]} />
      <directionalLight
        ref={sun}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.0006}
      />
    </>
  );
}
