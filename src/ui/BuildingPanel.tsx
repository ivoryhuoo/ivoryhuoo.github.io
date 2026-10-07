import { useEffect, useRef } from 'react';
import { BUILDINGS, getBuilding } from '../data/buildings';
import { useWorld } from '../state/useWorld';
import { PANELS } from './panels';
import { asset } from '../lib/assets';

const planned = BUILDINGS.filter((b) => b.status === 'planned').map((b) => b.name);
const plannedText =
  planned.length === 0
    ? ''
    : `Under construction: ${planned.length === 1 ? planned[0] : `${planned.slice(0, -1).join(', ')} and ${planned[planned.length - 1]}`}.`;

/** The modal that opens when you enter a building. Content comes from ./panels. */
export function BuildingPanel() {
  const open = useWorld((s) => s.open);
  const close = useWorld((s) => s.closeBuilding);
  const ref = useRef<HTMLDialogElement>(null);

  // Opened as a non-modal dialog, so the minimap and HUD stay clickable while it's open.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.show();
      dialog.scrollTop = 0;
      dialog.focus();
    }
    if (!open && dialog.open) dialog.close();
    // Switching straight to another building (e.g. "Explore more"): start at the top.
    if (open && dialog.open) dialog.scrollTop = 0;
  }, [open]);

  // Clicking anywhere outside the popup takes you back to the world. The HUD,
  // zoom buttons and minimap don't count, so they still work with it open.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || ref.current?.contains(t) || t.closest('.plate, .enter, .quick')) return;
      close();
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const building = open ? getBuilding(open) : null;
  const Content = open ? PANELS[open] : undefined;

  return (
    <dialog ref={ref} className="panel" aria-labelledby="panel-title" tabIndex={-1} onClose={close}>
      {building?.hero ? (
        <div className="panel-hero">
          <img src={asset(building.hero.photo)} alt={building.hero.alt} />
          <div>
            <p className="hey">{building.hero.kicker}</p>
            <h2 id="panel-title">{building.name}</h2>
          </div>
        </div>
      ) : (
        building && (
          <h2 id="panel-title" className="panel-title">
            <span className="title-icon" aria-hidden="true">
              {building.icon}
            </span>
            {building.name}
          </h2>
        )
      )}
      {Content ? <Content /> : <p className="lede">{building?.summary}</p>}
      <div className="panel-foot">
        <p>{plannedText}</p>
        <button className="btn" onClick={close}>
          Back to the world
        </button>
      </div>
    </dialog>
  );
}
