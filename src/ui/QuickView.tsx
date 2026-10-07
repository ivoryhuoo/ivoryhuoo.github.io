import { useEffect, useRef } from 'react';
import {
  arcadeGames,
  caseStudies,
  community,
  education,
  events,
  links,
  profile,
  RESUME_FILE,
  roles,
  skills,
  travel,
} from '../data/portfolio';
import { asset } from '../lib/assets';
import { useWorld } from '../state/useWorld';

/**
 * Everything on one plain page, for recruiters in a hurry, screen readers and
 * computers without 3D graphics. Open it with the HUD button or by visiting
 * the site with #quick on the end of the URL.
 */
export function QuickView({ forced = false }: { forced?: boolean }) {
  const on = useWorld((s) => s.quickView);
  const setQuickView = useWorld((s) => s.setQuickView);
  const heading = useRef<HTMLHeadingElement>(null);
  const visible = on || forced;

  useEffect(() => {
    if (!visible) return;
    heading.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !forced) setQuickView(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, forced, setQuickView]);

  if (!visible) return null;
  const leadership = [...community.clubs, ...community.activities, ...community.service];

  return (
    <div className="quick" role="dialog" aria-modal="true" aria-labelledby="quick-name">
      <div className="quick-page">
        <div className="quick-bar">
          {!forced && (
            <button className="btn" onClick={() => setQuickView(false)}>
              Back to the world
            </button>
          )}
          <a className="btn btn-plain" href={asset(RESUME_FILE)} download>
            Download PDF resume
          </a>
          <button className="btn btn-plain" onClick={() => window.print()}>
            Print
          </button>
        </div>

        <header className="quick-head">
          <img className="quick-photo" src={asset('ivory.jpg')} alt="Ivory Huo" />
          <h1 id="quick-name" ref={heading} tabIndex={-1}>
            {profile.name}
          </h1>
          <p>
            {profile.program}, {profile.school}. Graduating {profile.graduation}.
          </p>
          <ul className="quick-links">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <section>
          <h2>Experience</h2>
          {roles.map((r) => (
            <article key={`${r.org}-${r.when}`}>
              <div className="quick-row">
                <h3>
                  {r.title}, {r.org}
                </h3>
                <span>{r.when}</span>
              </div>
              {r.highlights.length > 0 && (
                <ul>
                  {r.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              {r.stack.length > 0 && <p className="quick-stack">{r.stack.join(', ')}</p>}
            </article>
          ))}
        </section>

        <section>
          <h2>Product case studies</h2>
          {caseStudies.map((c) => (
            <article key={c.name}>
              <h3>{c.name}</h3>
              <p>
                {c.problem} {c.approach} {c.result} {c.lesson ?? ''}
              </p>
            </article>
          ))}
        </section>

        <section>
          <h2>Projects</h2>
          {arcadeGames.map((p) => (
            <article key={p.name}>
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
              {p.stack.length > 0 && <p className="quick-stack">{p.stack.join(', ')}</p>}
            </article>
          ))}
        </section>

        {leadership.length > 0 && (
          <section>
            <h2>Leadership and community</h2>
            {leadership.map((c) => (
              <article key={c.name}>
                <div className="quick-row">
                  <h3>
                    {c.role}, {c.name}
                  </h3>
                  {c.when && <span>{c.when}</span>}
                </div>
                {c.pastRoles && <p className="quick-stack">Previously {c.pastRoles.map((r) => `${r.title} (${r.when})`).join(', ')}</p>}
                {c.detail && <p>{c.detail}</p>}
              </article>
            ))}
          </section>
        )}

        <section>
          <h2>Education</h2>
          <article>
            <div className="quick-row">
              <h3>
                {profile.program}, {profile.school}
              </h3>
              <span>Expected {profile.graduation}</span>
            </div>
            <p>
              GPA {education.gpa}.{' '}
              {education.honours.map((h) => (h.detail ? `${h.title} (${h.detail})` : h.title)).join(', ')}.{' '}
              Scholarships: {education.scholarships.awards.map((a) => a.title).join(' and ')} ({education.scholarships.note.charAt(0).toLowerCase() + education.scholarships.note.slice(1)}).
            </p>
            <p>Relevant courses: {education.courses.join(', ')}.</p>
            <p>
              {education.thesis.title}: {education.thesis.detail}
            </p>
          </article>
        </section>

        <section>
          <h2>Events</h2>
          {events.items.map((e) => (
            <article key={e.name}>
              <h3>{e.name}</h3>
              <p>{e.summary}</p>
            </article>
          ))}
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="quick-skills">
            {skills.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>Travel</h2>
          <p>{travel.destinations.map((d) => (d.status ? `${d.name} (${d.status.toLowerCase()})` : d.name)).join(', ')}.</p>
        </section>
      </div>
    </div>
  );
}
