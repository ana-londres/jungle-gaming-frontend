import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import Decimal from 'decimal.js'
import { MagnifyingGlass, ShoppingCart, UserCircle } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { createOrder } from '@/api/services/order'
import { clearCart, useCart } from '@/features/cart/cart-store'
import { saveConfirmedOrder } from '@/features/orders/confirmed-order'
import '@/app/styles/checkout.css'

const fee = new Decimal('0.016')
const eth = (value: Decimal) => value.toFixed(3).replace(/\.000$/, '')

type FieldName = 'displayName' | 'username' | 'network' | 'profileName' | 'walletAddress' | 'walletType' | 'referralCode' | 'email' | 'ensName'
type CheckoutFields = Record<FieldName, string>
type FieldErrors = Partial<Record<FieldName, string>>

const initialFields: CheckoutFields = { displayName: '', username: '', network: '', profileName: '', walletAddress: '', walletType: '', referralCode: '', email: '', ensName: '' }
const requiredFields: Array<[FieldName, string]> = [
  ['displayName', 'Informe o nome de exibição.'], ['username', 'Informe o nome de usuário.'], ['network', 'Selecione uma rede.'], ['profileName', 'Informe o nome do perfil.'], ['walletAddress', 'Informe o endereço da carteira.'], ['walletType', 'Selecione um tipo de carteira.'], ['referralCode', 'Informe o código de indicação.'], ['email', 'Informe o e-mail.'], ['ensName', 'Selecione o nome ENS.'],
]

function validateFields(fields: CheckoutFields): FieldErrors {
  const errors: FieldErrors = {}
  requiredFields.forEach(([name, message]) => { if (!fields[name].trim()) errors[name] = message })
  if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) errors.email = 'Informe um e-mail válido.'
  return errors
}

