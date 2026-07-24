import { useState } from 'react'

const STORAGE_KEY = 'film-diary:camera'

function readStored(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? 'minolta-af2'
  } catch {
    return 'minolta-af2'
  }
}

function writeStored(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {}
}

export function useCameraStore() {
  const [selectedCamera, setSelectedCameraState] = useState<string>(readStored)

  const setSelectedCamera = (id: string) => {
    writeStored(id)
    setSelectedCameraState(id)
  }

  return { selectedCamera, setSelectedCamera }
}
