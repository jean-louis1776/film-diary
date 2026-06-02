import { type CSSProperties, useRef, useState } from 'react'

import type { Camera } from '@/types'

import styles from './CameraSelector.module.scss'

interface CameraSelectorProps {
  cameras: Camera[]
  selected: string | null
  onChange: (cameraId: string) => void
}

export function CameraSelector({ cameras, selected, onChange }: CameraSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedCamera = cameras.find((c) => c.id === selected)
  const label = selectedCamera ? selectedCamera.name : 'ALL CAMERAS'

  const handleBlur = (e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }

  const select = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: dropdown container
    <div ref={ref} className={styles.root} onBlur={handleBlur} role="group">
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className={styles.icon} viewBox="0 0 18 14" fill="none" aria-hidden="true">
          <rect x="1" y="3" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M5.5 3V2.5C5.5 1.95 5.95 1.5 6.5 1.5h5c.55 0 1 .45 1 1V3"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor" />
        </svg>

        <span className={styles.label}>{label}</span>

        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox" aria-label="Select camera">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              type="button"
              role="option"
              aria-selected={selected === camera.id}
              className={`${styles.option} ${selected === camera.id ? styles.optionActive : ''}`}
              onClick={() => select(camera.id)}
            >
              <span
                className={styles.optionDot}
                style={
                  {
                    '--dot-color': selected === camera.id ? '#c8a060' : 'var(--color-text-faint)',
                  } as CSSProperties
                }
              />
              <span className={styles.optionName}>{camera.name}</span>
              {selected === camera.id && (
                <svg className={styles.check} viewBox="0 0 10 8" fill="none" aria-hidden="true">
                  <path
                    d="M1 4l3 3 5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
