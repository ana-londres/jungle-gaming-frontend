import type { EthAmount } from './common'

export interface CartItem {
  id: string
  nftId: string
  editionId: string
  quantity: number
}

export interface Cart {
  id: string
  items: CartItem[]
  updatedAt: string
}

export interface Quote {
  subtotalEth: EthAmount
  discountEth: EthAmount
  networkFeeEth: EthAmount
  totalEth: EthAmount
  validUntil: string
  version: number
}
