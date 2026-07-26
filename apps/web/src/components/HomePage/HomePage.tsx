import { useMemo } from 'react'

import avatarUrl from '@/assets/me.jpg'
import { CameraSelector } from '@/components/CameraSelector'
import { FilmReel } from '@/components/FilmReel'
import { FullscreenLoader } from '@/components/FullscreenLoader'
import { useCameras } from '@/hooks/useCameras'
import { useFilmCategories } from '@/hooks/useFilmCategories'
import { useAppStore } from '@/store/useAppStore'

import { FilmCard } from '../FilmCard'

import styles from './HomePage.module.scss'

export function HomePage() {
  const { films, state } = useFilmCategories()
  const { cameras, state: camerasState } = useCameras()
  const selectedCamera = useAppStore((s) => s.selectedCamera)
  const setSelectedCamera = useAppStore((s) => s.setSelectedCamera)

  const selectedCameraObj = cameras.find((c) => c.id === selectedCamera) ?? null

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
      {/* Both requests hit the same backend — hold the overlay until both answer */}
      <FullscreenLoader visible={state === 'refreshing' || camerasState === 'refreshing'} />
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
                <span className={styles.statValue}>{cameras.length}</span>
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
        <CameraSelector cameras={cameras} selected={selectedCamera} onChange={setSelectedCamera} />
      </div>

      {showEmpty ? (
        <div className={styles.emptyState}>
          {/* Still strip — same mark as the loader, just not running */}
          <FilmReel className={styles.emptyReel} />
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
