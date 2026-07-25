import { useEffect, useState } from 'react'

import { CAMERAS, loadCameras } from '@/data/films'
import type { Camera } from '@/types'

export function useCameras() {
  // Start with static data instantly — no loading flash
  const [cameras, setCameras] = useState<Camera[]>(CAMERAS)

  useEffect(() => {
    let cancelled = false

    loadCameras().then((loaded) => {
      if (!cancelled) setCameras(loaded)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return cameras
}
