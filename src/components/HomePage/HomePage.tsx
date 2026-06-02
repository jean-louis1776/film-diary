import avatarUrl from '@/assets/me.jpg'
import { FILM_CATEGORIES } from '@/data/films.ts'
import type { Theme } from '@/hooks/useTheme.ts'

import { FilmCard } from '../FilmCard'

import styles from './HomePage.module.scss'

const STATS = [
  { label: 'ROLLS', value: FILM_CATEGORIES.length },
  {
    label: 'FRAMES',
    value: FILM_CATEGORIES.reduce((sum, film) => sum + film.frameCount, 0),
  },
  { label: 'CAMERA', value: 'Minolta Hi-Matic AF2' },
] as const

interface HomePageProps {
  theme: Theme
  onToggleTheme: () => void
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        {/* ── Top bar: eyebrow + toggle ── */}
        <div className={styles.heroTop}>
          <p className={styles.eyebrow}>FILM DIARY / 35MM / ILALEX</p>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
            aria-pressed={theme === 'light'}
          >
            <span className={styles.toggleIcon} aria-hidden="true" />
            <span className={styles.toggleLabel}>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>
        </div>

        {/* ── Main identity row: text left / avatar right ── */}
        <div className={styles.identity}>
          <div className={styles.identityText}>
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
          </div>

          {/* Avatar — right side on desktop, below title on mobile */}
          <div className={styles.avatarWrap}>
            <img src={avatarUrl} alt="Ilya Aleksin" className={styles.avatar} />
          </div>
        </div>
      </header>

      {/* ── Section label ── */}
      <div className={styles.sectionLabel}>
        <span>SELECT ROLL ──────</span>
      </div>

      {/* ── Film grid ── */}
      <main className={styles.grid}>
        {FILM_CATEGORIES.map((film, i) => (
          <FilmCard key={film.id} film={film} index={i} />
        ))}
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={styles.copyright}>
          @ANALOGUE ARCHIVE by ILALEX {new Date().getFullYear()}
        </span>
        <span className={styles.tagline}>shot on film</span>
      </footer>
    </div>
  )
}
