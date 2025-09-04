# AiqFome Teste — Monorepo (Backend Laravel + Frontend React)

Projeto documentation-first: iniciamos pelos planos e roadmap antes do código. Este README consolida os pontos essenciais para onboarding rápido.

## Visão Geral
API REST para gerenciamento de clientes e seus produtos favoritos, proxy de produtos via Fake Store API com cache e headers HTTP (ETag). Frontend SPA (React + aiq-design-system) consumirá a API. Foco: incremental, testável e alinhado a boas práticas de qualidade e segurança.

## Stack (Planejada)
Backend: PHP 8.3, Laravel 12, PostgreSQL, Redis, Sanctum, Scribe  
Frontend: React 18, TypeScript, Vite, TanStack Query (persist), aiq-design-system, Axios  
Infra/Tooling: Docker Compose, Makefile, GitHub Actions (futuro), PHPStan, Pint, ESLint, Prettier

## Estrutura Planejada
```
backend/     # API Laravel
frontend/    # SPA React
infra/       # CI/CD, IaC, docker, pipelines
docs/        # (estes planos podem migrar)
tests/       # Integração/contratos adicionais
```
(Status atual: somente documentação.)

## Roadmap (Resumo)
1) Tooling & Makefile  
2) Docker/Sail ambiente  
3) Bootstrap Laravel  
4) Migrations (customers, favorites)  
5) CRUD Customers  
6) Favorites  
7) Produtos (proxy + cache)  
8) Auth (Sanctum + abilities)  
9) Rate limiting & headers  
10) Problem Details global  
11) Observabilidade
12) Docs
13) Frontend
14) Qualidade  

## Domínio (Essência)
- customers: id, name, email (único case-insensitive)
- favorites: (customer_id, product_id) único
- products: não persistidos; proxy + cache Redis

## Erros (Problem Details)
Formato padrão (RFC 9457): `{ type, title, status, detail, instance }`  
Mapearemos: validação, not-found, conflito (email), timeout upstream.

## Autenticação & Abilities (Planejado)
Sanctum tokens pessoais com abilities:  
- `customers:*`  
- `favorites:*`  
- `products:read`  
Rotas protegidas via middleware; rate limits leitura vs escrita.

## Setup Rápido (Pré-Código)
Quando os arquivos iniciais forem adicionados, o fluxo esperado (máx 5 comandos):
```
git clone <repo> && cd <repo>
cp .env.example .env          # backend (quando existir)
make setup                    # instala deps (composer/npm) + prepara containers
docker compose up -d          # sobe postgres/redis/php-fpm/nginx
make test                     # roda suíte (placeholder inicialmente)
```
(Enquanto o código não existe, `make` targets serão placeholders.)

## Frontend (Step 14)
Bootstrap iniciado em `frontend/` com:
- Vite + React 18 + TypeScript
- Router básico (rota `/` com placeholder)
- TanStack Query + persistência em `localStorage` (chave `rq-cache`)
- Provider de tema do `@aiqfome/aiq-design-system` (publicado no npm)

Comandos (rodar dentro de `frontend/`):
```
npm ci
npm run dev      # servidor Vite
npm test         # Vitest (AppRendersTest, QueryClientPersistsTest)
```
Configuração de testes: Vitest + @testing-library/react (setup em `src/test/setup.ts`).

## Frontend (Step 15)
Camada HTTP e Auth inicial:
- Cliente Axios em `src/lib/httpClient.ts` com `baseURL` via `VITE_API_BASE_URL` (fallback `/api`).
- Interceptor de `Authorization` (usa token de `src/auth/tokenStore.ts`).
- Parser de Problem Details e integração com toast (`src/lib/problemDetails.ts` e `src/lib/toast.ts`).
- `401` dispara fluxo de logout (stub via `triggerLogout()`).

Testes:
- `AuthInterceptorAddsHeaderTest` valida header `Authorization`.
- `ProblemDetailsToastTest` valida exibição de toast a partir de Problem Details.

Env:
- Defina `VITE_API_BASE_URL` em `.env` na raiz de `frontend/` se necessário (ex.: `http://localhost:8080/api`).

## Ambiente Docker (Step 02)
Serviços: nginx (8080), php-fpm, postgres (5432), redis (6379), mailhog (8025).

Comandos úteis:
```
make docker-up        # sobe stack e builda imagens
make docker-ps        # status dos serviços
make docker-logs      # logs (Ctrl+C para sair)
make docker-down      # encerra e remove volumes
```

Health básico:
- Nginx placeholder: http://localhost:8080/
- Health endpoint: http://localhost:8080/healthz (JSON {"status":"ok"})
- Mailhog UI: http://localhost:8025

Variáveis de ambiente Laravel esperadas em backend/.env.example (alinhadas ao Compose):
- Postgres: host `postgres`, db `app`, user `app`, pass `secret`
- Redis: host `redis`, port `6379`
- Mail: host `mailhog`, port `1025`

## Backend Laravel (Step 03)
Bootstrap automático dentro do container `php`.

Passos:
```
make docker-up           # garante containers
make be-bootstrap        # instala Laravel 12.x, chaveia APP_KEY, logging JSON, middleware request_id
make be-about            # executa php artisan about
```

O bootstrap:
- Cria projeto em `backend/` via Composer (se não existir)
- Ajusta `.env` para logs JSON em `stderr`
- Adiciona `App\Http\Middleware\RequestIdMiddleware` e registra globalmente

Depois, a API deve responder via nginx/php-fpm quando rotas forem adicionadas.

## Makefile (Planejado)
Targets: `setup`, `lint`, `fix`, `test`, `seed`, `docs`  
- lint: Pint + PHPStan + ESLint
- test: agrega BE (Pest) + FE (Vitest) + INT
- docs: `php artisan scribe:generate` (após Step 12)

## Qualidade & Segurança
- PHPStan nível 6 (elevar depois)
- Pint + ESLint/Prettier
- Rate limiting: leitura 60/min, escrita 20/min
- Headers segurança: CSP básica, X-Frame-Options, X-Content-Type-Options
- Inputs validados por FormRequest / DTO
- Logs JSON + request_id

## Observabilidade (Futuro)
- Logs estruturados (request_id, user_id)
- Métricas (latência, erros, acertos de cache)
- /healthz (db, redis, upstream)
- Sentry (erro) + possível tracing (OpenTelemetry stub)

## Testes (Filosofia)
Cada Step do roadmap adiciona novos testes sem remover antigos. Categorias:
- BE (Pest), FE (Vitest), INT (contratos / snapshots), QA (scripts autom. futuros)
Executar sempre: `make test`.

## Contribuição
Commits: Conventional Commits (feat, fix, docs, chore, refactor, test).  
PRs: descrição clara + escopo pequeno + link para issue (Se existente).

## Próximos Passos Imediatos
1. Adicionar Makefile esqueleto + editorconfig
2. Configurar Docker Compose (php-fpm, nginx, postgres, redis)
3. Instalar Laravel + bootstrap inicial (timezone, logging JSON)
4. Escrever primeiras migrations + testes base (Pest)
