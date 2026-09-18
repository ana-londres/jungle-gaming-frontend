# Kurio NFT Marketplace

Aplicação front-end de um marketplace de NFTs criada para o challenge. Ela permite explorar um catálogo, consultar o detalhe de um NFT, adicioná-lo ao carrinho e concluir uma compra simulada até a confirmação do pedido.

> APIs, pagamento e blockchain são simulados. Nenhuma transação on-chain, carteira real ou cobrança é realizada.

## Demonstração

**Aplicação publicada:** https://jungle-gaming-frontend.vercel.app/

O fluxo principal de compra pode ser testado diretamente na aplicação publicada: Home → detalhe do NFT → carrinho → checkout → confirmação.

## Testes E2E

O Playwright está configurado para iniciar o servidor Vite em `http://127.0.0.1:4173` durante os testes.

```bash
# Executa os testes E2E
npm run test:e2e

# Abre a interface do Playwright
npm run test:e2e:ui

# Abre o último relatório HTML
npm run test:e2e:report
```

Os testes atuais cobrem o fluxo principal de compra no Chromium desktop e mobile: Home → detalhe do NFT → carrinho → checkout → confirmação.

O fluxo também valida que `/confirmation` redireciona para o carrinho quando não existe pedido confirmado, que a navegação para a confirmação acontece somente após o `POST /api/orders` retornar `201` e que as principais etapas não apresentam overflow horizontal no mobile.

A cobertura ainda não contempla todos os 12 grupos de cenários especificados no desafio.

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

A implementação foi priorizada para entregar um fluxo principal de descoberta e compra funcional, responsivo e testado dentro do prazo do desafio. Os pontos abaixo permanecem simplificados ou não implementados:

* Backend e integrações reais: não há backend real, autenticação real, cadastro, integração com carteiras, processamento de pagamento ou blockchain. Essas partes são simuladas conforme o escopo do desafio.
* Autenticação e conta: as telas e fluxos de login, cadastro, sessão autenticada, perfil do colecionador e gerenciamento de carteiras não foram implementados nesta versão.
* Catálogo: o catálogo utiliza dados estáticos fornecidos pelo MSW e não representa uma integração com um catálogo real.
* Compra: o fluxo de compra foi implementado através de Axios + MSW, com `POST /api/orders` e resposta simulada de confirmação. Não há processamento financeiro ou transação blockchain real.
* Pedido confirmado: identificador do pedido, referência de transação e data são gerados pelo cenário mock e não representam uma transação real.
* Realtime: não foi implementada a cobertura completa de eventos em tempo real com Socket.IO prevista no desafio, incluindo atualização de preço/disponibilidade durante o checkout e reconciliação de pedidos pendentes.
* Cenários de falha: não foram implementados todos os cenários de erro e recuperação previstos no desafio, como expiração de sessão, alteração de preço durante a compra, conflitos de disponibilidade, cupons inválidos/expirados, timeout após criação do pedido e recuperação por idempotência.
* Testes E2E: foi implementado e validado um teste E2E do fluxo principal de compra com Playwright, incluindo execução em Chromium desktop e mobile. A cobertura ainda não contempla todos os 12 grupos de cenários especificados no desafio.
* Lighthouse: não foi realizada uma rodada completa de auditoria e otimização conforme as metas de Lighthouse especificadas no desafio.

Essas simplificações foram adotadas para priorizar, dentro do prazo disponível, a entrega do fluxo principal, sua responsividade, a simulação de API, os testes E2E e a documentação do projeto.