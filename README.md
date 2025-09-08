# AiqFome Teste — Monorepo (Backend Laravel + Frontend React)

Este projeto é uma aplicação full-stack com uma API REST e um cliente Single Page Application (SPA). Foi desenvolvido com uma abordagem *documentation-first*, focando na criação de um sistema que é incremental, testável e alinhado com práticas modernas de qualidade e segurança.

Este documento fornece uma visão geral de alto nível. Para documentação detalhada e específica de cada área, por favor consulte:
- **[README do Backend](./backend/README.md)**
- **[README do Frontend](./frontend/README.md)**

## Visão Geral

- **Backend**: Uma API REST baseada em Laravel para gerenciar clientes e seus produtos favoritos. Inclui um proxy para buscar dados de produtos da Fake Store API, com cache (Redis) e manipulação de ETag HTTP.
- **Frontend**: Uma SPA React construída com TypeScript e Vite, utilizando o `@aiqfome/aiq-design-system` para seus componentes de UI. Consome a API do backend para todas as operações de dados.

## Stack de Tecnologias

- **Backend**: PHP 8.3, Laravel 12, PostgreSQL, Redis, Sanctum, Scribe
- **Frontend**: React 18, TypeScript, Vite, TanStack Query, `@aiqfome/aiq-design-system`, Axios
- **Infra & Ferramentas**: Docker Compose, Makefile, GitHub Actions, PHPStan, Pint, ESLint, Prettier

## Estrutura do Projeto

```
.
├── backend/     # Aplicação da API Laravel (veja backend/README.md)
├── frontend/    # SPA React (veja frontend/README.md)
├── infra/       # Configs do Docker, IaC, e outros ativos de infraestrutura
└── tests/       # Testes de ponta-a-ponta e de integração
```

## Domínio Principal

- **Clientes**: Identificados por `id`, com `name` e `email`. O email é único e case-insensitive.
- **Favoritos**: Representa o produto favorito de um cliente. A ligação é uma combinação única de `customer_id` e `product_id`.
- **Produtos**: Não são persistidos no banco de dados. São buscados de uma API externa através de um proxy e cacheados em Redis para melhorar a performance.

## Funcionalidades e Conceitos Chave

### Tratamento de Erros (Problem Details)

Os erros da API seguem o padrão [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457). Isso fornece respostas de erro consistentes e legíveis por máquina em toda a aplicação (ex: para validação de entrada, recurso não encontrado, ou timeouts de upstream).

### Autenticação & Autorização

A autenticação é gerenciada pelo Laravel Sanctum, usando tokens de acesso pessoal. O acesso às rotas é controlado pelas `abilities` do token:
- `customers:*`: Acesso total ao gerenciamento de clientes.
- `favorites:*`: Acesso total ao gerenciamento de favoritos.
- `products:read`: Acesso de apenas leitura aos dados dos produtos.

### Qualidade & Segurança

- **Análise Estática**: PHPStan (nível 6) para o backend.
- **Estilo de Código**: Forçado pelo Pint (PHP) e ESLint/Prettier (TypeScript/JS).
- **Rate Limiting**: As rotas da API têm limite de requisições para prevenir abuso (ex: 60 leituras/min, 20 escritas/min).
- **Cabeçalhos de Segurança**: Um conjunto de cabeçalhos HTTP que aumentam a segurança (CSP, X-Frame-Options, etc.) são aplicados a todas as respostas.
- **Logs Estruturados**: Todos os logs estão em formato JSON e incluem um `request_id` para facilitar o rastreamento e a depuração.

## Ambiente de Desenvolvimento Local

Todo o ambiente de desenvolvimento é gerenciado via Docker Compose e um `Makefile`.

### Início Rápido

1.  **Clone o repositório**:
    ```bash
    git clone <repo> && cd <repo>
    ```
2.  **Copie os arquivos de ambiente**:
    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```
3.  **Construa e inicie os serviços**:
    ```bash
    make setup
    ```
    Este comando instala todas as dependências (Composer & npm) e inicia os contêineres Docker em segundo plano.

### Comandos Úteis

- `make docker-up`: Constrói e inicia os contêineres Docker.
- `make docker-down`: Para e remove os contêineres e volumes Docker.
- `make docker-ps`: Mostra o status dos serviços em execução.
- `make docker-logs`: Exibe os logs de todos os serviços.
- `make test`: Roda a suíte de testes completa para backend e frontend.
- `make lint`: Verifica o estilo de código de todo o projeto.
- `make fix`: Corrige automaticamente problemas de estilo.

### Acessando os Serviços

- **API (via Nginx)**: `http://localhost:8080/`
- **Frontend (via Nginx)**: `http://localhost:8080/app/`
- **Frontend (Servidor de Dev Vite)**: `http://localhost:5173/`
- **Mailhog UI**: `http://localhost:8025/`
- **Banco de Dados (PostgreSQL)**: `localhost:5432`
- **Cache (Redis)**: `localhost:6379`
