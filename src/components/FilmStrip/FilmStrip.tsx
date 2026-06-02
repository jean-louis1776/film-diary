import styles from './FilmStrip.module.scss'

interface FilmStripProps {
  accent: string
  frames?: number
}

const FRAME_IDS = [
  'frame-01',
  'frame-02',
  'frame-03',
  'frame-04',
  'frame-05',
  'frame-06',
  'frame-07',
  'frame-08',
  'frame-09',
  'frame-10',
  'frame-11',
  'frame-12',
] as const

export function FilmStrip({ accent, frames = 8 }: FilmStripProps) {
  return (
    <div className={styles.strip} aria-hidden="true">
      {FRAME_IDS.slice(0, frames).map((frameId) => (
        <div key={frameId} className={styles.frame} style={{ borderColor: accent }}>
          <span className={styles.hole} data-pos="tl" style={{ background: accent }} />
          <span className={styles.hole} data-pos="tr" style={{ background: accent }} />
          <span className={styles.hole} data-pos="bl" style={{ background: accent }} />
          <span className={styles.hole} data-pos="br" style={{ background: accent }} />
        </div>
      ))}
    </div>
  )
}
