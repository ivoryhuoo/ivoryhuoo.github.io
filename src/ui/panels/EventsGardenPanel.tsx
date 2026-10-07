import { useState } from 'react';
import { events, type PlannedEvent } from '../../data/portfolio';
import { asset } from '../../lib/assets';
import { Directory } from './Directory';

/** Seconds each photo takes to slide past; the whole loop scales with the photo count. */
const SECONDS_PER_PHOTO = 4;

/** Photos sliding left on a loop, like a carnival marquee. Hover to pause. */
function PhotoMarquee({ event }: { event: PlannedEvent }) {
  const photos = event.chapters.flatMap((c) => c.photos.map((file) => ({ file, title: c.title, caption: c.caption })));
  if (photos.length === 0) return null;
  // The list is drawn twice so the loop is seamless; the copy is hidden from screen readers.
  const row = (copy: boolean) =>
    photos.map((p) => (
      <li key={`${copy ? 'b' : 'a'}-${p.file}`} aria-hidden={copy || undefined}>
        <img src={asset(`events/${p.file}`)} alt={copy ? '' : `${p.title}: ${p.caption}`} loading="lazy" />
        <span>{p.title}</span>
      </li>
    ));
  return (
    <div className="marquee-photos" aria-label={`${event.name} photos`}>
      <ul style={{ ['--loop' as string]: `${photos.length * SECONDS_PER_PHOTO}s` }}>
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}

/** Events as sealed pink envelopes; opening one unfolds its photos and story below. */
export function EventsGardenPanel() {
  const [open, setOpen] = useState<number | null>(null);
  const e = open === null ? null : events.items[open];

  return (
    <>
      <p className="lede">{events.intro}</p>
      <div className="envelopes">
        {events.items.map((ev, i) => (
          <button
            key={ev.key}
            id={`env-${ev.key}`}
            aria-expanded={i === open}
            aria-controls="event-panel"
            className={`envelope${i === open ? ' open' : ''}`}
            onClick={() => setOpen(i === open ? null : i)}
          >
            <span className="env-flap" aria-hidden="true" />
            <span className="env-seal" aria-hidden="true">
              {ev.icon}
            </span>
            <span className="env-text">
              <strong>{ev.name}</strong>
              <span>{ev.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {e && (
        <div className="event-open" id="event-panel" role="region" aria-labelledby={`env-${e.key}`} key={e.key}>
          <PhotoMarquee event={e} />
          <ul className="event-stats">
            {e.stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="body">{e.summary}</p>
          <ul className={`tags${e.rolesOneLine ? ' tags-one-line' : ''}`} aria-label="My roles">
            {e.roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      <Directory from="events-garden" />
    </>
  );
}
