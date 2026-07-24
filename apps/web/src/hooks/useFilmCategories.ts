import { useEffect, useState } from 'react'

import { FILM_CATEGORIES, loadFilmCategories } from '@/data/films'
import type { FilmCategory } from '@/types'

export type LoadState = 'ready' | 'refreshing'

export function useFilmCategories() {
  // Start with static data instantly — no loading flash
  const [films, setFilms] = useState<FilmCategory[]>(FILM_CATEGORIES)
  const [state, setState] = useState<LoadState>('refreshing')

  useEffect(() => {
    let cancelled = false

    loadFilmCategories().then((cats) => {
      if (!cancelled) {
        setFilms(cats)
        setState('ready')
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { films, state }
}
