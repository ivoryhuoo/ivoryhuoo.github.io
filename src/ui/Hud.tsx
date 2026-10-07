import { useWorld } from '../state/useWorld';

export function Hud() {
  const openBuilding = useWorld((s) => s.openBuilding);
  const setQuickView = useWorld((s) => s.setQuickView);
  return (
    <>
      <header className="plate title">
        <h1>Ivory's City</h1>
        <p>
          Click any building to step inside, take a taxi from the map, or{' '}
          <button className="linkish" onClick={() => openBuilding('city-hall')}>
            open the town directory
          </button>
          .
        </p>
        <button className="btn btn-small quick-btn" onClick={() => setQuickView(true)}>
          Quick view: one-page resume
        </button>
      </header>

      <div className="plate hint" role="note">
        <span className="hint-mouse">
          Walk with WASD or the arrow keys, or click the ground. Drag or swipe sideways to turn. Scroll or
          pinch to zoom.
        </span>
        <span className="hint-touch">Tap the ground to walk. Drag to turn, pinch to zoom.</span>
      </div>
    </>
  );
}
