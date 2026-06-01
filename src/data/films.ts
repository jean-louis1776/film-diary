import type { FilmCategory, Photo } from '@/types'

export const FILM_CATEGORIES: FilmCategory[] = [
  {
    id: 'kodak-ultramax-400',
    name: 'Kodak Ultramax',
    iso: 'ISO 400',
    description: 'Vivid, punchy colors — bold blues, lush greens, warm skin tones',
    accent: '#E8A23A',
    bg: '#15100A',
    tag: 'COLOR · DAYLIGHT · ISO 400',
  },
  {
    id: 'orwo-wolfen-nc400',
    name: 'ORWO Wolfen NC400',
    iso: 'ISO 400',
    description: 'Vibrant greens, desaturated shadows, cool cast — unlike anything else',
    accent: '#6BAF7C',
    bg: '#080F0A',
    tag: 'COLOR · COOL TONES · ISO 400',
  },
  {
    id: 'ilford-hp5-plus',
    name: 'Ilford HP5 Plus',
    iso: 'ISO 400',
    description: 'Fine grain, smooth midtones, wide latitude — the pushable classic',
    accent: '#C8C4BC',
    bg: '#0C0C0C',
    tag: 'B&W · CLASSIC · ISO 400',
  },
  {
    id: 'ilford-kentmere-400',
    name: 'Ilford Kentmere Pan',
    iso: 'ISO 400',
    description: 'Stronger contrast, visible grain, raw gritty street character',
    accent: '#A09890',
    bg: '#0A0A0A',
    tag: 'B&W · GRITTY · ISO 400',
  },
  {
    id: 'lomography-cn400',
    name: 'Lomography Color Neg',
    iso: 'ISO 400',
    description: 'Vintage muted palette, slight brownish warmth, noisy grain',
    accent: '#C4607A',
    bg: '#120810',
    tag: 'COLOR · VINTAGE · ISO 400',
  },
]

const allPhotos = import.meta.glob<{ default: string }>(
  '../assets/rolls/**/*.{jpg,jpeg,png,webp}',
  { eager: true }
)

export function getPhotosForFilm(filmId: string): Photo[] {
  return Object.entries(allPhotos)
    .filter(([path]) => path.includes(`/rolls/${filmId}/`))
    .map(([path, module], i) => {
      const filename = path.split('/').pop() ?? ''
      const frame = filename.replace(/\.[^.]+$/, '') // '01.jpg' → '01'
      return {
        id: `${filmId}-${i}`,
        url: module.default,
        thumb: module.default,
        width: 800,
        height: 600,
        frame: frame,
        keyword: filmId,
      }
    })
    .sort((a, b) => a.frame.localeCompare(b.frame))
}
