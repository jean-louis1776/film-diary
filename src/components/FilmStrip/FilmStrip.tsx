import styles from './FilmStrip.module.scss';

interface FilmStripProps {
  accent: string;
  frames?: number;
}

export function FilmStrip({ accent, frames = 8 }: FilmStripProps) {
  return (
    <div className={styles.strip} aria-hidden="true">
      {Array.from({ length: frames }).map((_, i) => (
        <div
          key={i}
          className={styles.frame}
          style={{ borderColor: accent }}
        >
          {/* sprocket holes — top-left, top-right, bottom-left, bottom-right */}
          <span className={styles.hole} data-pos="tl" style={{ background: accent }} />
          <span className={styles.hole} data-pos="tr" style={{ background: accent }} />
          <span className={styles.hole} data-pos="bl" style={{ background: accent }} />
          <span className={styles.hole} data-pos="br" style={{ background: accent }} />
        </div>
      ))}
    </div>
  );
}
