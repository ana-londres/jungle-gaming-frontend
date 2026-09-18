import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowRight, FacebookLogo, InstagramLogo, LinkedinLogo, MagnifyingGlass, ShoppingCart, TwitterLogo, UserCircle, YoutubeLogo } from '@phosphor-icons/react'
import type { CatalogFilters, Network, NftSort } from '@/api/contracts/nft'
import { Catalog } from '@/features/catalog/Catalog'
import type { HomeSearch } from '@/app/router/router'
import { useCartCount } from '@/features/cart/cart-store'

const journalEntries = [
  ['Como funciona a propriedade de NFTs', 'Aprenda a colecionar, negociar e verificar ativos digitais.'],
  ['10 artistas digitais para acompanhar', 'Conheça criadores que moldam a cultura digital.'],
  ['Raridade, atributos e procedência', 'Entenda raridade, procedência, direitos autorais e utilidade.'],
  ['Como proteger sua carteira', 'Proteja sua carteira, seus ativos e sua identidade digital na rede.'],
]

function split(value?: string) { return value?.split(',').filter(Boolean) ?? [] }
function join(values: string[]) { return values.length ? values.join(',') : undefined }

export function HomePage() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [searchOpen, setSearchOpen] = useState(Boolean(search.q))
  const [searchValue, setSearchValue] = useState(search.q ?? '')
  const cartCount = useCartCount()
  const categories = split(search.categories)
  const networks = split(search.networks) as Network[]
  const filters: CatalogFilters = { q: search.q, categories, networks, minPrice: search.minPrice, maxPrice: search.maxPrice, sort: search.sort, page: search.page ?? 1 }

  useEffect(() => { setSearchValue(search.q ?? '') }, [search.q])
  const updateSearch = (next: Partial<HomeSearch>, resetPage = true) => navigate({ search: (previous) => {
    const current = previous as HomeSearch
    return { ...current, ...next, page: resetPage ? undefined : next.page ?? current.page }
  } })
  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); updateSearch({ q: searchValue || undefined }) }

  return <main className="home-page">
    <header className="site-header">
      <img src="/assets/kurio-logo.svg" alt="Kurio" className="site-logo" />
      <nav className="primary-nav" aria-label="Navegação principal"><a className="is-active" href="#inicio">Início</a><a href="#mercado">Mercado</a><a href="#criadores">Criadores</a><a href="#diario">Aprenda</a></nav>
      <div className="header-actions">
        {searchOpen && <form className="header-search" onSubmit={submitSearch}><input autoFocus aria-label="Buscar NFTs" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} /><button aria-label="Confirmar busca"><MagnifyingGlass size={16} /></button></form>}
        <button className="header-icon" onClick={() => setSearchOpen((value) => !value)} aria-label="Buscar"><MagnifyingGlass size={21} /></button>
        <Link to="/cart" className="header-icon cart-icon" aria-label="Carrinho"><ShoppingCart size={22} /><i>{cartCount}</i></Link>
        <button className="enter-button"><UserCircle size={18} weight="bold" /> Entrar</button>
      </div>
    </header>

    <section id="inicio" className="hero-section">
      <div className="hero-copy"><p>Bem-vindo à Kurio</p><h1>SEJA DONO DO FUTURO<br />DA ARTE DIGITAL</h1><span>Descubra NFTs selecionados de criadores emergentes e consagrados.<br />Colecione arte digital rara, apoie artistas e tenha uma parte da<br />cultura da internet.</span><button className="amber-button" onClick={() => document.getElementById('mercado')?.scrollIntoView({ behavior: 'smooth' })}>EXPLORAR</button></div>
      <div className="hero-art"><img src="/assets/nft-ape.png" alt="NFT em destaque" /><div className="carousel-dots"><i /><i /><i /></div></div>
    </section>

    <section id="mercado"><Catalog filters={filters} activeCategories={categories} activeNetworks={networks} onCategoriesChange={(value) => updateSearch({ categories: join(value) })} onNetworksChange={(value) => updateSearch({ networks: join(value) })} onPriceChange={(minPrice, maxPrice) => updateSearch({ minPrice, maxPrice })} onSortChange={(sort: NftSort) => updateSearch({ sort })} onPageChange={(page) => updateSearch({ page }, false)} /></section>

    <section className="promotion-row" aria-label="Destaques"><Promo imageClass="promo-image--left" title="Lançamentos gênesis de edição limitada" text="Colecione edições escassas diretamente dos criadores antes de serem reveladas ao público." /><Promo imageClass="promo-image--right" title="Arte digital selecionada e muito mais" text="Explore novos artistas, coleções verificadas e obras digitais que influenciam a cultura." /></section>
    <section id="diario" className="journal-section"><h2>Diário da Cunhagem</h2><p>Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p><div className="journal-grid">{journalEntries.map(([title, text], index) => <article className="journal-card" key={title}><img src="/assets/nft-ape.png" className={`journal-image journal-image--${index}`} alt="" /><div><small>{['12 de setembro | Leitura de 6 min', '13 de setembro | Leitura de 2 min', '15 de setembro | Leitura de 3 min', '15 de setembro | Leitura de 2 min'][index]}</small><h3>{title}</h3><p>{text}</p><button>Ler mais <ArrowRight size={13} /></button></div></article>)}</div></section>
    <section className="newsletter"><div className="benefits"><Benefit mark="W" title="Segurança da carteira" text="Proteja sua carteira e colecione arte digital verificada em segurança." /><Benefit mark="C" title="Criadores em destaque" text="Conheça artistas e estúdios de todo o mundo que moldam a cultura digital na rede." /><Benefit mark="D" title="Alertas de lançamentos" text="Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado." /></div><form className="newsletter-form" onSubmit={(event) => event.preventDefault()}><h2>Antecipe-se ao próximo lançamento</h2><div><input type="email" aria-label="Seu e-mail" placeholder="digite seu e-mail..." /><button>Enviar</button></div><p>Receba lançamentos selecionados, histórias de criadores e novidades do mercado.</p></form></section>
    <footer className="site-footer"><div className="footer-top"><img src="/assets/kurio-logo.svg" alt="Kurio" /><span>Feito para colecionadores,<br />criadores e cultura</span><span>contato@email.com</span><span>+55 11 4002 8922</span></div><div className="footer-links"><FooterColumn title="Meu perfil" links={['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse']} /><FooterColumn title="Central de ajuda" links={['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item']} /><FooterColumn title="Coleções" links={['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade']} /><div><h3>Redes sociais</h3><p className="socials"><FacebookLogo /><InstagramLogo /><TwitterLogo /><LinkedinLogo /><YoutubeLogo /></p><h3>Carteiras compatíveis</h3><p className="wallet-badges">METAMASK&nbsp;&nbsp; WALLETCONNECT&nbsp;&nbsp; COINBASE</p></div></div></footer><p className="copyright">© 2026 Kurio. Propriedade digital para todos.</p>
  </main>
}

function Promo({ imageClass, title, text }: { imageClass: string; title: string; text: string }) { return <article className="promo-banner"><img className={imageClass} src="/assets/nft-ape.png" alt="NFT em destaque" /><div><h2>{title}</h2><p>{text}</p><button>Explorar <ArrowRight size={14} /></button></div></article> }
function Benefit({ mark, title, text }: { mark: string; title: string; text: string }) { return <article className="benefit"><b>{mark}</b><div><h3>{title}</h3><p>{text}</p></div></article> }
function FooterColumn({ title, links }: { title: string; links: string[] }) { return <div><h3>{title}</h3>{links.map((link) => <a href="#inicio" key={link}>{link}</a>)}</div> }
