import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { player, rig } from './player';
import { useWorld } from '../state/useWorld';
import { prefersReducedMotion } from '../lib/motion';

const INTRO_DISTANCE = 70;
const DRAG_THRESHOLD = 6;

/** Safari's trackpad pinch event (not in the standard DOM types). */
type GestureEvent = Event & { scale: number };

/**
 * Third-person follow camera.
 * Turn: click-and-drag left/right, one-finger drag on touch, or two-finger swipe sideways on a trackpad.
 * Zoom: mouse wheel, two-finger scroll up/down, trackpad pinch (Chrome, Firefox, Edge send this as
 * ctrl+wheel; Safari sends gesture events), two-finger pinch on touch, +/− keys or the on-screen buttons.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const still = prefersReducedMotion();
  const distance = useRef(still ? useWorld.getState().zoom : INTRO_DISTANCE);
  const settled = useRef(still);
  const desired = useMemo(() => new Vector3(), []);
  const focus = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const el = gl.domElement;
    const world = () => useWorld.getState();
    const pointers = new Map<number, { x: number; y: number }>();
    let startX = 0;
    let startY = 0;
    let startYaw = 0;
    let pinchStart = 0;
    let zoomStart = 0;
    let gestureZoom = 0;

    const spread = () => {
      const [a, b] = [...pointers.values()];
      return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    };
    const restartDrag = () => {
      const [p] = [...pointers.values()];
      if (!p) return;
      startX = p.x;
      startY = p.y;
      startYaw = rig.yaw;
    };

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        rig.moved = false;
        restartDrag();
      } else if (pointers.size === 2) {
        rig.moved = true;
        pinchStart = spread();
        zoomStart = world().zoom;
      }
    };
    const onMove = (e: PointerEvent) => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      p.x = e.clientX;
      p.y = e.clientY;
      if (pointers.size === 1) {
        const dx = e.clientX - startX;
        if (Math.hypot(dx, e.clientY - startY) > DRAG_THRESHOLD) rig.moved = true;
        if (rig.moved) rig.yaw = startYaw - dx * 0.008;
      } else if (pointers.size === 2 && pinchStart > 0) {
        const now = spread();
        if (now > 0) world().setZoom((zoomStart * pinchStart) / now);
      }
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 1) restartDrag();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      if (e.ctrlKey) {
        // Trackpad pinch in Chrome, Firefox and Edge
        world().setZoom(world().zoom * Math.exp(dy * 0.01));
      } else if (Math.abs(dx) > Math.abs(dy)) {
        // Two-finger swipe sideways turns the camera
        rig.yaw += dx * 0.004;
      } else {
        world().setZoom(world().zoom * Math.exp(dy * 0.0015));
      }
    };

    // Trackpad pinch in Safari
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gestureZoom = world().zoom;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const scale = (e as GestureEvent).scale;
      if (scale > 0) world().setZoom(gestureZoom / scale);
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('gesturestart', onGestureStart);
    el.addEventListener('gesturechange', onGestureChange);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('gesturestart', onGestureStart);
      el.removeEventListener('gesturechange', onGestureChange);
    };
  }, [gl]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const zoom = useWorld.getState().zoom;
    // Slow swoop-in on load, then snappy response to zooming.
    const rate = settled.current ? 8 : 1.6;
    distance.current += (zoom - distance.current) * (1 - Math.exp(-dt * rate));
    if (Math.abs(zoom - distance.current) < 0.5) settled.current = true;

    const d = distance.current;
    const { x, z } = player.position;
    desired.set(x + Math.sin(rig.yaw) * d, d * 0.72, z + Math.cos(rig.yaw) * d);
    camera.position.lerp(desired, 1 - Math.exp(-dt * 6));
    focus.set(x, 2.4, z);
    camera.lookAt(focus);
  });

  return null;
}
