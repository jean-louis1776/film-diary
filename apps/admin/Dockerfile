# Production image: sources baked in, runs as unprivileged user.
# (Local dev uses docker/admin/Dockerfile with a bind mount instead.)

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --no-autoloader --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --no-dev

FROM dunglas/frankenphp:1-php8.4

RUN install-php-extensions \
    pdo_pgsql \
    intl \
    zip \
    exif \
    gd \
    opcache

RUN useradd --uid 1000 --create-home app \
    && mkdir -p /data/caddy /config/caddy \
    && chown -R app:app /data /config \
    # The base image grants frankenphp cap_net_bind_service so it can bind
    # :80/:443. We listen on :8080, and sandboxed runtimes (Render) refuse to
    # exec a binary carrying file capabilities — strip it.
    && setcap -r /usr/local/bin/frankenphp

ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

WORKDIR /app
COPY --chown=app:app . .
COPY --from=vendor --chown=app:app /app/vendor ./vendor

RUN php artisan package:discover --ansi \
    && chmod +x docker/entrypoint.sh \
    && chown -R app:app storage bootstrap/cache

USER app

EXPOSE 8080
ENTRYPOINT ["docker/entrypoint.sh"]
