import type { Camera, FilmCategory, Photo } from '@/types'

export const CDN = import.meta.env.VITE_CDN_URL ?? 'https://ik.imagekit.io/ilalex'

// Public read-only API (apps/api). Empty → static/manifest fallback only.
const API = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

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
    accent: '#C2C5CE',
    bg: '#080A0D',
    tag: 'B&W · CLASSIC · ISO 400',
    frameCount: 7,
    camera: 'minolta-af2',
  },
  {
    id: 'ilford-kentmere-400',
    name: 'Ilford Kentmere Pan',
    iso: 'ISO 400',
    description: 'Stronger contrast, visible grain, raw gritty street character',
    accent: '#AFA290',
    bg: '#100D09',
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

// rolls/catalog.json — full catalog published by the admin panel on every
// content change. Photo URLs are built client-side from object keys, so the
// file works with any CDN base.
interface CatalogPhoto {
  frame: number
  key: string
  width: number
  height: number
}

interface CatalogFilm extends Omit<FilmCategory, 'photos'> {
  photos: CatalogPhoto[]
}

interface Catalog {
  version: number
  cameras: Camera[]
  films: CatalogFilm[]
}

let catalogPromise: Promise<Catalog | null> | null = null

function loadCatalog(): Promise<Catalog | null> {
  catalogPromise ??= (async () => {
    try {
      const res = await fetch(`${CDN}/rolls/catalog.json`, { cache: 'no-cache' })
      if (!res.ok) return null

      const catalog: Catalog = await res.json()
      return Array.isArray(catalog.films) && catalog.films.length > 0 ? catalog : null
    } catch {
      return null
    }
  })()
  return catalogPromise
}

function catalogFilmToCategory(film: CatalogFilm): FilmCategory {
  return {
    ...film,
    photos: film.photos.map((photo) => {
      const url = `${CDN}/${photo.key}`
      return {
        id: `${film.camera}-${film.id}-${photo.frame}`,
        url,
        thumb: url,
        width: photo.width,
        height: photo.height,
        frame: String(photo.frame),
        keyword: film.id,
      }
    }),
  }
}

// The API is hosted on a free tier that sleeps when idle: a cold start takes
// up to a minute, and requests hitting a half-awake instance fail outright.
// The panel is the source of truth, so the front knocks every 15s for up to
// three minutes (12 attempts) before settling for the CDN catalog — the
// fullscreen loader stays up meanwhile. Each knock is aborted at 15s so the
// cadence holds: a request left hanging on a booting instance is just re-fired.
const API_TIMEOUT_MS = 15_000
const API_RETRY_INTERVAL_MS = 15_000
const API_WINDOW_MS = 180_000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetches an array from the API, knocking on a fixed 15s cadence while the
 * backend is unreachable or still waking up. Stops the moment the backend
 * answers at all — a JSON array (empty counts, "no rolls" is a valid answer),
 * or a bodyless 204/304, which still proves it's awake; the rest of the app
 * fetches on its own where it needs to. Returns `null` when there is nothing
 * usable, so the caller falls back to the CDN catalog.
 */
async function fetchFromApi<T>(path: string): Promise<T[] | null> {
  if (!API) return null

  const deadline = Date.now() + API_WINDOW_MS

  for (;;) {
    const attemptStart = Date.now()

    try {
      const res = await fetch(`${API}${path}`, {
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      })

      // 5xx and the "come back later" codes are what a half-awake instance
      // returns — those are worth retrying. Anything else is a real answer.
      const stillWaking = res.status >= 500 || res.status === 408 || res.status === 429

      if (!stillWaking) {
        // 204/304 carry no body, 4xx means a bad URL — awake either way, so
        // stop knocking and let the CDN fallbacks supply the data
        if (!res.ok || res.status === 204 || res.status === 304) return null

        const data = await res.json().catch(() => null)
        return Array.isArray(data) ? (data as T[]) : null
      }
    } catch {
      // network error or timeout — the backend is probably still waking up
    }

    // Next slot is 15s after the attempt started, so a request that burns its
    // full timeout retries immediately instead of drifting off the cadence.
    const nextAttempt = attemptStart + API_RETRY_INTERVAL_MS
    if (nextAttempt >= deadline) return null

    await sleep(Math.max(0, nextAttempt - Date.now()))
  }
}

// API-first: the admin panel is the source of truth. Falls back to the CDN
// catalog, then the legacy manifest, then the static list, so the site works
// even with the API down.
export async function loadFilmCategories(): Promise<FilmCategory[]> {
  const films = await fetchFromApi<FilmCategory>('/api/films')
  if (films) return films

  const catalog = await loadCatalog()
  if (catalog) return catalog.films.map(catalogFilmToCategory)

  return loadFromManifest()
}

export async function loadCameras(): Promise<Camera[]> {
  // Unlike films, an empty camera list is never a meaningful answer — it would
  // leave the selector blank — so fall through to the catalog/static list.
  const cameras = await fetchFromApi<Camera>('/api/cameras')
  if (cameras && cameras.length > 0) return cameras

  const catalog = await loadCatalog()
  if (catalog && Array.isArray(catalog.cameras) && catalog.cameras.length > 0) {
    return catalog.cameras
  }

  return CAMERAS
}

async function loadFromManifest(): Promise<FilmCategory[]> {
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
