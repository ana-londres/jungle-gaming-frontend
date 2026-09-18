# Kurio NFT Marketplace

Aplicação front-end de um marketplace de NFTs criada para o challenge. Ela permite explorar um catálogo, consultar o detalhe de um NFT, adicioná-lo ao carrinho e concluir uma compra simulada até a confirmação do pedido.

> APIs, pagamento e blockchain são simulados. Nenhuma transação on-chain, carteira real ou cobrança é realizada.

## Stack

- React 19 e TypeScript
- Vite
- TanStack Router e TanStack Query
- Axios
- MSW (Mock Service Worker)
- Decimal.js
- Playwright
- ESLint

## Requisitos

- Node.js e npm instalados.

As versões das dependências usadas pelo projeto estão fixadas no `package-lock.json`.

## Instalação

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal a URL local para abrir a aplicação.

## Mocks com MSW

O MSW é iniciado automaticamente no bootstrap da aplicação e é o modo padrão de execução. Portanto, basta usar o comando de desenvolvimento acima para navegar com os dados simulados.

Para desativar o worker, quando houver uma API externa compatível disponível, inicie com `VITE_ENABLE_MSW=false`:

```bash
$env:VITE_ENABLE_MSW='false'; npm run dev
```

No modo padrão, as requisições não tratadas pelo MSW usam `bypass`.

## Qualidade e build

```bash
# Gera a versão de produção em dist/
npm run build

# Verifica os tipos TypeScript
npm run typecheck

# Executa o lint
npm run lint
```

Também estão disponíveis `npm run preview` para servir o build localmente e `npm run lighthouse` para executar o Lighthouse CI.

## Testes E2E

O Playwright já está configurado para iniciar o servidor Vite em `http://127.0.0.1:4173` durante os testes.

```bash
# Executa os testes E2E
npm run test:e2e

# Abre a interface do Playwright
npm run test:e2e:ui

# Abre o último relatório HTML
npm run test:e2e:report
```

O teste atual cobre o fluxo principal de compra no Chromium desktop: Home → detalhe do NFT → carrinho → checkout → confirmação. Ele também confirma que `/confirmation` redireciona para o carrinho quando não existe pedido confirmado e que a navegação acontece após o `POST /api/orders` retornar `201`.

O projeto possui ainda o perfil `chromium-mobile`, mas esse teste é ignorado nesse perfil porque o fluxo atual tem referência visual somente para desktop.

## Estrutura

```text
src/
  api/             Cliente Axios, contratos e serviços
  app/             App, rotas e estilos globais/de páginas
  features/        Estado do carrinho, catálogo e pedido confirmado
  mocks/           Worker MSW, handlers e fixtures de NFTs
  routes/          Páginas Home, NFT, Cart, Checkout e Confirmation
  lib/             Utilitários
tests/
  e2e/             Teste Playwright do fluxo de compra
public/            Assets estáticos e worker do MSW
```

## Fluxo principal de compra

1. Na Home, o usuário abre o detalhe de um NFT.
2. No detalhe, adiciona o NFT ao carrinho.
3. No carrinho, seleciona **Conectar e finalizar** para abrir o checkout.
4. Em **Confirmar compra**, a aplicação envia o pedido por Axios para `POST /api/orders`.
5. O handler do MSW responde com um pedido de status `confirmed` e HTTP `201`.
6. Somente após essa resposta, o pedido e os itens são gravados no `localStorage`, o carrinho é limpo e a aplicação navega para `/confirmation`.
7. A rota de confirmação exige um pedido confirmado persistido; sem ele, redireciona para `/cart`.

## APIs mockadas

Todas as rotas abaixo são tratadas localmente pelo MSW:

| Método | Endpoint | Comportamento atual |
| --- | --- | --- |
| `GET` | `/api/health` | Retorna `{ "status": "ok" }`. |
| `GET` | `/api/nfts` | Retorna catálogo paginado de NFTs; aceita `q`, `categories`, `networks`, `minPrice`, `maxPrice`, `sort` e `page`. |
| `GET` | `/api/nfts/:id` | Retorna o NFT solicitado; retorna `404` quando não encontrado. |
| `POST` | `/api/orders` | Recebe os itens e totais do checkout; retorna um pedido confirmado com `201`. Retorna `400` para carrinho vazio. |

Para facilitar os estados de erro de catálogo, `GET /api/nfts?q=erro` retorna `503`. Já `GET /api/nfts/erro` retorna `500`.

## Dados simulados e persistência

Os NFTs do catálogo são fixtures locais em `src/mocks/fixtures/nfts.ts`. Os handlers aplicam filtros, ordenação e paginação sobre essa lista e adicionam atrasos artificiais nas respostas de catálogo, detalhe e pedido.

O carrinho é persistido no `localStorage` com a chave `kurio-cart`. Após uma compra simulada concluída, o pedido confirmado e seus itens são persistidos com a chave `kurio-confirmed-order`; por isso a tela de confirmação continua disponível após recarregar a página enquanto esse dado existir.

Não há comando ou mecanismo de reset de cenários implementado. Para reiniciar manualmente o estado simulado no navegador, limpe os dados de armazenamento do site.

## Limitações conhecidas

- Não há backend real, autenticação, cadastro, integração de carteira, pagamento ou blockchain.
- Os dados de catálogo e a resposta de pedido são estáticos/simulados pelo MSW.
- O pedido confirmado do mock usa identificador, referência de transação e data fixos.
- O fluxo E2E atual é validado apenas no perfil desktop; o projeto mobile do Playwright está configurado, mas esse teste é ignorado.
