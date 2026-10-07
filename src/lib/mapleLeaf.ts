/** A maple leaf outline in a 100 × 100 box, stem at the bottom. */
export const MAPLE_LEAF: Array<[number, number]> = [
  [50, 5], [43, 19], [36, 15], [39, 40], [26, 27], [24, 33], [13, 30], [17, 43], [11, 46], [30, 62],
  [27, 70], [47, 66], [48, 92], [52, 92], [53, 66], [73, 70], [70, 62], [89, 46], [83, 43], [87, 30],
  [76, 33], [74, 27], [61, 40], [64, 15], [57, 19],
];

/** Draws the Canadian flag (2:1, red-white-red with a red maple leaf) to fill a canvas. */
export function drawCanadianFlag(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const red = '#D52B1E';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = red;
  ctx.fillRect(0, 0, w / 4, h);
  ctx.fillRect((w * 3) / 4, 0, w / 4, h);
  const size = h * 0.8;
  const ox = w / 2 - size / 2;
  const oy = h / 2 - size / 2;
  ctx.beginPath();
  MAPLE_LEAF.forEach(([x, y], i) => {
    const px = ox + (x / 100) * size;
    const py = oy + (y / 100) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fill();
}
