import { apiClient } from '@/api/client'
import type { CatalogFilters, CatalogResponse } from '@/api/contracts/nft'

function assertCatalogResponse(payload: unknown): asserts payload is CatalogResponse {
  if (!payload || typeof payload !== 'object') throw new Error('Resposta inválida do catálogo.')
  const response = payload as Partial<CatalogResponse>
  if (!Array.isArray(response.data) || typeof response.page !== 'number' || typeof response.pageSize !== 'number' || typeof response.total !== 'number' || typeof response.totalPages !== 'number') {
    throw new Error('Resposta inválida do catálogo.')
  }
}

export async function getCatalog(filters: CatalogFilters, signal?: AbortSignal) {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.categories?.length) params.set('categories', filters.categories.join(','))
  if (filters.networks?.length) params.set('networks', filters.networks.join(','))
  if (filters.minPrice) params.set('minPrice', filters.minPrice)
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
  if (filters.sort) params.set('sort', filters.sort)
  params.set('page', String(filters.page ?? 1))

  const response = await apiClient.get<CatalogResponse>('/nfts', { params, signal })
  assertCatalogResponse(response.data)
  return response.data
}
