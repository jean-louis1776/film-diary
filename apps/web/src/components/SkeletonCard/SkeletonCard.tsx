import styles from './SkeletonCard.module.scss'

export function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.shimmer} />
    </div>
  )
}
