import type { EthAmount } from './common'

export type Network = 'ethereum' | 'polygon' | 'solana'
export type NftSort = 'recent' | 'price-asc' | 'price-desc' | 'popular'

export interface NftEdition {
  id: string
  name: string
  availableQuantity: number
  maxPerOrder: number
}

export interface Nft {
  id: string
  version: number
  name: string
  creator: string
  imageUrl: string
  priceEth: EthAmount
  previousPriceEth?: EthAmount
  network: Network
  category: string
  visualVariant?: 'center' | 'left' | 'right' | 'zoom'
  edition: NftEdition
}

export interface CatalogFilters {
  q?: string
  categories?: string[]
  networks?: Network[]
  minPrice?: EthAmount
  maxPrice?: EthAmount
  sort?: NftSort
  page?: number
}

export interface CatalogResponse {
  data: Nft[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
