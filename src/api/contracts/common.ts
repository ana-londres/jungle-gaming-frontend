export type EthAmount = string
export type IsoDate = string

export interface ApiError {
  code: string
  message: string
  fieldErrors?: Record<string, string>
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
