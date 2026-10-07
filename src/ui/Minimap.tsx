import { useEffect, useRef, useState } from 'react';
import { BUILDINGS, type BuildingId } from '../data/buildings';
import { rectToWorld } from '../data/placement';
import { ROAD_TILES, RUNWAY } from '../data/roads';
import { useWorld } from '../state/useWorld';
import { player } from '../world/player';
import { callTaxi, taxi } from '../world/taxi';
import { GRASS_HALF, ISLAND } from '../world/land';
import { FEATURES } from '../world/scenery/scenery';

// The map frames the whole island with a little sea around it.
const PAD = 5;
const VB = {
  x: Math.floor(ISLAND.minX - PAD),
  y: Math.floor(ISLAND.minZ - PAD),
  w: Math.ceil(ISLAND.maxX - ISLAND.minX + PAD * 2),
  h: Math.ceil(ISLAND.maxZ - ISLAND.minZ + PAD * 2),
};

/** Every building gets the same size tile on the map, centred on its footprint. */
const TILE = 13;
const places = BUILDINGS.filter((b) => b.status === 'open').map((b) => {
  const f = rectToWorld(b, b.footprint);
  const cx = (f.minX + f.maxX) / 2;
  const cz = (f.minZ + f.maxZ) / 2;
  return { b, r: { minX: cx - TILE / 2, minZ: cz - TILE / 2, maxX: cx + TILE / 2, maxZ: cz + TILE / 2 } };
});

/** A name label shown above a building on hover, kept inside the map's edges. */
function MapTip({ place }: { place: (typeof places)[number] }) {
  const { b, r } = place;
  const w = b.name.length * 4.6 + 9;
  const cx = Math.min(VB.x + VB.w - w / 2 - 1, Math.max(VB.x + w / 2 + 1, (r.minX + r.maxX) / 2));
  const above = r.minZ - 14 > VB.y;
  const y = above ? r.minZ - 13 : r.maxZ + 2;
  return (
    <g className="map-tip" pointerEvents="none">
      <rect x={cx - w / 2} y={y} width={w} height={11} rx={5.5} />
      <text x={cx} y={y + 5.7} textAnchor="middle" dominantBaseline="central">
        {b.name}
      </text>
    </g>
  );
}

/** Corner map. Choosing a building calls a taxi that drives you there. */
export function Minimap() {
  const [open, setOpen] = useState(() => typeof window === 'undefined' || window.innerWidth > 640);
  const me = useRef<SVGCircleElement>(null);
  const cab = useRef<SVGRectElement>(null);
  const riding = useWorld((s) => s.riding);
  const [hover, setHover] = useState<BuildingId | null>(null);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = () => {
      me.current?.setAttribute('cx', String(player.position.x));
      me.current?.setAttribute('cy', String(player.position.z));
      if (cab.current) {
        cab.current.setAttribute('x', String(taxi.x - 2.25));
        cab.current.setAttribute('y', String(taxi.z - 2.25));
        cab.current.style.display = taxi.visible ? '' : 'none';
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const go = (id: BuildingId) => {
    if (!riding) callTaxi(id);
  };

  return (
    <div className={`plate minimap${open ? '' : ' closed'}`}>
      <div className="minimap-head">
        <span>{riding ? 'Taxi on the way…' : 'Map: pick a stop for a taxi'}</span>
        <button className="linkish" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'Map'}
        </button>
      </div>
      {open && (
        <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} role="group" aria-label="Town map: the streets make a heart">
          <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} rx={6} className="map-sea" />
          <rect x={ISLAND.minX} y={ISLAND.minZ} width={ISLAND.maxX - ISLAND.minX} height={ISLAND.maxZ - ISLAND.minZ} rx={3} className="map-sand" />
          <rect x={-GRASS_HALF} y={-GRASS_HALF} width={GRASS_HALF * 2} height={GRASS_HALF * 2} rx={2} className="map-grass" />
          <circle cx={FEATURES.lake.x} cy={FEATURES.lake.z} r={FEATURES.lake.r} className="map-pond" />
          {ROAD_TILES.map((t, i) => (
            <rect key={i} x={t.x} y={t.z} width={t.w} height={t.d} className="map-road" />
          ))}
          <rect x={RUNWAY.x} y={RUNWAY.z} width={RUNWAY.w} height={RUNWAY.d} className="map-runway" />
          {places.map(({ b, r }) => (
            <g
              key={b.id}
              className="map-place"
              role="button"
              tabIndex={0}
              aria-label={`Take a taxi to ${b.name}`}
              onClick={() => go(b.id)}
              onMouseEnter={() => setHover(b.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(b.id)}
              onBlur={() => setHover(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  go(b.id);
                }
              }}
            >
              <title>{b.name}</title>
              <rect x={r.minX} y={r.minZ} width={TILE} height={TILE} rx={2.5} />
              <text x={(r.minX + r.maxX) / 2} y={(r.minZ + r.maxZ) / 2} textAnchor="middle" dominantBaseline="central">
                {b.icon}
              </text>
            </g>
          ))}
          <rect ref={cab} width={4.5} height={4.5} rx={1.2} className="map-taxi" style={{ display: 'none' }} />
          <circle ref={me} r={3} className="map-me" />
          {hover && <MapTip place={places.find((p) => p.b.id === hover)!} />}
        </svg>
      )}
    </div>
  );
}
