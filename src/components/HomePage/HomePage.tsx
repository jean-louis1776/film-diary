import { useMemo } from 'react'

import avatarUrl from '@/assets/me.jpg'
import { CameraSelector } from '@/components/CameraSelector'
import { CAMERAS } from '@/data/films.ts'
import { useFilmCategories } from '@/hooks/useFilmCategories'
import { useAppStore } from '@/store/useAppStore'

import { FilmCard } from '../FilmCard'

import styles from './HomePage.module.scss'

export function HomePage() {
  const { films } = useFilmCategories()
  const selectedCamera = useAppStore((s) => s.selectedCamera)
  const setSelectedCamera = useAppStore((s) => s.setSelectedCamera)

  const selectedCameraObj = CAMERAS.find((c) => c.id === selectedCamera) ?? null

  const visibleFilms = useMemo(
    () => films.filter((f) => f.camera === selectedCamera),
    [films, selectedCamera]
  )

  const totalFrames = useMemo(
    () => visibleFilms.reduce((sum, f) => sum + f.frameCount, 0),
    [visibleFilms]
  )

  const showEmpty = visibleFilms.length === 0

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <p className={styles.eyebrow}>FILM DIARY / 35MM / ILALEX</p>
        </div>

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
              <div className={styles.stat}>
                <span className={styles.statValue}>{visibleFilms.length}</span>
                <span className={styles.statLabel}>ROLLS</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{totalFrames}</span>
                <span className={styles.statLabel}>FRAMES</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{CAMERAS.length}</span>
                <span className={styles.statLabel}>TOTAL CAMERAS</span>
              </div>
            </div>
          </div>

          <div className={styles.avatarWrap}>
            <img src={avatarUrl} alt="Ilya Aleksin" className={styles.avatar} />
          </div>
        </div>
      </header>

      <div className={styles.sectionLabel}>
        <span>─── SELECT ROLL & CAMERA ───</span>
        <CameraSelector cameras={CAMERAS} selected={selectedCamera} onChange={setSelectedCamera} />
      </div>

      {showEmpty ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title>Camera</title>
              <rect
                x="14"
                y="8"
                width="20"
                height="32"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="10"
                y="14"
                width="4"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="34"
                y="14"
                width="4"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="10"
                y="28"
                width="4"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="34"
                y="28"
                width="4"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <p className={styles.emptyTitle}>No rolls yet</p>
          <p className={styles.emptySubtitle}>
            Nothing shot on the{' '}
            <span className={styles.emptyCamera}>{selectedCameraObj?.name}</span> has been developed
            and scanned yet.
            <br />
            Check back soon — film takes time.
          </p>
        </div>
      ) : (
        <main className={styles.grid}>
          {visibleFilms.map((film, i) => (
            <FilmCard key={`${film.camera}-${film.id}`} film={film} index={i} />
          ))}
        </main>
      )}

      <footer className={styles.footer}>
        <span className={styles.copyright}>
          @ANALOGUE ARCHIVE by ILALEX {new Date().getFullYear()}
        </span>
        <span className={styles.tagline}>shot on film</span>
      </footer>
    </div>
  )
}
