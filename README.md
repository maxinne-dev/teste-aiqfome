# AiqFome Teste — Monorepo (Backend Laravel + Frontend React)

Projeto documentation-first: iniciamos pelos planos e roadmap antes do código. Este README consolida os pontos essenciais para onboarding rápido.

## Visão Geral
API REST para gerenciamento de clientes e seus produtos favoritos, proxy de produtos via Fake Store API com cache e headers HTTP (ETag). Frontend SPA (React + aiq-design-system) consumirá a API. Foco: incremental, testável e alinhado a boas práticas de qualidade e segurança.

## Stack (Planejada)
Backend: PHP 8.3, Laravel 12, PostgreSQL, Redis, Sanctum, Scribe  
Frontend: React 18, TypeScript, Vite, TanStack Query, aiq-design-system, Axios  
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