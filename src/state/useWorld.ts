import { create } from 'zustand';
import type { BuildingId } from '../data/buildings';
import type { TimeMode } from '../lib/daylight';

/** Camera distance from the player, in stud units. Smaller is closer. */
export const ZOOM = { min: 12, max: 90, initial: 26, step: 4 } as const;

const clampZoom = (z: number) => Math.min(ZOOM.max, Math.max(ZOOM.min, z));
const TIME_ORDER: TimeMode[] = ['auto', 'day', 'night'];

interface WorldState {
  nearby: BuildingId | null;
  open: BuildingId | null;
  zoom: number;
  riding: boolean;
  quickView: boolean;
  timeMode: TimeMode;
  /** Sound effects, off until the visitor turns them on. */
  sound: boolean;
  setNearby: (id: BuildingId | null) => void;
  openBuilding: (id: BuildingId) => void;
  closeBuilding: () => void;
  setZoom: (zoom: number) => void;
  zoomBy: (delta: number) => void;
  setRiding: (riding: boolean) => void;
  setQuickView: (on: boolean) => void;
  cycleTime: () => void;
  toggleSound: () => void;
}

export const useWorld = create<WorldState>()((set, get) => ({
  nearby: null,
  open: null,
  zoom: ZOOM.initial,
  riding: false,
  quickView: false,
  timeMode: 'auto',
  sound: true,
  setNearby: (nearby) => set({ nearby }),
  openBuilding: (open) => set({ open }),
  closeBuilding: () => set({ open: null }),
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  zoomBy: (delta) => set({ zoom: clampZoom(get().zoom + delta) }),
  setRiding: (riding) => set({ riding }),
  setQuickView: (quickView) => set({ quickView, open: null }),
  toggleSound: () => set({ sound: !get().sound }),
  cycleTime: () => set({ timeMode: TIME_ORDER[(TIME_ORDER.indexOf(get().timeMode) + 1) % TIME_ORDER.length] }),
}));
