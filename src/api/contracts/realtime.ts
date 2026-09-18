import type { Nft } from './nft'
import type { Order } from './order'

export interface NftUpdatedEvent { resourceId: string; version: number; nft: Nft }
export interface OrderUpdatedEvent { resourceId: string; version: number; order: Order }
