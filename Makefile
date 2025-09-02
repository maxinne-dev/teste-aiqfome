.PHONY := help setup lint fix test seed docs docker-up docker-down docker-logs docker-ps docker-rebuild

help:
	@echo "Available targets: setup, lint, fix, test, seed, docs"
	@echo "Docker targets: docker-up, docker-down, docker-logs, docker-ps, docker-rebuild"

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

# Docker helpers (Step 02)
docker-up:
	@echo "[docker] compose up -d"
	docker compose -f infra/docker/docker-compose.yml up -d --build

docker-down:
	@echo "[docker] compose down"
	docker compose -f infra/docker/docker-compose.yml down -v

docker-logs:
	@echo "[docker] tailing logs (Ctrl+C to exit)"
	docker compose -f infra/docker/docker-compose.yml logs -f --tail=100

docker-ps:
	@echo "[docker] services status"
	docker compose -f infra/docker/docker-compose.yml ps

docker-rebuild:
	@echo "[docker] rebuilding images"
	docker compose -f infra/docker/docker-compose.yml build --no-cache
