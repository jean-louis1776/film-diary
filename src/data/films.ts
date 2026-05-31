import type { FilmCategory } from '@/types';

export const FILM_CATEGORIES: FilmCategory[] = [
  {
    id: 'kodak-gold',
    name: 'Kodak Gold 200',
    iso: 'ISO 200',
    shots: 36,
    description: 'Warm tones, golden afternoon light',
    accent: '#C8963E',
    bg: '#1A1510',
    tag: 'DAYLIGHT',
    count: 24,
  },
  {
    id: 'ilford-hp5',
    name: 'Ilford HP5+',
    iso: 'ISO 400',
    shots: 36,
    description: 'Classic black & white, versatile',
    accent: '#D4D0C8',
    bg: '#0F0F0F',
    tag: 'B&W',
    count: 18,
  },
  {
    id: 'cinestill-800',
    name: 'CineStill 800T',
    iso: 'ISO 800',
    shots: 36,
    description: 'Neon halos, cinematic night scenes',
    accent: '#E84040',
    bg: '#120508',
    tag: 'TUNGSTEN',
    count: 12,
  },
  {
    id: 'fuji-pro400',
    name: 'Fujifilm Pro 400H',
    iso: 'ISO 400',
    shots: 36,
    description: 'Soft greens, cool pastel palette',
    accent: '#7CB9A0',
    bg: '#0A1410',
    tag: 'OVERCAST',
    count: 30,
  },
  {
    id: 'kodak-portra',
    name: 'Kodak Portra 400',
    iso: 'ISO 400',
    shots: 36,
    description: 'Natural skin tones, creamy highlights',
    accent: '#D4A574',
    bg: '#140D08',
    tag: 'PORTRAIT',
    count: 36,
  },
  {
    id: 'lomography',
    name: 'Lomography 400',
    iso: 'ISO 400',
    shots: 36,
    description: 'Saturated, lo-fi, experimental',
    accent: '#A855F7',
    bg: '#0D0814',
    tag: 'EXPERIMENTAL',
    count: 20,
  },
];

const FILM_SEEDS: Record<string, string[]> = {
  'kodak-gold':    ['nature', 'architecture', 'city', 'landscape', 'travel'],
  'ilford-hp5':    ['street', 'portrait', 'architecture', 'urban', 'minimal'],
  'cinestill-800': ['night', 'city', 'neon', 'urban', 'street'],
  'fuji-pro400':   ['nature', 'forest', 'minimal', 'landscape', 'travel'],
  'kodak-portra':  ['portrait', 'people', 'fashion', 'minimal', 'vintage'],
  lomography:      ['abstract', 'color', 'experimental', 'art', 'creative'],
};

export function generateMockPhotos(filmId: string, count: number) {
  const keywords = FILM_SEEDS[filmId] ?? ['photography'];

  return Array.from({ length: count }, (_, i) => ({
    id: `${filmId}-${i}`,
    url: `https://picsum.photos/seed/${filmId}${i + 1}/800/600`,
    thumb: `https://picsum.photos/seed/${filmId}${i + 1}/400/300`,
    width: i % 3 === 0 ? 800 : 600,
    height: i % 3 === 0 ? 600 : 800,
    frame: String(i + 1).padStart(2, '0'),
    keyword: keywords[i % keywords.length],
  }));
}
