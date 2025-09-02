#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html/backend

echo "[bootstrap] Working dir: $(pwd)"

if [ ! -f artisan ]; then
  echo "[bootstrap] Installing Laravel 12.x via Composer..."
  # If directory isn't empty (e.g., .env.example present), preserve it then create project cleanly
  if [ -f .env.example ]; then
    mkdir -p /tmp/backend-preserve && cp -f .env.example /tmp/backend-preserve/.env.example
  fi
  if [ "$(ls -A)" ]; then
    echo "[bootstrap] Backend dir not empty; cleaning before create-project (preserving .env.example if existed)"
    # Remove all contents in current dir
    find . -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  fi
  composer create-project laravel/laravel:^12.0 .
  if [ -f /tmp/backend-preserve/.env.example ]; then
    echo "[bootstrap] Restoring preserved .env.example"
    cp -f /tmp/backend-preserve/.env.example .env.example || true
  fi
else
  echo "[bootstrap] Laravel already present. Skipping create-project."
fi

echo "[bootstrap] Ensuring dependencies installed..."
if [ ! -f vendor/autoload.php ]; then
  echo "[bootstrap] Installing composer dependencies..."
  composer install --no-interaction --prefer-dist
fi

if [ ! -f .env ] && [ -f .env.example ]; then cp .env.example .env; fi

# Ensure Docker stack DB/Redis/Mail settings
echo "[bootstrap] Ensuring .env is aligned to Docker services..."
ensure_env() {
  local key="$1"; shift
  local value="$1"; shift
  if grep -q "^${key}=" .env; then
    sed -i "s#^${key}=.*#${key}=${value}#" .env
  else
    echo "${key}=${value}" >> .env
  fi
}

ensure_env DB_CONNECTION pgsql
ensure_env DB_HOST postgres
ensure_env DB_PORT 5432
ensure_env DB_DATABASE app
ensure_env DB_USERNAME app
ensure_env DB_PASSWORD secret
ensure_env REDIS_CLIENT phpredis
ensure_env REDIS_HOST redis
ensure_env REDIS_PORT 6379
ensure_env MAIL_MAILER smtp
ensure_env MAIL_HOST mailhog
ensure_env MAIL_PORT 1025
ensure_env MAIL_USERNAME null
ensure_env MAIL_PASSWORD null
ensure_env MAIL_ENCRYPTION null
ensure_env APP_URL http://localhost:8080

echo "[bootstrap] Ensuring APP_KEY exists..."
php artisan key:generate --force --quiet || true

echo "[bootstrap] Configuring JSON logging to stderr via env..."
if ! grep -q '^LOG_CHANNEL=' .env 2>/dev/null; then echo 'LOG_CHANNEL=stderr' >> .env; fi
if ! grep -q '^LOG_STDERR_FORMATTER=' .env 2>/dev/null; then echo 'LOG_STDERR_FORMATTER=Monolog\\Formatter\\JsonFormatter' >> .env; fi

echo "[bootstrap] Adding RequestIdMiddleware (idempotent)..."
mkdir -p app/Http/Middleware
cat > app/Http/Middleware/RequestIdMiddleware.php <<'PHP'
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class RequestIdMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $id = $request->headers->get('X-Request-Id') ?: (string) Str::uuid();
        $request->headers->set('X-Request-Id', $id);

        // Expose in response and log context
        $response = $next($request);
        $response->headers->set('X-Request-Id', $id);
        Log::withContext(['request_id' => $id]);

        return $response;
    }
}
PHP

echo "[bootstrap] Registering middleware in Kernel (global)..."
KERNEL_FILE=app/Http/Kernel.php
if ! grep -q 'RequestIdMiddleware' "$KERNEL_FILE"; then
  # Insert into the global middleware array after its opening bracket
  awk '
    BEGIN{inserted=0}
    /protected \$middleware = \[/ && inserted==0 {
      print; print "        \\App\\Http\\Middleware\\RequestIdMiddleware::class,"; inserted=1; next
    }
    {print}
  ' "$KERNEL_FILE" > "$KERNEL_FILE.tmp" && mv "$KERNEL_FILE.tmp" "$KERNEL_FILE"
else
  echo "[bootstrap] Middleware already registered."
fi

echo "[bootstrap] Done. Running artisan about:"
php artisan about || true
