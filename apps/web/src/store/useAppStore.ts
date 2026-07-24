import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  selectedCamera: string
  setSelectedCamera: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCamera: 'minolta-af2',
      setSelectedCamera: (id) => set({ selectedCamera: id }),
    }),
    {
      name: 'film-diary-store', // localStorage key
    }
  )
)
