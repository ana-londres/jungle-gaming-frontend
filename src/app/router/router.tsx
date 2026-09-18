import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'
import { HomePage } from '@/routes/HomePage'
import { NftPage } from '@/routes/NftPage'
import { CartPage } from '@/routes/CartPage'
import { CheckoutPage } from '@/routes/CheckoutPage'
import { ConfirmationPage } from '@/routes/ConfirmationPage'
import { getConfirmedOrder } from '@/features/orders/confirmed-order'

export interface HomeSearch {
  q?: string
  categories?: string
  networks?: string
  minPrice?: string
  maxPrice?: string
  sort?: 'recent' | 'price-asc' | 'price-desc' | 'popular'
  page?: number
}

function validateHomeSearch(search: Record<string, unknown>): HomeSearch {
  const text = (key: string) => typeof search[key] === 'string' && search[key].trim() ? search[key] : undefined
  const rawPage = typeof search.page === 'number' ? search.page : Number(search.page)
  const sort = text('sort')
  return {
    q: text('q'), categories: text('categories'), networks: text('networks'), minPrice: text('minPrice'), maxPrice: text('maxPrice'),
    sort: sort === 'recent' || sort === 'price-asc' || sort === 'price-desc' || sort === 'popular' ? sort : undefined,
    page: Number.isInteger(rawPage) && rawPage > 1 ? rawPage : undefined,
  }
}

const rootRoute = createRootRoute({ component: Outlet })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: validateHomeSearch,
  component: HomePage,
})

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NftPage,
})

const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: CartPage })
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: CheckoutPage })
const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation',
  beforeLoad: () => {
    if (!getConfirmedOrder()) throw redirect({ to: '/cart' })
  },
  component: ConfirmationPage,
})

const routeTree = rootRoute.addChildren([indexRoute, nftRoute, cartRoute, checkoutRoute, confirmationRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
