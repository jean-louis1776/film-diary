import { type CSSProperties, type MouseEvent, useEffect, useState } from 'react'

import { useKeyboard } from '@/hooks/useKeyboard.ts'
import type { Photo } from '@/types'

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
  const [displayedUrl, setDisplayedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const photo = photos[currentIndex]

  useKeyboard({
    ArrowRight: onNext,
    ArrowLeft: onPrev,
    Escape: onClose,
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    const img = new Image()
    img.onload = () => {
      setDisplayedUrl(photo.url)
      setLoading(false)
    }
    img.onerror = () => {
      setDisplayedUrl(photo.url)
      setLoading(false)
    }
    img.src = photo.url
  }, [photo.url])

  const cssVars = { '--accent': accent } as CSSProperties
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
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
        <div className={styles.imageWrap}>
          {displayedUrl === null ? (
            <div className={styles.skeleton} />
          ) : (
            <>
              <img
                key={displayedUrl}
                src={displayedUrl}
                alt={`Frame ${photo.frame}`}
                className={styles.image}
              />
              {loading && <div className={styles.loadingBar} style={cssVars} />}
            </>
          )}
        </div>

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
