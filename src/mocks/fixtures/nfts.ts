import type { Nft } from '@/api/contracts/nft'

const imageUrl = '/assets/nft-ape.png'

const baseNftFixtures: Nft[] = [
  { id: 'emerald-042', version: 1, name: 'Emerald Ape #042', creator: 'Kurio Studio', imageUrl, priceEth: '1.19', network: 'ethereum', category: 'Arte digital', visualVariant: 'center', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 8, maxPerOrder: 3 } },
  { id: 'sage-009', version: 1, name: 'Sage Nomad #009', creator: 'Kurio Studio', imageUrl, priceEth: '1.69', network: 'polygon', category: 'Fotografia', visualVariant: 'left', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 5, maxPerOrder: 2 } },
  { id: 'neon-552', version: 1, name: 'Neon Vessel #552', creator: 'Kurio Studio', imageUrl, priceEth: '1.99', previousPriceEth: '2.29', network: 'ethereum', category: 'Música', visualVariant: 'right', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 12, maxPerOrder: 3 } },
  { id: 'cosmic-118', version: 1, name: 'Cosmic Bloom #118', creator: 'Kurio Studio', imageUrl, priceEth: '1.29', network: 'solana', category: 'Arte 3D', visualVariant: 'left', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 7, maxPerOrder: 2 } },
  { id: 'violet-314', version: 1, name: 'Violet Nomad #314', creator: 'Kurio Studio', imageUrl, priceEth: '1.39', network: 'ethereum', category: 'Colecionáveis', visualVariant: 'zoom', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 4, maxPerOrder: 2 } },
  { id: 'ivory-088', version: 1, name: 'Ivory Baron #088', creator: 'Kurio Studio', imageUrl, priceEth: '1.79', network: 'polygon', category: 'Generativa', visualVariant: 'right', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 6, maxPerOrder: 2 } },
  { id: 'golden-207', version: 1, name: 'Golden Beat #207', creator: 'Kurio Studio', imageUrl, priceEth: '0.99', network: 'ethereum', category: 'Jogos', visualVariant: 'center', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 9, maxPerOrder: 3 } },
  { id: 'signal-160', version: 1, name: 'Golden Signal #160', creator: 'Kurio Studio', imageUrl, priceEth: '0.39', network: 'solana', category: 'Assinaturas', visualVariant: 'zoom', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 10, maxPerOrder: 3 } },
  { id: 'terra-701', version: 1, name: 'Terra Oracle #701', creator: 'Kurio Studio', imageUrl, priceEth: '2.09', network: 'ethereum', category: 'Utilidade', visualVariant: 'left', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 3, maxPerOrder: 1 } },
  { id: 'atlas-035', version: 1, name: 'Atlas Signal #035', creator: 'Kurio Studio', imageUrl, priceEth: '0.79', network: 'polygon', category: 'Arte digital', visualVariant: 'right', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 13, maxPerOrder: 4 } },
  { id: 'fable-420', version: 1, name: 'Fable Circuit #420', creator: 'Kurio Studio', imageUrl, priceEth: '1.09', network: 'solana', category: 'Colecionáveis', visualVariant: 'center', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 9, maxPerOrder: 3 } },
  { id: 'amber-777', version: 1, name: 'Amber Echo #777', creator: 'Kurio Studio', imageUrl, priceEth: '0.59', network: 'ethereum', category: 'Generativa', visualVariant: 'zoom', edition: { id: 'standard', name: 'Edição padrão', availableQuantity: 14, maxPerOrder: 5 } },
]

// O catálogo usa variações determinísticas dos mesmos assets disponíveis para
// oferecer paginação suficiente sem introduzir imagens não fornecidas.
export const nftFixtures: Nft[] = Array.from({ length: 32 }, (_, index) => {
  const source = baseNftFixtures[index % baseNftFixtures.length]
  const sequence = String(index + 1).padStart(3, '0')
  return { ...source, id: `${source.id}-${sequence}`, name: index < baseNftFixtures.length ? source.name : `${source.name.split(' #')[0]} #${sequence}` }
})
