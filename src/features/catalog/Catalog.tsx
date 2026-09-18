import { useEffect, useState } from 'react'
import Decimal from 'decimal.js'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { CaretLeft, CaretRight, MagnifyingGlass, SlidersHorizontal } from '@phosphor-icons/react'
import type { CatalogFilters, Network, Nft, NftSort } from '@/api/contracts/nft'
import { getCatalog } from '@/api/services/catalog'
import { queryKeys } from '@/api/query-keys'
import { compareEth } from '@/lib/eth'

const collections = [
  ['Arte digital', 33], ['Fotografia', 12], ['Música', 65], ['Arte 3D', 39], ['Colecionáveis', 23],
  ['Generativa', 17], ['Jogos', 19], ['Assinaturas', 13], ['Utilidade', 18],
] as const
const networks: Array<[Network, number]> = [['ethereum', 119], ['polygon', 78], ['solana', 86]]
const PRICE_MIN = '0.02'
const PRICE_MAX = '12.30'

function pricePosition(value: string) {
  return new Decimal(value).minus(PRICE_MIN).dividedBy(new Decimal(PRICE_MAX).minus(PRICE_MIN)).times(100).toFixed(4)
}

interface CatalogProps {
  filters: CatalogFilters
  activeCategories: string[]
  activeNetworks: Network[]
  onCategoriesChange: (value: string[]) => void
  onNetworksChange: (value: Network[]) => void
  onPriceChange: (minPrice?: string, maxPrice?: string) => void
  onSortChange: (sort: NftSort) => void
  onPageChange: (page: number) => void
}

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function NftCard({ nft }: { nft: Nft }) {
  return (
    <Link to="/nft/$id" params={{ id: nft.id }} className="nft-card">
      <div className="nft-image-wrap">
        <img className={`nft-image nft-image--${nft.visualVariant ?? 'center'}`} src={nft.imageUrl} alt={`NFT ${nft.name}`} />
      </div>
      <h3>{nft.name}</h3>
      <p className="nft-price">{nft.priceEth} ETH {nft.previousPriceEth && <del>{nft.previousPriceEth} ETH</del>}</p>
    </Link>
  )
}

function CatalogSkeleton() {
  return <div className="nft-grid" aria-label="Carregando catálogo" aria-busy="true">
    {Array.from({ length: 8 }, (_, index) => <div className="nft-card" key={index}><div className="shimmer skeleton-image" /><div className="shimmer skeleton-line" /><div className="shimmer skeleton-price" /></div>)}
  </div>
}

