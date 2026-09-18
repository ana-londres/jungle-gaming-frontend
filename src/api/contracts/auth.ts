import type { IsoDate } from './common'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export interface Session {
  user: User
  expiresAt: IsoDate
}

export interface LoginInput { email: string; password: string }
export interface RegisterInput { name: string; email: string; password: string }
