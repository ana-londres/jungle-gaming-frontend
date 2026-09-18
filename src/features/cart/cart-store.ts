import { useSyncExternalStore } from 'react'
import type { Nft } from '@/api/contracts/nft'

export interface StoredCartItem {
  nft: Nft
  quantity: number
}

interface CartState {
  items: StoredCartItem[]
}

const STORAGE_KEY = 'kurio-cart'
let state: CartState = readState()
const listeners = new Set<() => void>()

function readState(): CartState {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) as CartState : { items: [] }
    return Array.isArray(parsed.items) ? parsed : { items: [] }
  } catch { return { items: [] } }
}

function save(next: CartState) {
  state = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

export function addToCart(nft: Nft, quantity: number) {
  const current = state.items.find((item) => item.nft.id === nft.id)
  if (current) {
    save({ items: state.items.map((item) => item.nft.id === nft.id ? { ...item, nft, quantity: Math.min(nft.edition.availableQuantity, item.quantity + quantity) } : item) })
    return
  }
  save({ items: [...state.items, { nft, quantity: Math.min(quantity, nft.edition.availableQuantity) }] })
}

export function setCartQuantity(nftId: string, quantity: number) {
  save({ items: state.items.map((item) => item.nft.id === nftId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.nft.edition.availableQuantity)) } : item) })
}

export function removeFromCart(nftId: string) {
  save({ items: state.items.filter((item) => item.nft.id !== nftId) })
}

export function clearCart() {
  save({ items: [] })
}

export function useCart() {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener) },
    () => state,
    () => ({ items: [] }),
  )
}

export function useCartCount() {
  return useCart().items.reduce((total, item) => total + item.quantity, 0)
}
