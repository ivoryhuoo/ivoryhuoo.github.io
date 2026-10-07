import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { PALETTE } from '../../palette';
import { TOWER_BASE_Y } from '../builders/campus';
import { Sign } from './Sign';

function paintClock(canvas: HTMLCanvasElement, now: Date) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const s = canvas.width;
  const c = s / 2;
  ctx.clearRect(0, 0, s, s);
  ctx.fillStyle = PALETTE.westernPurple;
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = '#FFFDF5';
  ctx.beginPath();
  ctx.arc(c, c, s * 0.44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2A2340';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(c + Math.sin(a) * s * 0.36, c - Math.cos(a) * s * 0.36, s * 0.018, 0, Math.PI * 2);
    ctx.fill();
  }
  const hand = (angle: number, length: number, width: number) => {
    ctx.strokeStyle = '#2A2340';
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.sin(angle) * length, c - Math.cos(angle) * length);
    ctx.stroke();
  };
  const m = now.getMinutes();
  const h = (now.getHours() % 12) + m / 60;
  hand((h / 12) * Math.PI * 2, s * 0.22, s * 0.04);
  hand((m / 60) * Math.PI * 2, s * 0.32, s * 0.025);
}

/** A clock face that shows the visitor's real local time. */
function Clock() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    paintClock(canvas, new Date());
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => {
    const id = window.setInterval(() => {
      paintClock(texture.image as HTMLCanvasElement, new Date());
      texture.needsUpdate = true;
    }, 30_000);
    return () => window.clearInterval(id);
  }, [texture]);
  return (
    <mesh position={[0, TOWER_BASE_Y + 2.8, -2.98]}>
      <planeGeometry args={[2.6, 2.6]} />
      <meshStandardMaterial map={texture} roughness={0.5} />
    </mesh>
  );
}

export function CampusExtras() {
  return (
    <>
      <Sign text="Campus" position={[0, 7.6, -1.97]} size={[15, 1.4]} bg={PALETTE.westernPurple} fg="#FFFFFF" />
      <Clock />
    </>
  );
}
