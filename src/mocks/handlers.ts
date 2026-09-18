import { delay, http, HttpResponse } from 'msw'
import { compareEth } from '@/lib/eth'
import { nftFixtures } from '@/mocks/fixtures/nfts'

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
  http.get('/api/nfts', async ({ request }) => {
    await delay(550)
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim().toLocaleLowerCase() ?? ''
    if (query === 'erro') return HttpResponse.json({ code: 'CATALOG_UNAVAILABLE', message: 'Catálogo indisponível.' }, { status: 503 })

    const categories = searchParams.get('categories')?.split(',').filter(Boolean) ?? []
    const networks = searchParams.get('networks')?.split(',').filter(Boolean) ?? []
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') ?? 'recent'
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const pageSize = 9
    let data = nftFixtures.filter((nft) => {
      const searchable = `${nft.name} ${nft.creator} ${nft.category}`.toLocaleLowerCase()
      return (!query || searchable.includes(query))
        && (!categories.length || categories.includes(nft.category))
        && (!networks.length || networks.includes(nft.network))
        && (!minPrice || compareEth(nft.priceEth, minPrice) >= 0)
        && (!maxPrice || compareEth(nft.priceEth, maxPrice) <= 0)
    })
    if (sort === 'price-asc') data = [...data].sort((a, b) => compareEth(a.priceEth, b.priceEth))
    if (sort === 'price-desc') data = [...data].sort((a, b) => compareEth(b.priceEth, a.priceEth))
    if (sort === 'popular') data = [...data].sort((a, b) => b.edition.availableQuantity - a.edition.availableQuantity)
    const total = data.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    return HttpResponse.json({ data: data.slice((page - 1) * pageSize, page * pageSize), page, pageSize, total, totalPages })
  }),
  http.get('/api/nfts/:id', async ({ params }) => {
    await delay(350)
    if (params.id === 'erro') return HttpResponse.json({ code: 'INTERNAL_ERROR', message: 'Erro interno.' }, { status: 500 })
    const nft = nftFixtures.find((n) => n.id === params.id)
    if (!nft) return HttpResponse.json({ code: 'NOT_FOUND', message: 'NFT não encontrado.' }, { status: 404 })
    return HttpResponse.json(nft)
  }),
]
