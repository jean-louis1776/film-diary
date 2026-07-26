import { useEffect, useState } from 'react'

import { FilmReel } from '@/components/FilmReel'

import styles from './FullscreenLoader.module.scss'

const FADE_OUT_MS = 500

/** Locks page scroll while the overlay is up, without the scrollbar-width jump. */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement: html } = document
    const gap = window.innerWidth - html.clientWidth
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
    }

    // html + body: body alone still lets iOS Safari drag the page behind
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    return () => {
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      body.style.paddingRight = prev.bodyPadding
    }
  }, [locked])
}

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

  // Held through the fade-out too, so the page can't scroll under the overlay
  useScrollLock(mounted)

  if (!mounted) return null

  return (
    <div className={`${styles.overlay} ${visible ? '' : styles.hidden}`} aria-hidden="true">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>FILM DIARY / 35MM / ILALEX</p>

        <FilmReel animated />

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
