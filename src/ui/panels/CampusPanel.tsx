import { useState } from 'react';
import { education, profile, schoolCards, type SchoolCard } from '../../data/portfolio';
import { asset } from '../../lib/assets';
import { useWorld } from '../../state/useWorld';
import { callTaxi } from '../../world/taxi';
import { Directory } from './Directory';

const TABS = ['Relevant Courses', 'Thesis', 'Honours'] as const;
type Tab = (typeof TABS)[number];

/** One student card: logo and role along the top, photo and name, GPA at the bottom. */
function StudentCard({ card }: { card: SchoolCard }) {
  return (
    <div className={`id-card id-${card.theme}`} aria-label={`${card.school} student card`}>
      <div className={`id-band${card.logoOnWhite ? ' on-white' : ''}`}>
        <img src={asset(card.logo)} alt={card.school} />
        <span className="id-role">
          <span>{card.role}</span>
          <strong>{card.line}</strong>
        </span>
      </div>
      <div className="id-body">
        <img src={asset('ivory.jpg')} alt={profile.name} />
        <div>
          <p className="id-name">{profile.name}</p>
          <p>{card.detail}</p>
        </div>
      </div>
      <p className="id-gpa">
        <span>GPA</span>
        <strong>{card.gpa}</strong>
      </p>
    </div>
  );
}

/** Student cards (Western, NUS) next to a binder with tabs for courses, thesis and honours. */
export function CampusPanel() {
  const [tab, setTab] = useState<Tab>('Relevant Courses');
  const [cardId, setCardId] = useState(schoolCards[0].id);
  const card = schoolCards.find((c) => c.id === cardId) ?? schoolCards[0];
  const close = useWorld((s) => s.closeBuilding);

  return (
    <>
      <div className="campus">
        <div className="wallet">
          <div className="wallet-switch" role="group" aria-label="Student cards">
            {schoolCards.map((c) => (
              <button key={c.id} aria-pressed={c.id === cardId} onClick={() => setCardId(c.id)}>
                {c.short}
              </button>
            ))}
          </div>
          <StudentCard key={card.id} card={card} />
        </div>

        <div className="binder">
          <div className="binder-tabs" role="tablist" aria-label="School">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                id={`campus-tab-${t.replace(' ', '-')}`}
                aria-selected={t === tab}
                aria-controls="campus-panel"
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="binder-page" id="campus-panel" role="tabpanel" aria-labelledby={`campus-tab-${tab.replace(' ', '-')}`}>
            {tab === 'Relevant Courses' && (
              <ul>
                {education.courses.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
            {tab === 'Thesis' && (
              <>
                <p className="binder-title">{education.thesis.title}</p>
                <p>{education.thesis.detail}</p>
              </>
            )}
            {tab === 'Honours' && (
              <>
                <ul className="honours">
                  {education.honours.map((h) => (
                    <li key={h.title}>
                      <span className="honour">
                        {h.icon} {h.title}
                      </span>
                      {h.detail && <span className="honour-detail">{h.detail}</span>}
                    </li>
                  ))}
                  <li>
                    <span className="honour-group">
                      {education.scholarships.awards.map((a) => (
                        <span key={a.title} className="honour">
                          {a.icon} {a.title}
                        </span>
                      ))}
                    </span>
                    <span className="honour-detail">{education.scholarships.note}</span>
                  </li>
                </ul>
                {education.hackathons.length > 0 && (
                  <>
                    <p className="binder-title">Hackathons</p>
                    <ul>
                      {education.hackathons.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="link-card">
        <span className="dir-icon" aria-hidden="true">
          🤝
        </span>
        <p>My clubs and leadership live at the Community Centre.</p>
        <button
          className="btn btn-small"
          onClick={() => {
            close();
            callTaxi('community-centre');
          }}
        >
          Taxi →
        </button>
      </div>

      <Directory from="campus" />
    </>
  );
}
