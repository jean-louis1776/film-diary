import { type CSSProperties, useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getPhotosForFilm } from '@/data/films.ts'
import { useFilmCategories } from '@/hooks/useFilmCategories'
import type { FilmCategory } from '@/types'

import { FilmStrip } from '../FilmStrip'
import { Lightbox } from '../Lightbox'
import { PhotoCard } from '../PhotoCard'

import styles from './GalleryView.module.scss'

export function GalleryView() {
  const { filmId, cameraId } = useParams<{ filmId: string; cameraId: string }>()
  const navigate = useNavigate()
  const { films, state } = useFilmCategories()

  // Wait for films to load before deciding to redirect
  if (state === 'refreshing') return null

  const film = films.find((f) => f.id === filmId && f.camera === cameraId)

  if (!film) {
    navigate('/', { replace: true })
    return null
  }

  return <GalleryContent film={film} />
}

function GalleryContent({ film }: { film: FilmCategory }) {
  const navigate = useNavigate()

  const photos = useMemo(
    () => getPhotosForFilm(film.id, film.frameCount, film.camera),
    [film.id, film.frameCount, film.camera]
  )

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : 0))
  }, [photos.length])

  const handlePrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : 0))
  }, [photos.length])

  const cssVars = { '--accent': film.accent } as CSSProperties

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInner} style={cssVars}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => navigate('/')}
              aria-label="Back to home"
            >
              ← BACK
            </button>
            <div className={styles.divider} aria-hidden="true" />
            <div>
              <h1 className={styles.title}>{film.name}</h1>
              <p className={styles.meta}>
                {film.iso} · {film.frameCount} FRAMES
              </p>
            </div>
          </div>
          <FilmStrip accent={film.accent} />
        </div>
      </div>

      <main className={styles.grid}>
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            accent={film.accent}
            onClick={setLightboxIndex}
          />
        ))}
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          accent={film.accent}
          onClose={() => setLightboxIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  )
}
