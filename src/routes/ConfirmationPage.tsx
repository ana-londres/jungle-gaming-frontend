import { Link } from '@tanstack/react-router'
import Decimal from 'decimal.js'
import { EnvelopeSimple, X } from '@phosphor-icons/react'
import { getConfirmedOrder } from '@/features/orders/confirmed-order'
import '@/app/styles/confirmation.css'

const eth = (value: Decimal | string) => new Decimal(value).toFixed(3).replace(/\.000$/, '')

export function ConfirmationPage() {
  const confirmedOrder = getConfirmedOrder()
  if (!confirmedOrder) return null

  const { order, items } = confirmedOrder
  const date = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(order.createdAt))

  return <main className="confirmation-page"><section className="confirmation-card"><Link to="/" className="confirmation-close" aria-label="Fechar confirmação"><X size={17} /></Link><header className="confirmation-title"><EnvelopeSimple size={63} weight="thin" /><strong>Seus NFTs agora estão na sua carteira</strong></header><div className="confirmation-meta"><span><b>ID da transação</b>{order.transactionReference}</span><span><b>Data</b>{date}</span><span><b>Total</b>{eth(order.totalEth)} ETH</span><span><b>Carteira</b>MetaMask</span></div><section className="confirmation-details"><h1>Detalhes da transação</h1><div className="confirmation-head"><b>NFTs</b><b>Edições</b><b>Subtotal</b></div>{items.map(({ nft, quantity }) => <article className="confirmation-item" key={nft.id}><img src={nft.imageUrl} className={`nft-image--${nft.visualVariant ?? 'center'}`} alt={nft.name} /><div><strong>{nft.name}</strong><span>ID do token: #{nft.id.slice(-4)}</span></div><span>(x {quantity})</span><b>{eth(new Decimal(nft.priceEth).times(quantity))} ETH</b></article>)}<dl><div><dt>Taxa de rede</dt><dd>{eth(order.networkFeeEth)} ETH</dd></div><div><dt>Total</dt><dd>{eth(order.totalEth)} ETH</dd></div></dl></section><footer className="confirmation-footer"><p>Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.</p><button type="button">Ver no Etherscan</button></footer></section></main>
}
