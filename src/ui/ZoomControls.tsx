import { useWorld, ZOOM } from '../state/useWorld';

const TIME_ICON = { auto: '🕒', day: '☀️', night: '🌙' } as const;
const TIME_LABEL = { auto: 'matching your clock', day: 'day', night: 'night' } as const;
/** Hover / focus hints; each one also says what the next click does. */
const TIME_TIP = {
  auto: 'Time: following your clock. Click for daytime',
  day: 'Time: always day. Click for night',
  night: 'Time: always night. Click to follow your clock',
} as const;

export function ZoomControls() {
  const zoom = useWorld((s) => s.zoom);
  const zoomBy = useWorld((s) => s.zoomBy);
  const timeMode = useWorld((s) => s.timeMode);
  const cycleTime = useWorld((s) => s.cycleTime);
  return (
    <div className="plate zoom" role="group" aria-label="View controls">
      <button className="zoom-btn" data-tip="Zoom in: take a closer look" aria-label="Zoom in" disabled={zoom <= ZOOM.min} onClick={() => zoomBy(-ZOOM.step)}>
        +
      </button>
      <button className="zoom-btn" data-tip="Zoom out: see more of the city" aria-label="Zoom out" disabled={zoom >= ZOOM.max} onClick={() => zoomBy(ZOOM.step)}>
        −
      </button>
      <button
        className="zoom-btn time-btn"
        aria-label={`Time of day: ${TIME_LABEL[timeMode]}. Click to change.`}
        data-tip={TIME_TIP[timeMode]}
        onClick={cycleTime}
      >
        <span aria-hidden="true">{TIME_ICON[timeMode]}</span>
      </button>
    </div>
  );
}
