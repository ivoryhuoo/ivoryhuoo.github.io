import { useCallback } from 'react';
import { DISPLAY_FONT, useCanvasTexture } from '../../useCanvasTexture';

type V3 = [number, number, number];

interface Props {
  text: string;
  position: V3;
  size: [number, number];
  bg: string;
  fg: string;
  /** Lit signs ignore scene lighting, so they read at night. */
  lit?: boolean;
  rotation?: V3;
  /** Letter-spaced capitals, like building lettering. */
  spaced?: boolean;
}


/** A flat sign with text, drawn to a canvas texture. */
export function Sign({ text, position, size, bg, fg, lit = false, rotation, spaced = true }: Props) {
  const width = 1024;
  const height = Math.max(32, Math.round((width * size[1]) / size[0]));
  const label = spaced ? text.toUpperCase() : text;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const track = (size: number) => {
        // Letter-spaced capitals where the browser supports it.
        if (spaced && 'letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${Math.round(size * 0.12)}px`;
      };
      let px = Math.round(h * 0.66);
      ctx.font = `800 ${px}px ${DISPLAY_FONT}`;
      track(px);
      const fits = w * 0.9;
      const measured = ctx.measureText(label).width;
      if (measured > fits) {
        px = Math.floor((px * fits) / measured);
        ctx.font = `800 ${px}px ${DISPLAY_FONT}`;
        track(px);
      }
      ctx.fillText(label, w / 2, h / 2 + px * 0.05);
    },
    [bg, fg, label, spaced],
  );
  const texture = useCanvasTexture(width, height, draw);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      {lit ? (
        <meshBasicMaterial map={texture} toneMapped={false} />
      ) : (
        <meshStandardMaterial map={texture} roughness={0.6} />
      )}
    </mesh>
  );
}