export function CheckoutPage() {
  const { items } = useCart()
  const navigate = useNavigate({ from: '/checkout' })
  const [wallet, setWallet] = useState('Coinbase Wallet')
  const [fields, setFields] = useState<CheckoutFields>(initialFields)
  const [errors, setErrors] = useState<FieldErrors>({})
  const subtotal = useMemo(() => items.reduce((sum, item) => sum.plus(new Decimal(item.nft.priceEth).times(item.quantity)), new Decimal(0)), [items])
  const total = subtotal.plus(items.length ? fee : 0)
  const purchase = useMutation({ mutationFn: () => createOrder({ quoteVersion: 1, idempotencyKey: crypto.randomUUID(), walletId: wallet.toLowerCase().replaceAll(' ', '-'), network: fields.network, items: items.map(({ nft, quantity }) => ({ id: nft.id, nftId: nft.id, editionId: nft.edition.id, quantity })), subtotalEth: eth(subtotal), discountEth: '0', networkFeeEth: eth(fee), totalEth: eth(total) }), onSuccess: (order) => { saveConfirmedOrder({ order, items }); clearCart(); void navigate({ to: '/confirmation' }) } })
  const updateField = (name: FieldName, value: string) => {
    setFields((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }
  const handlePurchase = () => {
    const nextErrors = validateFields(fields)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    purchase.mutate()
  }

  return <main className="checkout-page"><header className="site-header checkout-header"><Link to="/"><img src="/assets/kurio-logo.svg" alt="Kurio" className="site-logo" /></Link><nav className="primary-nav"><Link to="/">Início</Link><Link to="/" className="is-active">Mercado</Link><a href="#criadores">Criadores</a><a href="#diario">Aprenda</a></nav><div className="header-actions"><button className="header-icon" aria-label="Buscar"><MagnifyingGlass size={21} /></button><Link to="/cart" className="header-icon cart-icon" aria-label="Carrinho"><ShoppingCart size={22} /><i>{items.reduce((sum, item) => sum + item.quantity, 0)}</i></Link><button className="enter-button"><UserCircle size={18} weight="bold" /> Entrar</button></div></header><section className="checkout-shell"><p className="checkout-breadcrumb"><Link to="/">Início</Link> / <Link to="/">Mercado</Link> / Pagamento</p><div className="checkout-layout"><form className="collector-form" onSubmit={(event) => { event.preventDefault(); handlePurchase() }} noValidate><h1>Perfil do colecionador</h1><div className="form-grid"><Field label="Nome de exibição" name="displayName" value={fields.displayName} error={errors.displayName} onChange={updateField} /><Field label="Nome de usuário" name="username" value={fields.username} error={errors.username} onChange={updateField} /><Select label="Rede" text="Selecione uma rede" name="network" value={fields.network} error={errors.network} onChange={updateField} /><Field label="Nome do perfil" name="profileName" value={fields.profileName} error={errors.profileName} onChange={updateField} /><Field label="Endereço da carteira" name="walletAddress" value={fields.walletAddress} error={errors.walletAddress} placeholder="Endereço 0x da carteira" onChange={updateField} /><Field label="ENS ou carteira secundária" name="secondaryWallet" optional value="" onChange={() => undefined} /><Select label="Tipo de carteira" text="Selecione uma carteira" name="walletType" value={fields.walletType} error={errors.walletType} onChange={updateField} /><Field label="Código de indicação" name="referralCode" value={fields.referralCode} error={errors.referralCode} onChange={updateField} /><Field label="E-mail" name="email" value={fields.email} error={errors.email} type="email" onChange={updateField} /><Select label="Nome ENS" text=".eth" name="ensName" value={fields.ensName} error={errors.ensName} onChange={updateField} /></div><label className="other-wallet"><input type="checkbox" /> Usar outra carteira?</label><label className="notes">Observação do colecionador <span>(opcional)</span><textarea /></label></form><aside className="checkout-summary"><h2>Seus NFTs</h2><div className="checkout-head"><b>NFTs</b><b>Subtotal</b></div>{items.map(({ nft, quantity }) => <article className="checkout-item" key={nft.id}><img src={nft.imageUrl} className={`nft-image--${nft.visualVariant ?? 'center'}`} alt={nft.name} /><div><strong>{nft.name} <small>(x {quantity})</small></strong><span>ID do token: #{nft.id.slice(-4)}</span></div><b>{eth(new Decimal(nft.priceEth).times(quantity))} ETH</b></article>)}{!items.length && <p className="checkout-empty">Nenhum NFT no carrinho.</p>}<p className="checkout-coupon">Tem um código promocional? Aplique aqui</p><dl><div><dt>Subtotal</dt><dd>{eth(subtotal)} ETH</dd></div><div><dt>Desconto do lançamento</dt><dd>(-) 00.00</dd></div><div><dt>Taxa de rede <small>Taxa estimada</small></dt><dd>{eth(fee)} ETH</dd></div><div className="checkout-total"><dt>Total</dt><dd>{eth(total)} ETH</dd></div></dl><h2 className="wallet-title">Carteira e rede</h2>{['METAMASK · WALLETCONNECT · COINBASE', 'MetaMask', 'Coinbase Wallet'].map((option) => <label className={`wallet-option ${wallet === option ? 'is-selected' : ''}`} key={option}><input type="radio" name="wallet" checked={wallet === option} onChange={() => setWallet(option)} /><span>{option}</span></label>)}{purchase.isError && <p className="checkout-order-error" role="alert">Não foi possível confirmar a compra. Tente novamente.</p>}<button className="confirm-purchase" type="button" disabled={!items.length || purchase.isPending} onClick={handlePurchase}>{purchase.isPending ? 'Confirmando...' : 'Confirmar compra'}</button></aside></div></section></main>
}

interface FieldProps { label: string; name: FieldName | 'secondaryWallet'; value: string; onChange: (name: FieldName, value: string) => void; error?: string; placeholder?: string; type?: string; optional?: boolean }

function Field({ label, name, value, onChange, error, placeholder, type = 'text', optional = false }: FieldProps) {
  return <label>{label}{!optional && <em> *</em>}<input name={name} type={type} value={value} onChange={(event) => onChange(name as FieldName, event.target.value)} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} />{error && <small className="field-error" id={`${name}-error`} role="alert">{error}</small>}</label>
}

interface SelectProps { label: string; text: string; name: FieldName; value: string; onChange: (name: FieldName, value: string) => void; error?: string }

function Select({ label, text, name, value, onChange, error }: SelectProps) {
  return <label>{label}<em> *</em><select name={name} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined}><option value="" disabled>{text}</option><option>Ethereum</option><option>Polygon</option></select>{error && <small className="field-error" id={`${name}-error`} role="alert">{error}</small>}</label>
}
