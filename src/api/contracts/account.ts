import type { Network } from './nft'

export interface ProfileInput {
  name: string
  avatarUrl: string | null
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export interface Wallet {
  id: string
  label: string
  address: string
  network: Network
  isPrimary: boolean
}

export interface WalletInput {
  label: string
  address: string
  network: Network
  isPrimary: boolean
}
