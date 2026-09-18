import { apiClient } from '@/api/client'
import type { CreateOrderInput, Order } from '@/api/contracts/order'

export async function createOrder(input: CreateOrderInput) {
  const response = await apiClient.post<Order>('/orders', input)
  return response.data
}
