import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  MagnifyingGlass,
  ShoppingCart,
  UserCircle,
  Heart,
  Minus,
  Plus,
  EnvelopeSimple,
  TwitterLogo,
  LinkedinLogo,
  Star,
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { getNft } from '@/api/services/nft'
import { addToCart, useCartCount } from '@/features/cart/cart-store'
import { queryKeys } from '@/api/query-keys'
import '@/app/styles/nft-detail.css'

const collectionNfts = [
  { name: 'Cosmic Bloom #118', price: '1.29 ETH', imageClass: 'nft-image--left' },
  { name: 'Violet Nomad #314', price: '1.39 ETH', imageClass: 'nft-image' },
  { name: 'Ivory Baron #088', price: '1.79 ETH', imageClass: 'nft-image--right' },
  { name: 'Golden Beat #207', price: '0.99 ETH', imageClass: '' },
  { name: 'Golden Signal #160', price: '0.39 ETH', imageClass: '' },
]

export function NftPage() {
  const { id } = useParams({ from: '/nft/$id' })
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [searchOpen, setSearchOpen] = useState(false)
  const cartCount = useCartCount()

  const nftQuery = useQuery({
    queryKey: queryKeys.nft(id),
    queryFn: ({ signal }) => getNft(id, signal),
  })

  const decrease = () => setQuantity((q) => Math.max(1, q - 1))
  const increase = () => {
    if (nftQuery.data) {
      setQuantity((q) => Math.min(nftQuery.data!.edition.availableQuantity, q + 1))
    }
  }

  return (
    <main className="nft-page">
      {/* ── Header (mesmo que home) ─────────────────────────────── */}
      <header className="site-header">
        <Link to="/" className="site-logo-link">
          <img src="/assets/kurio-logo.svg" alt="Kurio" className="site-logo" />
        </Link>
        <nav className="primary-nav" aria-label="Navegação principal">
          <Link to="/">Início</Link>
          <Link to="/" className="is-active">Mercado</Link>
          <a href="#criadores">Criadores</a>
          <a href="#diario">Aprenda</a>
        </nav>
        <div className="header-actions">
          {searchOpen && (
            <form className="header-search">
              <input autoFocus aria-label="Buscar NFTs" />
              <button aria-label="Confirmar busca"><MagnifyingGlass size={16} /></button>
            </form>
          )}
          <button className="header-icon" onClick={() => setSearchOpen((v) => !v)} aria-label="Buscar">
            <MagnifyingGlass size={21} />
          </button>
          <Link to="/cart" className="header-icon cart-icon" aria-label="Carrinho"><ShoppingCart size={22} /><i>{cartCount}</i></Link>
          <button className="enter-button">
            <UserCircle size={18} weight="bold" /> Entrar
          </button>
        </div>
      </header>

      <div className="nft-detail-shell">
        {nftQuery.isLoading ? (
          <div className="nft-feedback">Carregando NFT...</div>
        ) : nftQuery.isError ? (
          <div className="nft-feedback">NFT não encontrado ou erro na requisição.</div>
        ) : nftQuery.data ? (
          <>
            {/* ── Breadcrumb ──────────────────────────────────────── */}
            <div className="nft-breadcrumb">
              <Link to="/">Início</Link>
              <span> / </span>
              <Link to="/">Mercado</Link>
            </div>

            {/* ── Produto principal ───────────────────────────────── */}
            <section className="nft-product-grid">
              {/* Coluna de imagens */}
              <div className="nft-image-col">
                <div className="nft-thumbnails">
                  {[0, 1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={nftQuery.data.imageUrl}
                      alt={`Variante ${i + 1}`}
                      className={i === 0 ? 'is-active' : ''}
                    />
                  ))}
                </div>
                <div className="nft-main-image">
                  <img src={nftQuery.data.imageUrl} alt={nftQuery.data.name} />
                  <button className="zoom-btn" aria-label="Ampliar imagem">
                    <MagnifyingGlass size={18} />
                  </button>
                </div>
              </div>

              {/* Coluna de informações */}
              <div className="nft-info-col">
                <h1 className="nft-title">{nftQuery.data.name}</h1>

                <div className="nft-price-rating">
                  <span className="nft-price-eth">{nftQuery.data.priceEth} ETH</span>
                  <div className="nft-rating">
                    {[1,2,3,4,5].map((s) => <Star key={s} weight="fill" size={13} color="#e59344" />)}
                    <span>19 avaliações de colecionadores</span>
                  </div>
                </div>

                <div className="nft-about">
                  <strong>Sobre este NFT:</strong>
                  <p>Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.</p>
                </div>

                <div className="nft-edition-block">
                  <strong>Edição:</strong>
                  <div className="edition-badges">
                    <span className="badge">1/1</span>
                    <span className="badge">1/10</span>
                    <span className="badge is-active">1/50</span>
                    <span className="badge">ABERTA</span>
                  </div>
                </div>

                <div className="nft-actions-row">
                  <div className="quantity-selector">
                    <button onClick={decrease} disabled={quantity <= 1} aria-label="Diminuir">
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={increase}
                      disabled={quantity >= nftQuery.data.edition.availableQuantity}
                      aria-label="Aumentar"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="buy-btn" onClick={() => addToCart(nftQuery.data, quantity)}>ADICIONAR AO CARRINHO</button>
                  <button className="fav-btn">
                    <Heart size={16} /> Favoritar
                  </button>
                </div>

                <div className="nft-meta">
                  <p>ID do token: #{nftQuery.data.id.padStart(4, '0')}</p>
                  <p>Coleção: {nftQuery.data.category}</p>
                  <p>Atributos: Óculos, Esmeralda, Raro</p>
                  <div className="nft-share">
                    <span>Compartilhar este NFT:</span>
                    <LinkedinLogo size={16} />
                    <EnvelopeSimple size={16} />
                    <TwitterLogo size={16} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Tabs: Detalhes / Avaliações ─────────────────────── */}
            <div className="nft-tabs-row">
              <button
                className={activeTab === 'details' ? 'is-active' : ''}
                onClick={() => setActiveTab('details')}
              >
                Detalhes do NFT
              </button>
              <button
                className={activeTab === 'reviews' ? 'is-active' : ''}
                onClick={() => setActiveTab('reviews')}
              >
                Avaliações de colecionadores (19)
              </button>
            </div>

            {activeTab === 'details' && (
              <div className="nft-tab-content">
                <p>
                  Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions.
                  Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra
                  explora identidade, movimento e luz em um mundo digital sem fronteiras.
                </p>
                <p>
                  A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores
                  e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos
                  autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.
                </p>
                <div className="nft-detail-fields">
                  <p><strong>Rede:</strong></p>
                  <p>Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.</p>
                  <p><strong>Contrato:</strong></p>
                  <p>Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</p>
                  <p><strong>Direitos autorais:</strong></p>
                  <p>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="nft-tab-content">
                <p>As avaliações dos colecionadores serão exibidas aqui.</p>
              </div>
            )}

            {/* ── Mais desta coleção ──────────────────────────────── */}
            <section className="collection-section">
              <h2>Mais desta coleção</h2>
              <div className="collection-grid">
                {collectionNfts.map((nft) => (
                  <article className="collection-card" key={nft.name}>
                    <div className="nft-image-wrap">
                      <img
                        src={nftQuery.data.imageUrl}
                        alt={nft.name}
                        className={`nft-image ${nft.imageClass}`}
                      />
                    </div>
                    <p className="collection-card-name">{nft.name}</p>
                    <p className="collection-card-price">{nft.price}</p>
                  </article>
                ))}
              </div>
              <div className="collection-dots">
                <i className="dot" />
                <i className="dot is-active" />
                <i className="dot" />
              </div>
            </section>

            {/* ── Newsletter ──────────────────────────────────────── */}
            <section className="newsletter">
              <div className="benefits">
                <Benefit mark="W" title="Segurança da carteira" text="Proteja sua carteira e colecione arte digital verificada em segurança." />
                <Benefit mark="C" title="Criadores em destaque" text="Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede." />
                <Benefit mark="D" title="Alertas de lançamentos" text="Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado." />
              </div>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <h2>Antecipe-se ao próximo lançamento</h2>
                <div>
                  <input type="email" aria-label="Seu e-mail" placeholder="digite seu e-mail..." />
                  <button>Enviar</button>
                </div>
                <p>Receba lançamentos selecionados, histórias de criadores e novidades do mercado.</p>
              </form>
            </section>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="site-footer">
              <div className="footer-top">
                <img src="/assets/kurio-logo.svg" alt="Kurio" />
                <span>Feito para colecionadores,<br />criadores e cultura</span>
                <span>contato@email.com</span>
                <span>+55 11 4002 8922</span>
              </div>
              <div className="footer-links">
                <FooterColumn title="Meu perfil" links={['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse']} />
                <FooterColumn title="Central de ajuda" links={['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item']} />
                <FooterColumn title="Coleções" links={['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade']} />
                <div>
                  <h3>Redes sociais</h3>
                  <p className="socials">
                    <FacebookLogo /><InstagramLogo /><TwitterLogo /><LinkedinLogo /><YoutubeLogo />
                  </p>
                  <h3>Carteiras compatíveis</h3>
                  <p className="wallet-badges">METAMASK&nbsp;&nbsp; WALLETCONNECT&nbsp;&nbsp; COINBASE</p>
                </div>
              </div>
            </footer>
            <p className="copyright">© 2026 Kurio. Propriedade digital para todos.</p>
          </>
        ) : null}
      </div>
    </main>
  )
}

function Benefit({ mark, title, text }: { mark: string; title: string; text: string }) {
  return (
    <article className="benefit">
      <b>{mark}</b>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3>{title}</h3>
      {links.map((link) => <a href="#" key={link}>{link}</a>)}
    </div>
  )
}
