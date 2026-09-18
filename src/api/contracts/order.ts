import type { CartItem } from './cart'
import type { EthAmount, IsoDate } from './common'

export type OrderStatus = 'pending' | 'confirmed' | 'declined'

export interface Order {
  id: string
  version: number
  status: OrderStatus
  transactionReference: string
  items: CartItem[]
  subtotalEth: EthAmount
  discountEth: EthAmount
  networkFeeEth: EthAmount
  totalEth: EthAmount
  createdAt: IsoDate
}

export interface CreateOrderInput {
  quoteVersion: number
  idempotencyKey: string
  walletId: string
  network: string
  items: CartItem[]
  subtotalEth: EthAmount
  discountEth: EthAmount
  networkFeeEth: EthAmount
  totalEth: EthAmount
}
