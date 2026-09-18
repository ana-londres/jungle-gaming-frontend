import { apiClient } from '@/api/client'
import type { Nft } from '@/api/contracts/nft'

export async function getNft(id: string, signal?: AbortSignal) {
  const response = await apiClient.get<Nft>(`/nfts/${id}`, { signal })
  return response.data
}

