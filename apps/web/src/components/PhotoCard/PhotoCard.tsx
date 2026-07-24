import { type CSSProperties, useState } from 'react'

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver.ts'
import type { Photo } from '@/types'

import { SkeletonCard } from '../SkeletonCard'

import styles from './PhotoCard.module.scss'

interface PhotoCardProps {
  photo: Photo
  index: number
  accent: string
  onClick: (index: number) => void
}

export function PhotoCard({ photo, index, accent, onClick }: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [ref, inView] = useIntersectionObserver<HTMLButtonElement>({ threshold: 0.1 })

  return (
    <button
      type="button"
      ref={ref}
      className={styles.card}
      onClick={() => onClick(index)}
      aria-label={`Open frame ${photo.frame}`}
    >
      {!loaded && <SkeletonCard />}

      {inView && (
        <img
          src={photo.thumb}
          alt={`Frame ${photo.frame}`}
          className={styles.image}
          style={{ display: loaded ? 'block' : 'none' }}
          onLoad={() => setLoaded(true)}
        />
      )}

      <div
        className={styles.overlay}
        style={
          {
            '--accent': accent,
          } as CSSProperties
        }
      />

      <span className={styles.frameNumber}>{photo.frame}</span>
    </button>
  )
}
