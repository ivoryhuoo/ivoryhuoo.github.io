import { useEffect, useState } from 'react';
import { dataCentre, roles, skills } from '../../data/portfolio';
import { prefersReducedMotion } from '../../lib/motion';
import { sfx } from '../../lib/sound';
import { useWorld } from '../../state/useWorld';
import { Directory } from './Directory';
import { Tags } from './Tags';

const skillCount = skills.reduce((n, g) => n + g.items.length, 0);
const BOOT = [
  'booting ivory.os',
  `mounting ${roles.length} racks ... ok`,
  `installing ${skillCount} skills ... ok`,
  'all systems online',
];

const play = (effect: keyof typeof sfx) => {
  if (useWorld.getState().sound) sfx[effect]();
};

/** A number that counts up from zero once `run` is true. */
function Counter({ value, suffix, run }: { value: number; suffix: string; run: boolean }) {
  const [shown, setShown] = useState(prefersReducedMotion() ? value : 0);
  useEffect(() => {
    if (!run || prefersReducedMotion()) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 900);
      setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return (
    <>
      {shown}
      {suffix}
    </>
  );
}

export function DataCentrePanel() {
  const [lines, setLines] = useState(prefersReducedMotion() ? BOOT.length : 0);
  const [on, setOn] = useState<Record<string, boolean>>({});
  const sound = useWorld((s) => s.sound);
  const toggleSound = useWorld((s) => s.toggleSound);
  const booted = lines >= BOOT.length;

  // Boot sequence: one terminal line at a time.
  useEffect(() => {
    if (booted) return;
    const id = window.setTimeout(() => {
      setLines((n) => n + 1);
      play(lines + 1 === BOOT.length ? 'ready' : 'boot');
    }, lines === 0 ? 200 : 380);
    return () => window.clearTimeout(id);
  }, [lines, booted]);

  const isUnlocked = (role?: string) => !role || !!on[role];
  const unlocked = dataCentre.achievements.filter((a) => isUnlocked(a.role)).length;

  const toggleRack = (id: string) => {
    const next = !on[id];
    setOn((s) => ({ ...s, [id]: next }));
    play(next ? 'powerOn' : 'powerOff');
    if (next && dataCentre.achievements.some((a) => a.role === id)) play('unlock');
  };
  const allOn = roles.every((r) => on[r.id]);
  const powerAll = () => {
    setOn(Object.fromEntries(roles.map((r) => [r.id, !allOn])));
    if (allOn) play('powerOff');
    else {
      play('powerOn');
      play('unlock');
    }
  };

  return (
    <>
      <div className="terminal" aria-live="polite">
        <div className="terminal-bar">
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <button className="sound-btn" aria-pressed={sound} onClick={toggleSound}>
            {sound ? '🔊 Sound on' : '🔈 Sound off'}
          </button>
        </div>
        {BOOT.slice(0, lines).map((l, i) => (
          <p key={l} className={i === BOOT.length - 1 ? 'ok' : ''}>
            <span aria-hidden="true">&gt; </span>
            {l}
          </p>
        ))}
        {!booted && (
          <p>
            <span className="cursor" aria-hidden="true" />
            <button className="linkish skip" onClick={() => setLines(BOOT.length)}>
              Skip
            </button>
          </p>
        )}
      </div>

      {booted && (
        <div className="dc-body">
          <ul className="scoreboard">
            {dataCentre.stats.map((s) => (
              <li key={s.label}>
                <span className="score-num" aria-hidden="true">
                  <Counter value={s.value} suffix={s.suffix} run={booted} />
                </span>
                <span className="sr-only">
                  {s.value}
                  {s.suffix}
                </span>
                <span className="score-label">{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="dc-row">
            <h3 className="list-label">Server racks</h3>
            <button className="linkish" onClick={powerAll}>
              {allOn ? 'Power off all' : 'Power on all'}
            </button>
          </div>
          <p className="dc-hint">Each rack is a role. Power one on to see what I built there.</p>
          {roles.map((r) => {
            const isOn = !!on[r.id];
            return (
              <section key={r.id} className={`server${isOn ? ' on' : ''}`}>
                <button className="server-head" aria-expanded={isOn} aria-controls={`rack-${r.id}`} onClick={() => toggleRack(r.id)}>
                  <span className="leds" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="dir-text">
                    <strong>{r.title}</strong>
                    <span>
                      {r.org}, {r.when}
                    </span>
                  </span>
                  <span className="server-state">{isOn ? 'Online' : 'Power on'}</span>
                </button>
                {isOn && (
                  <div className="server-body" id={`rack-${r.id}`}>
                    {r.highlights.length > 0 && (
                      <ul className="highlights">
                        {r.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    )}
                    {r.stack.length > 0 && <Tags items={r.stack} />}
                  </div>
                )}
              </section>
            );
          })}

          <h3 className="list-label section-head">
            Achievements · {unlocked}/{dataCentre.achievements.length} unlocked
          </h3>
          <ul className="badges">
            {dataCentre.achievements.map((a) => {
              const got = isUnlocked(a.role);
              const role = roles.find((r) => r.id === a.role);
              return (
                <li key={a.title} className={got ? 'got' : 'locked'}>
                  <span className="badge-icon" aria-hidden="true">
                    {got ? a.icon : '🔒'}
                  </span>
                  <span className="dir-text">
                    <strong>{got ? a.title : 'Locked'}</strong>
                    <span>{got ? a.detail : `Power on ${role ? `${role.title} (${role.when})` : 'a rack'} to unlock`}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <h3 className="list-label section-head">Installed skills</h3>
          <dl className="skills">
            {skills.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <Directory from="data-centre" />
    </>
  );
}
