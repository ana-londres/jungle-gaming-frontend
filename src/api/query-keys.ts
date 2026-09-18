import type { CatalogFilters } from './contracts/nft'

export const queryKeys = {
  session: ['session'] as const,
  catalog: (filters: CatalogFilters) => ['catalog', filters] as const,
  nft: (id: string) => ['nft', id] as const,
  cart: (userId: string | null) => ['cart', userId] as const,
  favorites: (userId: string) => ['favorites', userId] as const,
  wallets: (userId: string) => ['wallets', userId] as const,
  order: (userId: string, id: string) => ['orders', userId, id] as const,
}
