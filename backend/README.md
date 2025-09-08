# Backend (API Laravel)

Este documento fornece detalhes específicos para o desenvolvimento e manutenção da aplicação backend em Laravel. Para uma visão geral de alto nível de todo o projeto, consulte o [README.md principal](../README.md).

## Documentação da API

A documentação da API é gerada usando o [Scribe](https://scribe.knuckles.wtf/laravel).

- **Configuração**: `config/scribe.php` (visa as rotas `api/*`).
- **Saída**: `public/docs/` (inclui um arquivo YAML OpenAPI 3.0.3 e uma página HTML amigável).

Para gerar a documentação, execute o seguinte comando a partir do diretório `backend/`:

```bash
php artisan scribe:generate
```

Você pode então visualizar a documentação HTML gerada em `public/docs/index.html`.

## Comandos de Desenvolvedor

Os seguintes scripts `composer` estão disponíveis por conveniência:

- `composer test`: Limpa o cache de configuração e executa a suíte de testes completa (Pest).
- `composer lint`: Verifica o estilo do código com o Pint.
- `composer lint:fix`: Corrige automaticamente problemas de estilo de código com o Pint.
- `composer stan`: Executa análise estática usando PHPStan com a configuração de `phpstan.neon.dist`.
- `composer docs`: Um atalho para `php artisan scribe:generate`.

## Estratégia de Banco de Dados para Testes

- **Padrão**: Os testes são executados em um banco de dados SQLite em memória para velocidade e isolamento. Isso é configurado no `phpunit.xml`. Requer as extensões PHP `pdo_sqlite` e `sqlite3`, que estão incluídas no ambiente Docker.
- **Compatibilidade com Postgres**: Migrações que usam recursos específicos do PostgreSQL (como a extensão `citext`) são protegidas para serem executadas apenas quando o driver do banco de dados é `pgsql`. Isso garante que o schema permaneça portável.
- **Executando Testes com Postgres (Opcional)**: Para executar testes na instância do PostgreSQL dockerizada, você pode sobrescrever as variáveis de ambiente definidas no `phpunit.xml`:

  ```bash
  DB_CONNECTION=pgsql \
  DB_HOST=postgres \
  DB_PORT=5432 \
  DB_DATABASE=app \
  DB_USERNAME=app \
  DB_PASSWORD=secret \
  ./vendor/bin/phpunit
  ```

## Rotas de Apoio para Desenvolvimento/Teste

Para facilitar o desenvolvimento e os testes locais, estão disponíveis endpoints de autenticação especiais. Essas rotas são **desabilitadas por padrão** e podem ser ativadas definindo `FEATURE_DEV_AUTH_ROUTES=true` no arquivo `backend/.env`.

- **Listar Usuários**: `GET /api/v1/dev/users`
  - Retorna uma lista de usuários, destacando `test@example.com` se existir.
- **Obter Token de Acesso**: `POST /api/v1/dev/token`
  - Emite um token Sanctum para um usuário especificado.
  - **Corpo**: `{ "email": "user@example.com", "abilities": ["products:read"] }`
  - Se `abilities` for omitido, `products:read` é usado como padrão.
  - O usuário `test@example.com` receberá um token com todas (`*`) as habilidades.

## Cabeçalhos de Segurança

Um middleware dedicado (`App\Http\Middleware\SecurityHeadersMiddleware`) é registrado globalmente para adicionar importantes cabeçalhos de segurança a todas as respostas. Estes incluem `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, e outros para segurança aprimorada.

O HSTS (`Strict-Transport-Security`) é ativado automaticamente no ambiente de `production` em respostas HTTPS.
