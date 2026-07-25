#!/bin/sh
# Production entrypoint: cache config, migrate, optionally bootstrap the
# first admin from env, then serve. PORT is provided by the platform
# (Render/Koyeb set it); defaults to 8080.
set -e

php artisan config:cache
php artisan view:cache
php artisan migrate --force

# One-time bootstrap: creates the first admin when ADMIN_EMAIL/ADMIN_PASSWORD
# are set and that user does not exist yet (never overwrites). Remove these
# env vars after the first login.
if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
    php artisan app:make-admin --from-env || true
fi

exec frankenphp php-server --root public/ --listen ":${PORT:-8080}"
