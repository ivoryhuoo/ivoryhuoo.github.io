import { useEffect, useState } from 'react';
import { travel, type Destination, type Region } from '../../data/portfolio';
import { prefersReducedMotion } from '../../lib/motion';
import { Directory } from './Directory';

const REGIONS: Array<'All' | Region> = ['All', 'Asia', 'Europe', 'Oceania', 'North America'];
const WIDTH = 13; // letters on each destination row
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const flight = (i: number) => `IH ${String(i + 1).padStart(3, '0')}`;

/** One split-flap tile: it flips through random letters, then lands on its own. */
function Flap({ char, delay }: { char: string; delay: number }) {
  const [shown, setShown] = useState(prefersReducedMotion() ? char : ' ');
  const [spin, setSpin] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(char);
      return;
    }
    const steps = 4 + Math.floor(Math.random() * 6);
    let n = 0;
    let id = window.setTimeout(function tick() {
      if (n >= steps) {
        setShown(char);
        return;
      }
      setShown(CHARS[Math.floor(Math.random() * CHARS.length)]);
      setSpin((k) => k + 1);
      n++;
      id = window.setTimeout(tick, 70);
    }, delay);
    return () => window.clearTimeout(id);
  }, [char, delay]);

  return (
    <span key={spin} className={`flap${spin ? ' spin' : ''}`}>
      {shown}
    </span>
  );
}

function FlapText({ text }: { text: string }) {
  const letters = text.toUpperCase().slice(0, WIDTH).padEnd(WIDTH, ' ');
  return (
    <span className="flaps" aria-hidden="true">
      {[...letters].map((c, i) => (
        <Flap key={i} char={c} delay={i * 25} />
      ))}
    </span>
  );
}

function useClock() {
  const read = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState(read);
  useEffect(() => {
    const id = window.setInterval(() => setTime(read()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

const statusOf = (d: Destination) => d.status ?? 'Visited';

/** A split-flap departures board: every place I've been, filterable by region. */
export function AirportPanel() {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>('All');
  const time = useClock();
  const rows = travel.destinations
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => region === 'All' || d.region === region);

  return (
    <>
      <p className="lede">{travel.intro}</p>
      <div className="region-pills" role="group" aria-label="Filter by region">
        {REGIONS.map((r) => (
          <button key={r} aria-pressed={r === region} onClick={() => setRegion(r)}>
            {r}
          </button>
        ))}
      </div>
      <div className="solari">
        <div className="solari-head">
          <span>Departures · {travel.destinations.length} places and counting</span>
          <span className="solari-clock">{time}</span>
        </div>
        <table>
          <caption className="sr-only">Places I've travelled to</caption>
          <thead>
            <tr>
              <th scope="col">Flight</th>
              <th scope="col">Destination</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody key={region}>
            {rows.map(({ d, i }) => (
              <tr key={d.name}>
                <td className="solari-flight">{flight(i)}</td>
                <td>
                  <span className="sr-only">{d.name}</span>
                  <FlapText text={d.name} />
                </td>
                <td className={`solari-status ${statusOf(d).toLowerCase()}`}>{statusOf(d)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Directory from="airport" />
    </>
  );
}