export function Catalog({ filters, activeCategories, activeNetworks, onCategoriesChange, onNetworksChange, onPriceChange, onSortChange, onPageChange }: CatalogProps) {
  const catalog = useQuery({ queryKey: queryKeys.catalog(filters), queryFn: ({ signal }) => getCatalog(filters, signal), placeholderData: (previous) => previous })
  const page = filters.page ?? 1
  const minPrice = filters.minPrice ?? PRICE_MIN
  const maxPrice = filters.maxPrice ?? PRICE_MAX
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice)
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice)
  const [priceError, setPriceError] = useState(false)

  useEffect(() => { setDraftMinPrice(minPrice); setDraftMaxPrice(maxPrice); setPriceError(false) }, [minPrice, maxPrice])
  const applyPrice = () => {
    if (compareEth(draftMinPrice, draftMaxPrice) > 0) { setPriceError(true); return }
    onPriceChange(draftMinPrice === PRICE_MIN ? undefined : draftMinPrice, draftMaxPrice === PRICE_MAX ? undefined : draftMaxPrice)
  }

  return <section className="marketplace-shell" aria-label="Catálogo de NFTs">
    <aside className="catalog-sidebar">
      <div className="filter-panel">
        <h2>Coleções</h2>
        <div className="filter-options">
          {collections.map(([label, count]) => <label className="filter-option" key={label}><input type="checkbox" checked={activeCategories.includes(label)} onChange={() => onCategoriesChange(toggle(activeCategories, label))} /><span>{label}</span><b>({count})</b></label>)}
        </div>
        <div className="price-filter">
          <h2>Faixa de preço</h2>
          <div className="range-line" style={{ '--range-start': `${pricePosition(draftMinPrice)}%`, '--range-end': `${pricePosition(draftMaxPrice)}%` } as React.CSSProperties}>
            <span className="range-active" aria-hidden="true" />
            <input className="range-min" type="range" min={PRICE_MIN} max={PRICE_MAX} step="0.01" value={draftMinPrice} aria-label="Preço mínimo" onChange={(event) => { setDraftMinPrice(event.target.value); setPriceError(false) }} />
            <input className="range-max" type="range" min={PRICE_MIN} max={PRICE_MAX} step="0.01" value={draftMaxPrice} aria-label="Preço máximo" onChange={(event) => { setDraftMaxPrice(event.target.value); setPriceError(false) }} />
          </div>
          <p>Preço: {draftMinPrice.replace('.', ',')} - {draftMaxPrice.replace('.', ',')} ETH</p>
          {priceError && <p className="price-error" role="alert">O mínimo deve ser menor que o máximo.</p>}
          <button className="apply-price" onClick={applyPrice}>Aplicar</button>
        </div>
        <div className="network-filter">
          <h2>Rede</h2>
          {networks.map(([network, count]) => <label className="filter-option network-option" key={network}><input type="checkbox" checked={activeNetworks.includes(network)} onChange={() => onNetworksChange(toggle(activeNetworks, network))} /><span>{network[0].toUpperCase() + network.slice(1)}</span><b>({count})</b></label>)}
        </div>
      </div>
      <div className="limited-offer">
        <p>NFT EM DESTAQUE</p><h2>OFERTA LIMITADA</h2>
        <img src="/assets/nft-ape.png" alt="NFT em destaque" />
      </div>
    </aside>
    <div className="catalog-content">
      <div className="catalog-toolbar">
        <div className="catalog-tabs"><button className="is-active">Todos os NFTs</button><button onClick={() => onSortChange('recent')}>Novos lançamentos</button><button onClick={() => onSortChange('popular')}>Em alta</button></div>
        <label className="sort-select">Ordenar por:
          <select value={filters.sort ?? 'recent'} onChange={(event) => onSortChange(event.target.value as NftSort)}><option value="recent">Listados recentemente</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="popular">Em alta</option></select>
        </label>
      </div>
      {catalog.isPending ? <CatalogSkeleton /> : catalog.isError ? <div className="catalog-feedback"><SlidersHorizontal size={28} /><h2>Não foi possível carregar o catálogo</h2><p>Verifique a conexão e tente outra vez.</p><button onClick={() => void catalog.refetch()}>Tentar novamente</button></div> : catalog.data.data.length === 0 ? <div className="catalog-feedback"><MagnifyingGlass size={28} /><h2>Nenhum NFT encontrado</h2><p>Ajuste a busca ou os filtros para explorar outras coleções.</p><button onClick={() => { onCategoriesChange([]); onNetworksChange([]); onPriceChange(undefined, undefined) }}>Limpar filtros</button></div> : <>
        <div className="catalog-status" aria-live="polite">{catalog.isFetching && 'Atualizando catálogo…'}</div>
        <div className="nft-grid">{catalog.data.data.map((nft) => <NftCard key={nft.id} nft={nft} />)}</div>
        <nav className="pagination" aria-label="Paginação do catálogo"><button aria-label="Página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><CaretLeft size={16} /></button>{Array.from({ length: catalog.data.totalPages }, (_, index) => index + 1).map((item) => <button className={page === item ? 'is-active' : ''} key={item} onClick={() => onPageChange(item)}>{item}</button>)}<button aria-label="Próxima página" disabled={page >= catalog.data.totalPages} onClick={() => onPageChange(page + 1)}><CaretRight size={16} /></button></nav>
      </>}
    </div>
  </section>
}
