import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FILM_CATEGORIES, generateMockPhotos } from '../../data/films';
import { FilmStrip } from '../FilmStrip';
import { PhotoCard } from '../PhotoCard';
import { Lightbox } from '../Lightbox';
import styles from './GalleryView.module.scss';

export function GalleryView() {
  const { filmId } = useParams<{ filmId: string }>();
  const navigate   = useNavigate();

  const film = FILM_CATEGORIES.find((f) => f.id === filmId);

  // Unknown film id → go home
  if (!film) {
    navigate('/', { replace: true });
    return null;
  }

  return <GalleryContent film={film} />;
}

// ─── Inner component (avoids early-return hook rule violation) ───────────────
import type { FilmCategory } from '../../types';

function GalleryContent({ film }: { film: FilmCategory }) {
  const navigate = useNavigate();

  const photos = useMemo(
    () => generateMockPhotos(film.id, film.count),
    [film.id, film.count],
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : 0));
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + photos.length) % photos.length : 0,
    );
  }, [photos.length]);

  const cssVars = { '--accent': film.accent } as React.CSSProperties;

  return (
    <div className={styles.page}>
      {/* ── Sticky header ── */}
      <header className={styles.header} style={cssVars}>
        <div className={styles.headerLeft}>
          <button
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
              {film.iso} · {film.count} FRAMES
            </p>
          </div>
        </div>
        <FilmStrip accent={film.accent} />
      </header>

      {/* ── Photo grid ── */}
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

      {/* ── Lightbox ── */}
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
  );
}
