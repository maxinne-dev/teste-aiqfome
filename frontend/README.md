# Frontend (SPA React)

Este documento fornece detalhes específicos para o desenvolvimento e manutenção da aplicação frontend em React. Para uma visão geral de alto nível de todo o projeto, consulte o [README.md principal](../README.md).

## Stack

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Ferramenta de Build**: Vite
- **UI**: `@aiqfome/aiq-design-system`
- **Gerenciamento de Estado**: TanStack Query v5 (com persistência no `localStorage`)
- **Cliente HTTP**: Axios
- **Testes**: Vitest, React Testing Library

## Começando

Todos os comandos devem ser executados a partir do diretório `frontend/`.

1.  **Instale as dependências:**
    ```bash
    npm ci
    ```
    Este comando usa o `package-lock.json` para instalar as versões exatas das dependências, garantindo uma configuração consistente.

2.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou uma porta diferente se a 5173 estiver em uso). O servidor Vite suporta Hot Module Replacement (HMR) para uma experiência de desenvolvimento rápida.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento Vite.
- `npm test`: Executa a suíte de testes usando Vitest em modo de observação (*watch mode*).
- `npm run test:ci`: Executa a suíte de testes uma vez, sem observar alterações.
- `npm run lint`: Executa o ESLint para verificar o código.
- `npm run format`: Formata o código usando o Prettier.
- `npm run build`: Compila e empacota a aplicação para produção.

## Variáveis de Ambiente

A aplicação frontend usa variáveis de ambiente prefixadas com `VITE_`. Você pode criar um arquivo `.env` no diretório `frontend/` para sobrescrever os padrões.

- `VITE_API_BASE_URL`: A URL base para a API do backend.
  - **Padrão**: `/api` (para rodar sob o mesmo domínio).
  - **Exemplo para desenvolvimento local**: `http://localhost:8080/api`

## Cliente HTTP & Autenticação

- A instância do Axios é configurada em `src/lib/httpClient.ts`. Ela define automaticamente a `baseURL` a partir da variável de ambiente `VITE_API_BASE_URL`.
- Um interceptador do Axios é configurado para anexar o cabeçalho `Authorization: Bearer <token>` a todas as requisições de saída. O token é recuperado de `src/auth/tokenStore.ts`.
- Respostas com status `401 Unauthorized` acionarão automaticamente um fluxo de logout.

## Tratamento de Erros (Problem Details)

A aplicação está configurada para entender e lidar com respostas de erro da API que seguem o padrão [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457).
- O utilitário em `src/lib/problemDetails.ts` analisa essas respostas.
- Quando ocorre um erro na API, uma notificação *toast* amigável é exibida com os detalhes do erro, gerenciada por `src/lib/toast.ts`.

## Testes

- **Framework**: Vitest com um ambiente JSDOM.
- **Bibliotecas**: React Testing Library para testes de componentes.
- **Configuração**: A configuração global de testes, incluindo mocks e limpeza, é tratada em `src/test/setup.ts`.
- **Testes Chave**:
  - `AuthInterceptorAddsHeader.test.ts`: Verifica se o cabeçalho `Authorization` é adicionado corretamente pelo interceptador do Axios.
  - `ProblemDetailsToast.test.tsx`: Garante que erros da API no formato Problem Details acionem corretamente uma notificação *toast*.
  - `QueryClientPersists.test.tsx`: Confirma que o cliente TanStack Query persiste corretamente seu cache no `localStorage`.
