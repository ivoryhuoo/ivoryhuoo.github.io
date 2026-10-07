import { nowBuilding } from '../../data/portfolio';
import { Directory } from './Directory';

/** What I'm working on, as hazard-taped cards with a moving progress stripe. */
export function ConstructionPanel() {
  return (
    <>
      <p className="lede">What I'm building and learning right now. Last updated {nowBuilding.updated}.</p>
      <div className="hazard-cards">
        {nowBuilding.items.map((item) => {
          const incoming = item.status === 'incoming';
          return (
            <section className={`hazard-card${incoming ? ' incoming' : ''}`} key={item.title}>
              <div className="hazard-top">
                <h3>
                  <span aria-hidden="true">{item.icon}</span>{' '}
                  {incoming ? (
                    <>
                      Incoming<span className="dots" aria-hidden="true" />
                    </>
                  ) : (
                    item.title
                  )}
                </h3>
                <span className={`chip ${incoming ? 'chip-soon' : 'chip-wip'}`}>
                  {incoming ? 'Incoming' : 'In progress'}
                </span>
              </div>
              <p className="body">{item.detail}</p>
              {!incoming && (
                <div className="build-bar" role="img" aria-label="In progress">
                  <i />
                </div>
              )}
            </section>
          );
        })}
      </div>
      <Directory from="construction" />
    </>
  );
}
