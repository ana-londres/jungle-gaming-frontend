import type { Order } from '@/api/contracts/order'
import type { StoredCartItem } from '@/features/cart/cart-store'

const storageKey = 'kurio-confirmed-order'
export interface ConfirmedOrder { order: Order; items: StoredCartItem[] }

export function saveConfirmedOrder(value: ConfirmedOrder) { localStorage.setItem(storageKey, JSON.stringify(value)) }
export function getConfirmedOrder(): ConfirmedOrder | null {
  try { return JSON.parse(localStorage.getItem(storageKey) ?? 'null') as ConfirmedOrder | null } catch { return null }
}
