#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html/backend

echo "[bootstrap] Working dir: $(pwd)"

if [ ! -f artisan ]; then
  echo "[bootstrap] Installing Laravel 12.x via Composer..."
  composer create-project laravel/laravel:^12.0 .
else
  echo "[bootstrap] Laravel already present. Skipping create-project."
fi

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

