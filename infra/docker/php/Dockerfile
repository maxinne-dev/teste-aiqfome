FROM php:8.3-fpm-alpine

RUN set -eux; \
    apk add --no-cache \
      bash git curl libpq-dev icu-dev oniguruma-dev zlib-dev libzip-dev $PHPIZE_DEPS; \
    docker-php-ext-configure intl; \
    docker-php-ext-install -j"$(nproc)" \
      intl \
      mbstring \
      pdo \
      pdo_pgsql \
      zip; \
    pecl install redis && docker-php-ext-enable redis

# Install Composer (for Laravel create-project)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/backend

# Tune FPM for dev
RUN { \
  echo "listen=9000"; \
  echo "pm=dynamic"; \
  echo "pm.max_children=10"; \
  echo "pm.start_servers=2"; \
  echo "pm.min_spare_servers=1"; \
  echo "pm.max_spare_servers=3"; \
} > /usr/local/etc/php-fpm.d/zz-dev.conf

CMD ["php-fpm", "-F"]
