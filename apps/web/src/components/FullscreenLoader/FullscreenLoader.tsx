import { useEffect, useState } from 'react'

import styles from './FullscreenLoader.module.scss'

const FADE_OUT_MS = 500

/**
 * Fullscreen "developing film" overlay shown while catalog data loads
 * (e.g. a sleeping backend waking up). Fades out and unmounts when done.
 */
export function FullscreenLoader({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(visible)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      return
    }

    const timer = window.setTimeout(() => setMounted(false), FADE_OUT_MS)
    return () => window.clearTimeout(timer)
  }, [visible])

  if (!mounted) return null

  return (
    <div className={`${styles.overlay} ${visible ? '' : styles.hidden}`} aria-hidden="true">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>FILM DIARY / 35MM / ILALEX</p>

        <div className={styles.filmstrip}>
          <div className={`${styles.holes} ${styles.holesTop}`} />
          <div className={styles.frames} />
          <div className={`${styles.holes} ${styles.holesBottom}`} />
        </div>

        <p className={styles.caption}>
          <em>Developing</em>
          <span className={styles.dots}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>

        <p className={styles.hint}>FILM TAKES TIME</p>
      </div>
    </div>
  )
}
