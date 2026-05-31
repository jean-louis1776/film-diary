import { FILM_CATEGORIES } from '../../data/films';
import { FilmCard } from '../FilmCard';
import styles from './HomePage.module.scss';

const STATS = [
  { label: 'ROLLS',  value: FILM_CATEGORIES.length },
  {
    label: 'FRAMES',
    value: FILM_CATEGORIES.reduce((acc, f) => acc + f.count, 0),
  },
  { label: 'YEAR', value: '2026' },
] as const;

export function HomePage() {
  return (
    <div className={styles.page}>
      {/* ── Hero header ── */}
      <header className={styles.hero}>
        <p className={styles.eyebrow}>FILM DIARY / 35MM / ILALEX</p>

        <h1 className={styles.title}>
          <em>Analogue</em>
          <br />
          Archive
        </h1>

        <p className={styles.subtitle}>
          A digital diary of Ilya Aleksin's shots on 35mm film.
          <br />
          Each roll a different world.
        </p>

        <div className={styles.stats}>
          {STATS.map(({ label, value }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Section label ── */}
      <div className={styles.sectionLabel}>
        <span>SELECT ROLL ──────</span>
      </div>

      {/* ── Film grid ── */}
      <main className={styles.grid}>
        {FILM_CATEGORIES.map((film, i) => (
          <FilmCard
            key={film.id}
            film={film}
            index={i}
          />
        ))}
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={styles.copyright}>@ANALOGUE ARCHIVE by ILALEX {new Date().getFullYear()}</span>
        <span className={styles.tagline}>shot on film</span>
      </footer>
    </div>
  );
}
