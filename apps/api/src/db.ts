import pg from 'pg'

import { config } from './config.js'

// Connects as the api_reader role: SELECT-only by design, so even a bug in
// this service cannot modify data.
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

export interface CameraRow {
  slug: string
  name: string
  short_name: string
}

export interface PhotoJson {
  id: number
  object_key: string
  frame: number
  width: number
  height: number
}

export interface FilmRow {
  slug: string
  camera_slug: string
  name: string
  iso: string
  description: string
  accent: string
  bg: string
  tag: string
  photos: PhotoJson[]
}

export async function fetchCameras(): Promise<CameraRow[]> {
  const { rows } = await pool.query<CameraRow>(
    'SELECT slug, name, short_name FROM cameras ORDER BY sort_order, slug',
  )
  return rows
}

export async function fetchFilms(): Promise<FilmRow[]> {
  const { rows } = await pool.query<FilmRow>(
    `SELECT
       f.slug, f.camera_slug, f.name, f.iso, f.description, f.accent, f.bg, f.tag,
       COALESCE(
         json_agg(
           json_build_object(
             'id', p.id,
             'object_key', p.object_key,
             'frame', p.frame,
             'width', p.width,
             'height', p.height
           )
           ORDER BY p.frame
         ) FILTER (WHERE p.id IS NOT NULL),
         '[]'
       ) AS photos
     FROM films f
     LEFT JOIN photos p ON p.film_slug = f.slug AND p.is_published
     GROUP BY f.slug
     ORDER BY f.sort_order, f.slug`,
  )
  return rows
}
