import { useId, useState } from 'react';
import type { BuildingId } from '../../data/buildings';
import { searchBuildings } from '../../lib/search';
import { callTaxi } from '../../world/taxi';

/** Type to find a building; pick one to take a taxi there. */
export function BuildingSearch({ from }: { from: BuildingId }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const results = searchBuildings(query, from);
  const open = query.trim().length > 0;

  const choose = (id: BuildingId) => {
    setQuery('');
    callTaxi(id);
  };

  return (
    <div className="search">
      <input
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && results[active] ? `${listId}-${results[active].id}` : undefined}
        aria-label="Search the city"
        placeholder="Search the city: resume, projects, travel…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === 'Enter' && results[active]) {
            e.preventDefault();
            choose(results[active].id);
          } else if (e.key === 'Escape' && query) {
            e.preventDefault();
            e.stopPropagation();
            setQuery('');
          }
        }}
      />
      {open && (
        <ul className="search-list" id={listId} role="listbox" aria-label="Matching places">
          {results.length === 0 && <li className="search-empty">Nothing matches "{query}".</li>}
          {results.map((b, i) => (
            <li
              key={b.id}
              id={`${listId}-${b.id}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'on' : ''}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(b.id)}
            >
              <span className="dir-icon" aria-hidden="true">
                {b.icon}
              </span>
              <span className="dir-text">
                <strong>{b.name}</strong>
                <span>{b.summary}</span>
              </span>
              <span className="search-go" aria-hidden="true">
                Taxi →
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
