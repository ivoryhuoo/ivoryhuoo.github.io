import { useEffect, useRef, useState } from 'react';
import { arcadeGames, type ArcadeGame } from '../../data/portfolio';
import { arcadeArt, asset } from '../../lib/assets';
import { ITEMS, MOODS, SPECIES, splitTitle, spriteFor, spriteScale, type Mood, type Species } from '../arcade/sprites';
import { Directory } from './Directory';
import { Tags } from './Tags';

type GameId = ArcadeGame['id'];

/** A sprite, with the robot scaled up so all three heads line up. */
function Sprite({ species, mood, height, alt = '' }: { species: Species; mood: Mood; height: number; alt?: string }) {
  return (
    <img
      className={`pixel bob bob-${SPECIES.indexOf(species)}`}
      src={arcadeArt(spriteFor(species, mood))}
      alt={alt}
      style={{ height: `${height * spriteScale(species)}rem`, width: 'auto' }}
    />
  );
}

/** A title in capitals, with any emphasised part (the "AI" in waste awAI) highlighted. */
function GameTitle({ game }: { game: ArcadeGame }) {
  const [main, em] = splitTitle(game.name, game.emphasis);
  return (
    <>
      {main}
      {em && <span className="title-em">{em}</span>}
    </>
  );
}

/** What each cabinet's little screen shows before you press start. */
function ScreenPreview({ game }: { game: ArcadeGame }) {
  if (game.id === 'aftermath') {
    return (
      <span className="cab-trio">
        {SPECIES.map((s) => (
          <Sprite key={s} species={s} mood="Normal" height={5.6} />
        ))}
      </span>
    );
  }
  if (game.preview.image) {
    return <img className={`cab-image cab-image-${game.id}`} src={asset(`arcade/${game.preview.image}`)} alt="" />;
  }
  return <span className="cab-emoji">{game.preview.emoji}</span>;
}

/** Screenshots: one large, with thumbnails to switch when there's more than one. */
function Gallery({ shots }: { shots: NonNullable<ArcadeGame['gallery']> }) {
  const [i, setI] = useState(0);
  const shot = shots[i];
  return (
    <figure className={`gallery${shots.every((s) => s.file.startsWith('uplift')) ? ' gallery-phone' : ''}`}>
      <img className="gallery-main" src={asset(`arcade/${shot.file}`)} alt={shot.alt} />
      <figcaption>{shot.caption}</figcaption>
      {shots.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label="Screenshots">
          {shots.map((s, n) => (
            <button key={s.file} aria-pressed={n === i} aria-label={s.caption} onClick={() => setI(n)}>
              <img src={asset(`arcade/${s.file}`)} alt="" />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}

/** Aftermath Creatures: every character, a mood switcher, and the item set. */
function AftermathScreen() {
  const [mood, setMood] = useState<Mood>('Normal');
  return (
    <div className="aftermath">
      <div className="moods" role="radiogroup" aria-label="Mood">
        {MOODS.map((m) => (
          <button key={m} role="radio" aria-checked={m === mood} className={m === mood ? 'on' : ''} onClick={() => setMood(m)}>
            {m}
          </button>
        ))}
      </div>
      <div className="aftermath-grid">
        <ul className="characters">
          {SPECIES.map((s) => (
            <li key={s}>
              <Sprite species={s} mood={mood} height={8} alt={`${mood} ${s.toLowerCase()}`} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="item-shelf">
          <p className="px-label">ITEMS</p>
          <ul>
            {ITEMS.map((it) => (
              <li key={it.file}>
                <img className="pixel" src={arcadeArt(it.file)} alt="" />
                <span>{it.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** A cabinet's screen, zoomed in to fill the popup. */
function GameScreen({ game, onExit }: { game: ArcadeGame; onExit: () => void }) {
  const exit = useRef<HTMLButtonElement>(null);
  useEffect(() => exit.current?.focus(), []);
  return (
    <div className="game-screen" style={{ ['--cab' as string]: game.colors.text }}>
      <button ref={exit} className="exit" onClick={onExit}>
        ← EXIT
      </button>
      <h3 className="px-title" aria-label={game.name}>
        <GameTitle game={game} />
      </h3>
      {game.badge && <p className="game-badge">{game.badge}</p>}
      <p className="game-tagline">{game.tagline}</p>
      <p className="body">{game.blurb}</p>
      {game.features && (
        <ul className="features">
          {game.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      {game.stack.length > 0 && <Tags items={game.stack} />}
      {game.note && <p className="game-note">✏️ {game.note}</p>}
      {game.id === 'aftermath' && <AftermathScreen />}
      {game.gallery && <Gallery key={game.id} shots={game.gallery} />}
      {game.links && (
        <p className="game-links">
          {game.links.map((l) => (
            <a key={l.href} className={l.primary ? 'btn' : 'btn btn-small'} href={l.href} target="_blank" rel="noopener">
              {l.label} ↗
            </a>
          ))}
        </p>
      )}
    </div>
  );
}

export function ArcadePanel() {
  const [playing, setPlaying] = useState<GameId | null>(null);
  const game = arcadeGames.find((g) => g.id === playing);

  return (
    <>
      {game ? (
        <GameScreen game={game} onExit={() => setPlaying(null)} />
      ) : (
        <>
          <p className="lede">Welcome to the arcade! These are the side projects I've built for fun, from a pixel pet game to AI-powered apps. Pick a machine to take a look.</p>
          <div className="cabinets">
            {arcadeGames.map((g) => (
              <button
                key={g.id}
                className="cabinet-btn"
                aria-label={`Play ${g.name}`}
                onClick={() => setPlaying(g.id)}
                style={{ ['--body' as string]: g.colors.body, ['--marquee' as string]: g.colors.marquee, ['--marquee-text' as string]: g.colors.text }}
              >
                <span className="marquee">
                  <GameTitle game={g} />
                </span>
                <span className="cab-body">
                  <span className="cab-screen">
                    <ScreenPreview game={g} />
                  </span>
                  <span className="cab-controls" aria-hidden="true">
                    <span className="stick" />
                    <span className="cab-buttons">
                      <i />
                      <i />
                    </span>
                  </span>
                </span>
                <span className="press-start">PRESS START</span>
              </button>
            ))}
          </div>
        </>
      )}
      <Directory from="arcade" />
    </>
  );
}
