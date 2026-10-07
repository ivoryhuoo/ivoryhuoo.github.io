import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

type Draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

/** A texture painted with the 2D canvas API, repainted once web fonts load. */
export function useCanvasTexture(width: number, height: number, draw: Draw): CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    paint(t, draw);
    return t;
    // draw is expected to be a stable module-level function
  }, [width, height]);

  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) paint(texture, draw);
    });
    return () => {
      alive = false;
    };
  }, [texture]);

  return texture;
}

function paint(texture: CanvasTexture, draw: Draw) {
  const canvas = texture.image as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(ctx, canvas.width, canvas.height);
  texture.needsUpdate = true;
}

export const DISPLAY_FONT = '"Bricolage Grotesque", "Avenir Next", "Segoe UI", sans-serif';
