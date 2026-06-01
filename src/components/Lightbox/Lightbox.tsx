import { useEffect, useState } from 'react'

import { useKeyboard } from '../../hooks/useKeyboard'
import type { Photo } from '../../types'

import styles from './Lightbox.module.scss'

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  accent: string
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function Lightbox({ photos, currentIndex, accent, onClose, onNext, onPrev }: LightboxProps) {
  const [loadedPhotoUrl, setLoadedPhotoUrl] = useState<string | null>(null)
  const photo = photos[currentIndex]
  const imgLoaded = loadedPhotoUrl === photo.url

  // Keyboard navigation
  useKeyboard({
    ArrowRight: onNext,
    ArrowLeft: onPrev,
    Escape: onClose,
  })

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const cssVars = { '--accent': accent } as React.CSSProperties
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
    >
      {/* Close button */}
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Close viewer"
        style={cssVars}
      >
        ×
      </button>

      <div className={styles.inner}>
        {/* Image area */}
        <div className={styles.imageWrap}>
          {!imgLoaded && <div className={styles.skeleton} />}
          <img
            key={photo.url}
            src={photo.url}
            alt={`Frame ${photo.frame}`}
            className={styles.image}
            style={{ display: imgLoaded ? 'block' : 'none' }}
            onLoad={() => setLoadedPhotoUrl(photo.url)}
          />
        </div>

        {/* Controls bar */}
        <div className={styles.controls} style={cssVars}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={onPrev}
            aria-label="Previous photo"
            style={cssVars}
          >
            ←
          </button>

          <span className={styles.counter}>
            FRAME {photo.frame} / {String(photos.length).padStart(2, '0')}
          </span>

          <button
            type="button"
            className={styles.navBtn}
            onClick={onNext}
            aria-label="Next photo"
            style={cssVars}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
