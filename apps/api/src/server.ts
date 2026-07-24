import cors from '@fastify/cors'
import etag from '@fastify/etag'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import Fastify, { type FastifyError } from 'fastify'

import { config } from './config.js'
import { fetchCameras, fetchFilms, pool } from './db.js'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

await app.register(helmet)
// Public read-only API without credentials — "*" (the default) is safe here;
// set CORS_ORIGINS to a comma-separated allowlist to restrict
await app.register(cors, {
  origin: config.corsOrigins.includes('*') || config.corsOrigins.length === 0 ? true : config.corsOrigins,
  methods: ['GET'],
})
await app.register(rateLimit, {
  max: 120,
  timeWindow: '1 minute',
})
// ETag + no-cache: browsers revalidate on every page load and get a cheap
// 304 when nothing changed — admin edits show up on the next refresh
await app.register(etag)

// Public read-only API: no stack traces or internals in error responses
app.setErrorHandler((error: FastifyError, request, reply) => {
  request.log.error(error)
  const statusCode = error.statusCode && error.statusCode < 500 ? error.statusCode : 500
  reply.status(statusCode).send({
    error: statusCode >= 500 ? 'Internal Server Error' : error.message,
  })
})

const photoUrl = (objectKey: string): string => `${config.cdnUrl}/${objectKey}`

app.get('/healthz', async () => {
  await pool.query('SELECT 1')
  return { status: 'ok' }
})

app.get('/api/cameras', async (request, reply) => {
  const cameras = await fetchCameras()

  reply.header('cache-control', 'no-cache')
  return cameras.map((camera) => ({
    id: camera.slug,
    name: camera.name,
    shortName: camera.short_name,
  }))
})

app.get('/api/films', async (request, reply) => {
  const films = await fetchFilms()

  reply.header('cache-control', 'no-cache')
  return films.map((film) => ({
    id: film.slug,
    name: film.name,
    iso: film.iso,
    description: film.description,
    accent: film.accent,
    bg: film.bg,
    tag: film.tag,
    camera: film.camera_slug,
    frameCount: film.photos.length,
    photos: film.photos.map((photo) => ({
      id: `${film.camera_slug}-${film.slug}-${photo.frame}`,
      url: photoUrl(photo.object_key),
      thumb: photoUrl(photo.object_key),
      width: photo.width,
      height: photo.height,
      frame: String(photo.frame),
      keyword: film.slug,
    })),
  }))
})

const shutdown = async () => {
  await app.close()
  await pool.end()
  process.exit(0)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

try {
  await app.listen({ port: config.port, host: config.host })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
