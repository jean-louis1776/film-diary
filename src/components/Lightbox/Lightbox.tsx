import { useEffect, useState } from 'react';
import type { Photo } from '../../types';
import { useKeyboard } from '../../hooks/useKeyboard';
import styles from './Lightbox.module.scss';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  accent: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({
  photos,
  currentIndex,
  accent,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const photo = photos[currentIndex];

  // Reset loaded state on photo change
  useEffect(() => {
    setImgLoaded(false);
  }, [currentIndex]);

  // Keyboard navigation
  useKeyboard({
    ArrowRight: onNext,
    ArrowLeft:  onPrev,
    Escape:     onClose,
  });

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const cssVars = { '--accent': accent } as React.CSSProperties;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* Close button */}
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close viewer"
        style={cssVars}
      >
        ×
      </button>

      <div
        className={styles.inner}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image area */}
        <div className={styles.imageWrap}>
          {!imgLoaded && (
            <div className={styles.skeleton} />
          )}
          <img
            key={photo.url}
            src={photo.url}
            alt={`Frame ${photo.frame}`}
            className={styles.image}
            style={{ display: imgLoaded ? 'block' : 'none' }}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Controls bar */}
        <div className={styles.controls} style={cssVars}>
          <button
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
  );
}
