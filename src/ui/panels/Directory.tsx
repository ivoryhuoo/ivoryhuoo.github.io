import { BUILDINGS, type BuildingId } from '../../data/buildings';
import { useWorld } from '../../state/useWorld';
import { callTaxi } from '../../world/taxi';
import { BuildingSearch } from './BuildingSearch';

interface Props {
  from: BuildingId;
  title?: string;
  /** Show the longer "what's inside" description instead of the one-liner. */
  detailed?: boolean;
  /** Show a search box above the list. */
  searchable?: boolean;
}

/** From any building: one button that opens City Hall's full directory. */
function ExploreMore() {
  const openBuilding = useWorld((s) => s.openBuilding);
  return (
    <button className="explore-more" onClick={() => openBuilding('city-hall')}>
      <span className="dir-icon" aria-hidden="true">
        🏙️
      </span>
      <span className="dir-text">
        <strong>Explore more of my city</strong>
        <span>See every building in City Hall's directory</span>
      </span>
      <span className="explore-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

/**
 * City Hall and the welcome sign list every other open building, each with a
 * taxi button. Every other building shows a single "Explore more" button.
 */
export function Directory({ from, title = 'Around town', detailed = false, searchable = false }: Props) {
  if (from !== 'city-hall' && from !== 'welcome') return <ExploreMore />;
  const others = BUILDINGS.filter((b) => b.kind === 'building' && b.status === 'open' && b.id !== from);
  if (others.length === 0) return null;

  return (
    <>
      <h3 className="list-label">{title}</h3>
      {searchable && <BuildingSearch from={from} />}
      <ul className={`directory${from === 'city-hall' ? ' one-col' : ''}`}>
        {others.map((b) => (
          <li key={b.id}>
            <span className="dir-icon" aria-hidden="true">
              {b.icon}
            </span>
            <div className="dir-text">
              <strong>{b.name}</strong>
              <span>{detailed ? b.inside : b.summary}</span>
            </div>
            <button className="btn btn-small" aria-label={`Take a taxi to ${b.name}`} onClick={() => callTaxi(b.id)}>
              Taxi →
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
