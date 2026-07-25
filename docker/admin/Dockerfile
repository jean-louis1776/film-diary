# Laravel + Filament admin on FrankenPHP (single container, no nginx+fpm pair).
# Dev: source is bind-mounted at /app (see docker-compose.yml).
FROM dunglas/frankenphp:1-php8.4

RUN install-php-extensions \
    pdo_pgsql \
    intl \
    zip \
    exif \
    gd \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Unprivileged user; port 8080 needs no root
RUN useradd --uid 1000 --create-home app \
    && mkdir -p /data/caddy /config/caddy \
    && chown -R app:app /data /config

ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

WORKDIR /app
USER app

EXPOSE 8080
CMD ["frankenphp", "php-server", "--root", "public/", "--listen", ":8080"]
