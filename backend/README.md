<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## API Documentation

- Real docs via Scribe (preferred):
  - Install dev deps (`composer install`) to enable Scribe's generator.
  - Run `php artisan scribe:generate` to produce rich docs.
  - Config: `config/scribe.php` (OpenAPI 3.0.3; matches `api/*` routes).
  - Outputs to `public/docs/`.
- Fallback (when Scribe not installed):
  - Use `php artisan docs:generate` which generates a minimal OpenAPI file and index.
  - Outputs to `public/docs/openapi.yaml` and `public/docs/index.html`.

## Developer Commands

- `composer test`: clears config and runs the test suite.
- `composer lint`: checks code style with Pint (no changes).
- `composer lint:fix`: fixes code style with Pint.
- `composer stan`: runs PHPStan (with Larastan) using `phpstan.neon.dist`.
- `composer docs`: generates API docs (Scribe if installed, fallback otherwise).

## Test DB Strategy

- Default: PHPUnit runs with in-memory SQLite for isolation and speed.
  - Configured in `phpunit.xml`: `DB_CONNECTION=sqlite`, `DB_DATABASE=":memory:"`.
  - Requires PHP extensions: `pdo_sqlite` and `sqlite3` (enabled in Docker setup).
- Postgres-specific migrations are guarded.
  - `citext` extension and `ALTER TYPE` run only when the driver is `pgsql`.
  - Schema (unique constraints, FKs) remains portable across drivers.
- Sanctum in tests: product endpoints auto-auth in the base `TestCase` so most tests can hit
  them without boilerplate; `AuthAbilitiesTest` explicitly verifies auth/abilities flows.
- Run against Postgres (optional): override DB env vars when invoking PHPUnit, e.g.

  ```bash
  DB_CONNECTION=pgsql \
  DB_HOST=postgres \
  DB_PORT=5432 \
  DB_DATABASE=app \
  DB_USERNAME=app \
  DB_PASSWORD=secret \
  ./vendor/bin/phpunit
  ```

  Ensure `pdo_pgsql` is installed if running outside Docker.

## Security Headers

- Middleware: `App\Http\Middleware\SecurityHeadersMiddleware` adds safe defaults:
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
    `Referrer-Policy: no-referrer`, `X-XSS-Protection: 0`.
  - `Cross-Origin-Resource-Policy: same-site`, `Cross-Origin-Opener-Policy: same-origin`,
    `Permissions-Policy: geolocation=(), microphone=(), camera=()`.
- HSTS (Strict-Transport-Security): enabled only when both are true:
  - `APP_ENV=production` and the request is HTTPS (`isSecure()` or `X-Forwarded-Proto: https`).
  - Behind a proxy/ingress, configure trusted proxies so forwarded proto is honored:
    https://laravel.com/docs/12.x/requests#trusting-all-proxies
  - Header value: `max-age=31536000; includeSubDomains; preload`.

## API Documentation

- Stub generator: `php artisan scribe:generate` produces minimal docs without external
  dependencies (used for Step 12 tests).
  - Outputs to `public/docs/openapi.yaml` (OpenAPI 3.0.3) and `public/docs/index.html`.
  - Tags included: Customers, Favorites, Products, Auth. Products endpoints require
    bearer tokens in docs.
- Run:

  ```bash
  cd backend
  php artisan scribe:generate
  ```

  Then open `backend/public/docs/index.html` in a browser.

> Note: To adopt full Scribe later, add the package via Composer and replace this stub
> with Scribe config (`config/scribe.php`). Tests can be adapted to validate richer output.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
