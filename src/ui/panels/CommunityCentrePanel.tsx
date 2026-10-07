import { Fragment, useState } from 'react';
import { community, type CommunityItem } from '../../data/portfolio';
import { Directory } from './Directory';

const tickets: CommunityItem[] = [...community.clubs, ...community.activities, ...community.service];

/** "Previously President · VP Internal · …", with the key role in bold. */
function Previously({ item }: { item: CommunityItem }) {
  if (!item.pastRoles?.length) return null;
  return (
    <span className="t-prev">
      Previously{' '}
      {item.pastRoles.map((r, i) => (
        <Fragment key={r.title}>
          {i > 0 && ' · '}
          {r.key ? <strong>{r.title}</strong> : r.title}
        </Fragment>
      ))}
    </span>
  );
}

/** Role history (most recent first) and the full story for one club. */
function TicketDetail({ item }: { item: CommunityItem }) {
  const ladder = [{ title: item.role, when: item.when, key: false }, ...(item.pastRoles ?? [])];
  return (
    <div className="ticket-detail" style={{ ['--tint' as string]: item.tint }}>
      <h3>
        {item.icon} {item.name}
      </h3>
      {ladder.length > 1 ? (
        <ol className="ladder" aria-label="Roles, most recent first">
          {ladder.map((r, i) => (
            <li key={r.title} className={`${i === 0 ? 'now' : ''}${r.key ? ' key' : ''}`}>
              {r.key ? <strong>{r.title}</strong> : <span className="ladder-title">{r.title}</span>}
              <span>{r.when}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="meta">
          {item.role}, {item.when}
        </p>
      )}
      {item.detail && <p className="body">{item.detail}</p>}
    </div>
  );
}

/** Clubs and community work as admission tickets; pick one to read its story. */
export function CommunityCentrePanel() {
  const [open, setOpen] = useState(0);

  if (tickets.length === 0) {
    return (
      <>
        <p className="body moving-in">Moving in soon. My clubs, activities and community work will be listed here.</p>
        <Directory from="community-centre" />
      </>
    );
  }

  return (
    <>
      <p className="lede">
        Outside class, this is where I spend my time: leading the clubs I care about and building things for my
        community. Pick a ticket to read more.
      </p>
      <ul className="tickets">
        {tickets.map((t, i) => (
          <li key={t.name}>
            <button
              className={`ticket${i === open ? ' on' : ''}`}
              aria-pressed={i === open}
              onClick={() => setOpen(i)}
              style={{ ['--tint' as string]: t.tint }}
            >
              <span className="t-main">
                <span className="t-eyebrow">Admit one · {t.when}</span>
                <span className="t-name">
                  {t.icon} {t.name}
                </span>
                <span className="t-role">{t.role}</span>
                <Previously item={t} />
              </span>
              <span className="t-stub">
                <strong>{t.headline.value}</strong>
                <span>{t.headline.label}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <TicketDetail key={tickets[open].name} item={tickets[open]} />
      <Directory from="community-centre" />
    </>
  );
}
