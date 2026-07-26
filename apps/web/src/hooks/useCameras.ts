import { useEffect, useState } from 'react'

import { CAMERAS, loadCameras } from '@/data/films'
import type { Camera } from '@/types'

import type { LoadState } from './useFilmCategories'

export function useCameras() {
  // Start with static data instantly — no loading flash
  const [cameras, setCameras] = useState<Camera[]>(CAMERAS)
  const [state, setState] = useState<LoadState>('refreshing')

  useEffect(() => {
    let cancelled = false

    loadCameras().then((loaded) => {
      if (!cancelled) {
        setCameras(loaded)
        setState('ready')
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { cameras, state }
}
