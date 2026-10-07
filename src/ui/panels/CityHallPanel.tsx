import { links } from '../../data/portfolio';
import { Directory } from './Directory';

export function CityHallPanel() {
  return (
    <>
      <p className="lede">City Hall keeps the map of town. Here's every building and what's inside it.</p>
      <Directory from="city-hall" title="Town directory" detailed searchable />

      <h3>Find me</h3>
      <ul className="links">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
