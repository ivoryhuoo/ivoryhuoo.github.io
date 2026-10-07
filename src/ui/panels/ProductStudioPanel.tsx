import { useState } from 'react';
import { caseStudies } from '../../data/portfolio';
import { Directory } from './Directory';

const STEPS = [
  ['problem', 'The gap'],
  ['approach', 'The approach'],
  ['shipped', 'What I shipped'],
  ['result', 'The result'],
] as const;

/**
 * Case studies as a design file: a layers list (with each project's impact)
 * on the left, and the selected project as a board of sticky notes.
 */
export function ProductStudioPanel() {
  const [current, setCurrent] = useState(0);
  const c = caseStudies[current];

  return (
    <>
      <p className="lede">
        Every project here started with a problem someone was living with. Pick one to see how I spotted it and what
        changed after.
      </p>
      <div className="studio">
        <div className="layers" role="tablist" aria-label="Case studies">
          <p className="layers-title" aria-hidden="true">
            Layers
          </p>
          {caseStudies.map((cs, i) => (
            <button
              key={cs.name}
              role="tab"
              id={`layer-${i}`}
              aria-selected={i === current}
              aria-controls="studio-board"
              className="layer"
              onClick={() => setCurrent(i)}
            >
              <span className="layer-icon" aria-hidden="true">
                {cs.icon}
              </span>
              <span className="layer-text">
                <strong>{cs.short}</strong>
                <span>{cs.headline}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="studio-canvas" id="studio-board" role="tabpanel" aria-labelledby={`layer-${current}`}>
          <h3>{c.name}</h3>
          <p className="frame-meta">{c.context}</p>
          <ol className="stickies" key={c.name}>
            {STEPS.map(([key, label], i) => (
              <li key={key} className={`sticky sticky-${i + 1}`}>
                <b>
                  {i + 1} · {label}
                </b>
                {c[key]}
              </li>
            ))}
          </ol>
          {c.lesson && (
            <p className="lesson">
              <b>What I learned:</b> {c.lesson}
            </p>
          )}
        </div>
      </div>
      <Directory from="product-studio" />
    </>
  );
}
