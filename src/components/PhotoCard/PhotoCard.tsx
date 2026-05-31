import { useState } from 'react';
import type { Photo } from '../../types';
import { SkeletonCard } from '../SkeletonCard';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './PhotoCard.module.scss';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  accent: string;
  onClick: (index: number) => void;
}

export function PhotoCard({ photo, index, accent, onClick }: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [ref, inView] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={styles.card}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`Open frame ${photo.frame}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(index)}
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
          } as React.CSSProperties
        }
      />

      <span className={styles.frameNumber}>{photo.frame}</span>
    </div>
  );
}
