import { type CSSProperties, useState } from 'react'
import { Link } from 'react-router-dom'

import type { FilmCategory } from '@/types'

import styles from './FilmCard.module.scss'

interface FilmCardProps {
  film: FilmCategory
  index: number
}

export function FilmCard({ film, index }: FilmCardProps) {
  const [hovered, setHovered] = useState(false)

  const cssVars = {
    '--accent': film.accent,
    '--accent-faint': `${film.accent}22`,
    '--accent-hover': `${film.accent}55`,
    '--accent-glow': `${film.accent}12`,
    '--card-bg': film.bg,
    '--animation-delay': `${index * 80}ms`,
  } as CSSProperties

  return (
    <Link to={`/film/${film.id}`} className={styles.link} aria-label={`Open ${film.name} gallery`}>
      <article
        className={styles.card}
        style={cssVars}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Ambient glow in corner */}
        <div className={styles.glow} aria-hidden="true" />

        <span className={styles.tag}>{film.tag}</span>

        <h2 className={styles.name}>{film.name}</h2>

        <p className={styles.description}>{film.description}</p>

        <footer className={styles.footer}>
          <div className={styles.frameCount}>
            <span className={styles.frameNumber}>{String(film.frameCount).padStart(2, '0')}</span>
            <span className={styles.frameLabel}>FRAMES</span>
          </div>

          <span className={styles.cta} aria-hidden="true">
            OPEN ROLL {hovered ? '→' : '·'}
          </span>
        </footer>
      </article>
    </Link>
  )
}
