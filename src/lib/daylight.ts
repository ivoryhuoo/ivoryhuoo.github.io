export type TimeMode = 'auto' | 'day' | 'night';

/** 1 is full daylight, 0 is night. Auto follows the visitor's local clock. */
export function daylight(mode: TimeMode, now = new Date()): number {
  if (mode === 'day') return 1;
  if (mode === 'night') return 0;
  const h = now.getHours() + now.getMinutes() / 60;
  if (h >= 7 && h < 18) return 1;
  if (h >= 18 && h < 20) return 1 - (h - 18) / 2;
  if (h >= 5 && h < 7) return (h - 5) / 2;
  return 0;
}

function parse(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  return '#' + [m(ar, br), m(ag, bg), m(ab, bb)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

const NIGHT = '#0E1A33';
const DUSK = '#F2A97A';
const DAY = '#A9DBF5';

export function skyColor(d: number): string {
  return d > 0.5 ? mixHex(DUSK, DAY, (d - 0.5) * 2) : mixHex(NIGHT, DUSK, d * 2);
}
