import type { CSSProperties } from 'react'

import styles from './FilmReel.module.scss'

interface FilmReelProps {
  /** Advance the strip — used by the loader; still by default. */
  animated?: boolean
  /** Window width in whole frames. */
  frames?: number
  /** Resizes the whole mark, proportions kept. 1 = loader size. */
  scale?: number
  /** Tints the strip with the roll's accent colour. */
  accent?: string
  className?: string
}

/** Decorative 35mm strip: frames running between two rows of perforations. */
export function FilmReel({
  animated = false,
  frames = 3,
  scale = 1,
  accent,
  className,
}: FilmReelProps) {
  const style = {
    '--reel-frames': String(frames),
    '--reel-scale': String(scale),
    ...(accent && {
      '--reel-color': accent,
      // Frames sit well below the perforations, same as the default tokens
      '--reel-frame-color': `color-mix(in srgb, ${accent} 22%, transparent)`,
    }),
  } as CSSProperties

  const classes = [styles.strip, animated ? styles.running : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={style} aria-hidden="true">
      <div className={`${styles.holes} ${styles.holesTop}`} />
      <div className={styles.frames} />
      <div className={`${styles.holes} ${styles.holesBottom}`} />
    </div>
  )
}
