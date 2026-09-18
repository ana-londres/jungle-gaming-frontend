import { Link, useNavigate } from '@tanstack/react-router'
import Decimal from 'decimal.js'
import { Minus, Plus, ShoppingCart, Trash, UserCircle, MagnifyingGlass } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { removeFromCart, setCartQuantity, useCart } from '@/features/cart/cart-store'
import '@/app/styles/cart.css'

const fee = new Decimal('0.016')
const validCoupon = 'KURIO10'
const formatEth = (value: Decimal) => value.toFixed(3).replace(/\.000$/, '')

export function CartPage() {
  const { items } = useCart()
  const navigate = useNavigate({ from: '/cart' })
  const [coupon, setCoupon] = useState('')
  const [couponState, setCouponState] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const subtotal = useMemo(() => items.reduce((total, item) => total.plus(new Decimal(item.nft.priceEth).times(item.quantity)), new Decimal(0)), [items])
  const discount = couponState === 'valid' ? subtotal.times('0.10') : new Decimal(0)
  const total = subtotal.minus(discount).plus(items.length ? fee : 0)
  const applyCoupon = () => setCouponState(coupon.trim().toUpperCase() === validCoupon ? 'valid' : 'invalid')

  return <main className="cart-page">
    <header className="site-header">
      <Link to="/" className="site-logo-link"><img src="/assets/kurio-logo.svg" alt="Kurio" className="site-logo" /></Link>
      <nav className="primary-nav" aria-label="Navegação principal"><Link to="/">Início</Link><Link to="/" className="is-active">Mercado</Link><a href="#criadores">Criadores</a><a href="#diario">Aprenda</a></nav>
      <div className="header-actions"><button className="header-icon" aria-label="Buscar"><MagnifyingGlass size={21} /></button><Link to="/cart" className="header-icon cart-icon" aria-label="Carrinho"><ShoppingCart size={22} /><i>{items.reduce((sum, item) => sum + item.quantity, 0)}</i></Link><button className="enter-button"><UserCircle size={18} weight="bold" /> Entrar</button></div>
    </header>
    <section className="cart-shell">
      <p className="cart-breadcrumb"><Link to="/">Início</Link> / <Link to="/">Mercado</Link> / Carrinho</p>
      {items.length === 0 ? <EmptyCart /> : <div className="cart-layout">
        <section className="cart-items" aria-label="Itens do carrinho">
          <div className="cart-head"><b>NFTs</b><b>Preço</b><b>Edições</b><b>Total</b></div>
          {items.map(({ nft, quantity }) => <article className="cart-item" key={nft.id}>
            <img src={nft.imageUrl} className={`cart-item-image nft-image--${nft.visualVariant ?? 'center'}`} alt={nft.name} />
            <div className="cart-item-name"><strong>{nft.name}</strong><span>ID do token: #{nft.id.slice(-4)}</span></div>
            <b className="cart-price">{nft.priceEth} ETH</b>
            <div className="cart-quantity"><button onClick={() => setCartQuantity(nft.id, quantity - 1)} disabled={quantity === 1} aria-label={`Diminuir quantidade de ${nft.name}`}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setCartQuantity(nft.id, quantity + 1)} disabled={quantity >= nft.edition.availableQuantity} aria-label={`Aumentar quantidade de ${nft.name}`}><Plus size={14} /></button></div>
            <b className="cart-total">{formatEth(new Decimal(nft.priceEth).times(quantity))} ETH</b>
            <button className="remove-item" onClick={() => removeFromCart(nft.id)} aria-label={`Remover ${nft.name}`}><Trash size={20} /></button>
          </article>)}
        </section>
        <aside className="cart-summary"><h1>Resumo da carteira</h1><div className="summary-rule" /><label htmlFor="coupon">Código promocional</label><div className="coupon-form"><input id="coupon" value={coupon} onChange={(event) => { setCoupon(event.target.value); setCouponState('idle') }} placeholder="Digite o código promocional..." /><button onClick={applyCoupon}>Aplicar</button></div>{couponState === 'valid' && <p className="coupon-success" role="status">Cupom KURIO10 aplicado: 10% de desconto.</p>}{couponState === 'invalid' && <p className="coupon-error" role="alert">Código promocional inválido.</p>}<dl><div><dt>Subtotal</dt><dd>{formatEth(subtotal)} ETH</dd></div><div><dt>Desconto do lançamento</dt><dd>(-) {formatEth(discount)} ETH</dd></div><div><dt>Taxa de rede <small>Taxa estimada</small></dt><dd>{formatEth(fee)} ETH</dd></div><div className="summary-total"><dt>Total</dt><dd>{formatEth(total)} ETH</dd></div></dl><button className="checkout-button" onClick={() => navigate({ to: '/checkout' })}>Conectar e finalizar</button><Link to="/" className="continue-link">Continuar explorando</Link></aside>
      </div>}
      <Recommendations />
    </section>
  </main>
}

function EmptyCart() { return <section className="empty-cart"><ShoppingCart size={40} /><h1>Sua carteira está vazia</h1><p>Explore NFTs selecionados e adicione suas próximas obras à coleção.</p><Link to="/">Explorar o mercado</Link></section> }

function Recommendations() { return <section className="cart-recommendations"><h2>Colecionadores também viram</h2><div>{['Cosmic Bloom #118', 'Violet Nomad #314', 'Ivory Baron #088', 'Golden Beat #207', 'Golden Signal #160'].map((name, index) => <article key={name}><img src="/assets/nft-ape.png" className={`nft-image--${['left', 'zoom', 'right', 'center', 'center'][index]}`} alt={name} /><p>{name}</p><b>{['1.29', '1.39', '1.79', '0.99', '0.39'][index]} ETH</b></article>)}</div></section> }
