# Film Diary — monorepo

Analogue photography diary: public site + content admin + read-only API.

```
film-diary/
├─ apps/
│  ├─ web/      React + Vite SPA (Vercel) — the public site
│  ├─ api/      Fastify + TypeScript — public read-only JSON API
│  └─ admin/    Laravel + Filament 4 — content & storage admin panel
├─ docker/      Dockerfiles / init scripts
└─ docker-compose.yml
```

**Data flow:** the Filament admin is the source of truth. It stores cameras /
film rolls / photos in PostgreSQL and manages the image files in a Backblaze
B2 bucket (served through the ImageKit CDN). On every content change it also
publishes `rolls/catalog.json` + `rolls/manifest.json` to the bucket. The
Node API reads the same database through a `SELECT`-only role and serves JSON
to the site. The site falls back to the CDN catalog/manifest and then to a
static list if the API is unreachable, so it keeps working as a static page.

## Quick start (dev)

Requirements: Docker Desktop, Node 20+, Yarn 1.

```bash
# 1. Environment (fill in strong random values, e.g. `openssl rand -hex 16`)
cp .env.example .env
cp apps/admin/.env.example apps/admin/.env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 2. Infrastructure + apps
docker compose up -d --build

# 3. Admin app one-time setup
docker compose exec admin php artisan key:generate
docker compose exec admin php artisan migrate --seed

# 4. Create your admin account (interactive — no default credentials exist)
docker compose exec admin php artisan app:make-admin

# 5. Front-end
yarn install
yarn dev:web
```

| Service | URL |
|---|---|
| Site (dev) | http://localhost:3000 |
| Admin panel | http://localhost:8080/admin |
| Public API | http://localhost:3001/api/films |

The admin talks straight to the real Backblaze B2 bucket (`AWS_*` values in
`apps/admin/.env`) — uploads, renames and deletes affect production files.

## Security model

- **Secrets** never enter git: every app has a committed `.env.example`, real
  `.env` files are gitignored.
- **Admin panel:** TOTP multi-factor auth (Filament v4, with recovery codes),
  argon2id password hashing, login rate limiting, encrypted sessions,
  security headers (`X-Frame-Options: DENY`, nosniff, `frame-ancestors
  'none'`, HSTS over TLS), `APP_DEBUG=false` outside local, forced HTTPS in
  production. Admin users are created only via interactive
  `php artisan app:make-admin`.
- **API:** connects as the `api_reader` PostgreSQL role (SELECT-only,
  created by `docker/postgres/init/01-api-reader.sh`) — it physically cannot
  write. CORS allowlist, helmet headers, 120 req/min rate limit, errors
  without stack traces.
- **Network:** PostgreSQL lives on an internal-only Docker network and is
  never published to the host. All published ports bind to `127.0.0.1`.
- **Containers:** API runs as `node`, admin image defines an unprivileged
  `app` user (dev compose overrides to root only because Windows bind mounts
  are root-owned; production images bake sources in and stay non-root).

## Storage layout

Object keys follow `rolls/{camera}/{film}/{frame}.jpg` — the same layout the
CDN already serves, so pre-existing files keep working. The admin computes
keys automatically: uploads get the next frame number, changing a frame
number renames the object in the bucket, deleting a photo deletes the object.

## Production notes

- **Backblaze B2:** create an application key scoped to a single bucket
  (read/write). In `apps/admin/.env` set the `AWS_*` values as described in
  `apps/admin/.env.example`. The S3 client is already configured with
  `request_checksum_calculation = when_required` — without it, modern AWS
  SDKs send CRC checksums that B2's S3 API rejects.
- **CDN:** point `CDN_URL` (admin), `CDN_URL` (api) and `VITE_CDN_URL` (web)
  at the public base URL images are served from (e.g.
  `https://ik.imagekit.io/ilalex` with the B2 bucket as origin).
- **Vercel:** set the project's *Root Directory* to `apps/web` (monorepo
  layout). Set `VITE_API_URL` / `VITE_CDN_URL` in Vercel env settings.
- **Admin/API hosting:** any VPS with Docker. Behind TLS set
  `APP_ENV=production`, `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`.
