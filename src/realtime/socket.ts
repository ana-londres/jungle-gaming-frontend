import { io, type Socket } from 'socket.io-client'
import type { NftUpdatedEvent, OrderUpdatedEvent } from '@/api/contracts/realtime'

export interface ServerToClientEvents {
  'nft.updated': (event: NftUpdatedEvent) => void
  'order.updated': (event: OrderUpdatedEvent) => void
}

export interface ClientToServerEvents {
  subscribe: (resource: 'catalog' | 'cart' | 'orders', acknowledgement?: () => void) => void
  unsubscribe: (resource: 'catalog' | 'cart' | 'orders') => void
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined

export function getRealtimeSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL ?? window.location.origin, {
      autoConnect: false,
      transports: ['websocket'],
    })
  }

  return socket
}

export function disposeRealtimeSocket() {
  socket?.disconnect()
  socket = undefined
}
