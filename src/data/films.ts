import type { FilmCategory, Photo } from '@/types'

const CDN = 'https://ik.imagekit.io/ilalex'

export const FILM_CATEGORIES: FilmCategory[] = [
  {
    id: 'kodak-ultramax-400',
    name: 'Kodak Ultramax',
    iso: 'ISO 400',
    description: 'Vivid, punchy colors — bold blues, lush greens, warm skin tones',
    accent: '#E8A23A',
    bg: '#15100A',
    tag: 'COLOR · DAYLIGHT · ISO 400',
    frameCount: 4,
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
  },
  {
    id: 'ilford-hp5-plus',
    name: 'Ilford HP5 Plus',
    iso: 'ISO 400',
    description: 'Fine grain, smooth midtones, wide latitude — the pushable classic',
    accent: '#C8C4BC',
    bg: '#0C0C0C',
    tag: 'B&W · CLASSIC · ISO 400',
    frameCount: 7,
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
  },
]

export function getPhotosForFilm(filmId: string, frameCount: number): Photo[] {
  return Array.from({ length: frameCount }, (_, i) => {
    const frame = String(i + 1)

    const url = `${CDN}/rolls/${filmId}/${frame}.jpg`

    return {
      id: `${filmId}-${frame}`,
      url,
      thumb: url,
      width: 800,
      height: 600,
      frame,
      keyword: filmId,
    }
  })
}
