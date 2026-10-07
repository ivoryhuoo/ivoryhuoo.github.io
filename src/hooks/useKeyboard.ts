import { useEffect, useRef, type MutableRefObject } from 'react';
import { useWorld, ZOOM } from '../state/useWorld';

export type KeyState = Record<string, boolean | undefined>;

/** Tracks held keys for movement, and handles one-shot keys (enter, zoom). */
export function useKeyboard(): MutableRefObject<KeyState> {
  const keys = useRef<KeyState>({});

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const world = useWorld.getState();
      if (world.open || world.quickView || world.riding) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;
      const key = e.key.toLowerCase();

      if ((key === 'e' || key === 'enter') && world.nearby) {
        if (key === 'enter' && target?.closest('button, a')) return;
        e.preventDefault();
        keys.current = {};
        world.openBuilding(world.nearby);
        return;
      }
      if (key === '+' || key === '=') return world.zoomBy(-ZOOM.step);
      if (key === '-' || key === '_') return world.zoomBy(ZOOM.step);

      keys.current[key] = true;
      if (key.startsWith('arrow')) e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    const reset = () => {
      keys.current = {};
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', reset);
    };
  }, []);

  return keys;
}
