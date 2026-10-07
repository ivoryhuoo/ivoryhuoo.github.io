import { welcome } from '../../data/portfolio';
import { Directory } from './Directory';

export function WelcomePanel() {
  return (
    <>
      {welcome.paragraphs.map((p) => (
        <p className="lede" key={p}>
          {p}
        </p>
      ))}
      <Directory from="welcome" title="Where to go" searchable />
    </>
  );
}
