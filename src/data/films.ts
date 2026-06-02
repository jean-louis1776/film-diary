import type { Camera, FilmCategory, Photo } from '@/types'

export const CDN = 'https://ik.imagekit.io/ilalex'

// ── Cameras (Minolta always first) ────────────────────────────────────────────
export const CAMERAS: Camera[] = [
  { id: 'minolta-af2', name: 'Minolta Hi-Matic AF2', shortName: 'MINOLTA AF2' },
  { id: 'sprocket-rocket', name: 'Lomography Sprocket Rocket', shortName: 'SPROCKET ROCKET' },
  { id: 'lomomatic-110', name: 'Lomography Lomomatic 110', shortName: 'LOMOMATIC 110' },
  { id: 'yashica-mat-124g', name: 'Yashica Mat-124G', shortName: 'YASHICA MAT-124G' },
]

// ── Film categories ───────────────────────────────────────────────────────────
// Structure on CDN: rolls/{camera.id}/{film.id}/{frame}.jpg
export const FILM_CATEGORIES: FilmCategory[] = [
  // ── Minolta Hi-Matic AF2 ─────────────────────────────────────────────────
  {
    id: 'ilford-hp5-plus',
    name: 'Ilford HP5 Plus',
    iso: 'ISO 400',
    description: 'Fine grain, smooth midtones, wide latitude — the pushable classic',
    accent: '#C8C4BC',
    bg: '#0C0C0C',
    tag: 'B&W · CLASSIC · ISO 400',
    frameCount: 7,
    camera: 'minolta-af2',
  },
  {
    id: 'ilford-kentmere-400',
    name: 'Ilford Kentmere Pan',
    iso: 'ISO 400',
    description: 'Stronger contrast, visible grain, raw gritty street character',
    accent: '#A09890',
    bg: '#0A0A0A',
    tag: 'B&W · GRITTY · ISO 400',
    frameCount: 5,
    camera: 'minolta-af2',
  },
  {
    id: 'kodak-ultramax-400',
    name: 'Kodak Ultramax',
    iso: 'ISO 400',
    description: 'Vivid, punchy colors — bold blues, lush greens, warm skin tones',
    accent: '#E8A23A',
    bg: '#15100A',
    tag: 'COLOR · DAYLIGHT · ISO 400',
    frameCount: 4,
    camera: 'minolta-af2',
  },
  {
    id: 'lomography-cn400',
    name: 'Lomography Color Neg',
    iso: 'ISO 400',
    description: 'Vintage muted palette, slight brownish warmth, noisy grain',
    accent: '#C4607A',
    bg: '#120810',
    tag: 'COLOR · VINTAGE · ISO 400',
    frameCount: 8,
    camera: 'minolta-af2',
  },
  {
    id: 'orwo-wolfen-nc400',
    name: 'ORWO Wolfen NC400',
    iso: 'ISO 400',
    description: 'Vibrant greens, desaturated shadows, cool cast — unlike anything else',
    accent: '#6BAF7C',
    bg: '#080F0A',
    tag: 'COLOR · COOL TONES · ISO 400',
    frameCount: 6,
    camera: 'minolta-af2',
  },

  // ── Lomography Sprocket Rocket ────────────────────────────────────────────
  // (no rolls yet)

  // ── Lomography Lomomatic 110 ──────────────────────────────────────────────
  // (no rolls yet)

  // ── Yashica Mat-124G ─────────────────────────────────────────────────────
  // (no rolls yet)
]

// ── Fallback for useFilmCategories hook ──────────────────────────────────────
export const FILM_CATEGORIES_FALLBACK = FILM_CATEGORIES

// ── Photo URL builder ─────────────────────────────────────────────────────────
export function getPhotosForFilm(filmId: string, frameCount: number, cameraId: string): Photo[] {
  return Array.from({ length: frameCount }, (_, i) => {
    const frame = String(i + 1)
    const url = `${CDN}/rolls/${cameraId}/${filmId}/${frame}.jpg`
    return {
      id: `${cameraId}-${filmId}-${frame}`,
      url,
      thumb: url,
      width: 800,
      height: 600,
      frame,
      keyword: filmId,
    }
  })
}

// ── Dynamic loader (reads manifest.json from CDN) ─────────────────────────────
// manifest.json lives at: https://ik.imagekit.io/ilalex/rolls/manifest.json
// Format:
// {
//   "minolta-af2": { "kodak-ultramax-400": 4, "ilford-hp5-plus": 7 },
//   "sprocket-rocket": { "lomography-cn400": 12 }
// }
//
// When manifest is present, frameCount values are taken from it (so you never
// need to edit this file when adding new shots). Falls back to FILM_CATEGORIES.

type Manifest = Record<string, Record<string, number>>

export async function loadFilmCategories(): Promise<FilmCategory[]> {
  try {
    const res = await fetch(`${CDN}/rolls/manifest.json`, { cache: 'no-cache' })
    if (!res.ok) return FILM_CATEGORIES

    const manifest: Manifest = await res.json()

    // Merge manifest frame counts into static category list
    return FILM_CATEGORIES.map((film) => {
      const count = manifest[film.camera]?.[film.id]
      return count !== undefined ? { ...film, frameCount: count } : film
    })
  } catch {
    return FILM_CATEGORIES
  }
}
