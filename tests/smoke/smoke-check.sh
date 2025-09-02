#!/usr/bin/env bash
# Lightweight repo smoke checks for Steps 01–03

set -u

OK=0
FAIL=0

note() { printf "\n==> %s\n" "$*"; }
pass() { printf "[OK] %s\n" "$*"; OK=$((OK+1)); }
fail() { printf "[FAIL] %s\n" "$*"; FAIL=$((FAIL+1)); }

check_file() {
  local path="$1"
  if [ -f "$path" ]; then pass "$path exists"; else fail "$path missing"; fi
}

check_grep() {
  local pattern="$1" file="$2" desc="$3"
  if grep -qE "$pattern" "$file"; then pass "$desc"; else fail "$desc"; fi
}

note "Step 01: base tooling files"
check_file ".editorconfig"
check_file ".gitattributes"
check_file ".gitignore"
check_file "Makefile"

check_grep "^lint:" Makefile "Makefile has lint target"
check_grep "^test:" Makefile "Makefile has test target"
check_grep "^docs:" Makefile "Makefile has docs target"

note "Step 02: docker-compose and configs"
check_file "infra/docker/docker-compose.yml"
check_grep "services:" infra/docker/docker-compose.yml "docker-compose has services section"
check_grep "^\s*nginx:" infra/docker/docker-compose.yml "service: nginx"
check_grep "^\s*php:" infra/docker/docker-compose.yml "service: php"
check_grep "^\s*postgres:" infra/docker/docker-compose.yml "service: postgres"
check_grep "^\s*redis:" infra/docker/docker-compose.yml "service: redis"
check_grep "^\s*mailhog:" infra/docker/docker-compose.yml "service: mailhog"

check_file "infra/docker/nginx/default.conf"
check_grep "/healthz" infra/docker/nginx/default.conf "nginx exposes /healthz"
check_file "infra/docker/nginx/html/index.html"
check_file "infra/docker/php/Dockerfile"

note "Step 02: Makefile docker targets"
check_grep "^docker-up:" Makefile "docker-up target"
check_grep "^docker-down:" Makefile "docker-down target"
check_grep "^docker-logs:" Makefile "docker-logs target"
check_grep "^docker-ps:" Makefile "docker-ps target"
check_grep "^docker-rebuild:" Makefile "docker-rebuild target"

note "Step 03: backend bootstrap script and env example"
check_file "infra/scripts/backend-bootstrap.sh"
check_grep "composer create-project laravel/laravel:\^12.0" infra/scripts/backend-bootstrap.sh "bootstrap installs Laravel 12.x"
check_grep "RequestIdMiddleware" infra/scripts/backend-bootstrap.sh "bootstrap adds RequestIdMiddleware"
check_grep "artisan about" infra/scripts/backend-bootstrap.sh "bootstrap runs artisan about"
check_file "backend/.env.example"
check_grep "DB_CONNECTION=pgsql" backend/.env.example ".env.example pgsql configured"
check_grep "REDIS_HOST=redis" backend/.env.example ".env.example redis configured"
check_grep "MAIL_HOST=mailhog" backend/.env.example ".env.example mailhog configured"

note "README contains Docker and Backend sections"
check_grep "Ambiente Docker \(Step 02\)" README.md "README documents Step 02"
check_grep "Backend Laravel \(Step 03\)" README.md "README documents Step 03"

note "Summary"
printf "Passed: %d, Failed: %d\n" "$OK" "$FAIL"
test "$FAIL" -eq 0

