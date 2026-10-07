import { DISPLAY_FONT, useCanvasTexture } from '../../useCanvasTexture';

function drawFace(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#E2609C';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,.85)';
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 52px ${DISPLAY_FONT}`;
  ctx.fillText('Welcome to', w / 2, h * 0.24);
  ctx.font = `800 104px ${DISPLAY_FONT}`;
  ctx.fillText('The City of Ivory', w / 2, h * 0.52);
  ctx.font = `600 38px ${DISPLAY_FONT}`;
  ctx.fillText('Click any building to explore my life', w / 2, h * 0.8);
}

export function WelcomeSignExtras() {
  const face = useCanvasTexture(1024, 300, drawFace);
  return (
    <mesh position={[0, 3.0, 0.75]}>
      <planeGeometry args={[9.6, 2.7]} />
      <meshStandardMaterial map={face} roughness={0.55} />
    </mesh>
  );
}
