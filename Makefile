.PHONY := help setup lint fix test seed docs

help:
	@echo "Available targets: setup, lint, fix, test, seed, docs"

# Placeholder: prepare local dev when code lands
setup:
	@echo "[setup] Installing deps and preparing environment (placeholder)"
	@echo "- Backend (later): composer install && php artisan key:generate"
	@echo "- Frontend (later): npm ci"
	@echo "- Docker (later): docker compose up -d"

# Placeholder: aggregate linters (PHP Pint/PHPStan, ESLint, Prettier)
lint:
	@echo "[lint] Running linters (placeholder)"
	@echo "- PHP: pint, phpstan"
	@echo "- JS/TS: eslint, prettier --check"
	@echo "- Docs: markdownlint"

# Placeholder: auto-fix formatters
fix:
	@echo "[fix] Running auto-fixes (placeholder)"
	@echo "- PHP: pint"
	@echo "- JS/TS: eslint --fix, prettier -w"
	@echo "- Docs: prettier -w \"**/*.md\""

# Placeholder: run test suites
test:
	@echo "[test] Running tests (placeholder)"
	@echo "- Backend: php artisan test (Pest)"
	@echo "- Frontend: npm test (Vitest)"
	@echo "- Integration: TBD"

# Placeholder: seed data (when backend exists)
seed:
	@echo "[seed] Seeding database (placeholder)"
	@echo "- Backend: php artisan migrate --seed"

# Placeholder: docs generation (when Scribe configured)
docs:
	@echo "[docs] Generating API docs (placeholder)"
	@echo "- Backend: php artisan scribe:generate"

