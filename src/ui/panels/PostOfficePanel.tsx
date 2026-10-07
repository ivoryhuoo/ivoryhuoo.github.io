import { useState } from 'react';
import { links, RESUME_FILE } from '../../data/portfolio';
import { asset } from '../../lib/assets';
import { Directory } from './Directory';

const email = links.find((l) => l.label === 'Email');
const ADDRESS = email?.href.replace('mailto:', '') ?? '';
const socials = links.filter((l) => l.label !== 'Email');
const SUBJECT = encodeURIComponent('Hello from your website');

/** Ways to start an email, so nobody gets stuck with an app they don't use. */
const MAIL_OPTIONS = [
  { label: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${ADDRESS}&su=${SUBJECT}` },
  { label: 'Outlook', href: `https://outlook.office.com/mail/deeplink/compose?to=${ADDRESS}&subject=${SUBJECT}` },
];

const ENVELOPES = [
  { key: 'email', name: 'Email', icon: '✉️', sub: 'Say hello' },
  { key: 'resume', name: 'Resume', icon: '📄', sub: 'Take a copy' },
  { key: 'socials', name: 'Socials', icon: '🔗', sub: 'LinkedIn · GitHub' },
] as const;
type Key = (typeof ENVELOPES)[number]['key'];

function CopyButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button className="glass-pill" onClick={copy} aria-live="polite">
      {copied ? 'Copied!' : 'Copy address'}
    </button>
  );
}

/** Contact as three sealed envelopes, styled like the Events Garden's. */
export function PostOfficePanel() {
  const [open, setOpen] = useState<Key | null>(null);

  return (
    <>
      <p className="lede">Contact me or take a copy of my resume. I'd love to hear from you 😊</p>
      <div className="envelopes">
        {ENVELOPES.map((env) => (
          <button
            key={env.key}
            id={`po-${env.key}`}
            aria-expanded={env.key === open}
            aria-controls="po-letter"
            className={`envelope${env.key === open ? ' open' : ''}`}
            onClick={() => setOpen(env.key === open ? null : env.key)}
          >
            <span className="env-flap" aria-hidden="true" />
            <span className="env-seal" aria-hidden="true">
              {env.icon}
            </span>
            <span className="env-text">
              <strong>{env.name}</strong>
              <span>{env.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div className="letter" id="po-letter" role="region" aria-labelledby={`po-${open}`} key={open}>
          {open === 'email' && (
            <>
              <p>
                Write to me at <strong>{ADDRESS}</strong>. Open it in:
              </p>
              <div className="glass-pills">
                {MAIL_OPTIONS.map((o) => (
                  <a key={o.label} className="glass-pill" href={o.href} target="_blank" rel="noopener">
                    {o.label}
                  </a>
                ))}
                <CopyButton />
              </div>
            </>
          )}
          {open === 'resume' && (
            <div className="glass-pills">
              <a className="glass-pill" href={asset(RESUME_FILE)} download>
                Download my resume
              </a>
            </div>
          )}
          {open === 'socials' && (
            <>
              <p>Connect with me on other platforms!</p>
              <div className="glass-pills">
                {socials.map((l) => (
                  <a key={l.label} className="glass-pill" href={l.href} target="_blank" rel="noopener">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <Directory from="post-office" />
    </>
  );
}
