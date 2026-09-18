import { Link } from '@tanstack/react-router'
import { ShoppingCart } from '@phosphor-icons/react'

export function CheckoutPage() { return <main className="cart-page checkout-page"><section className="empty-cart"><ShoppingCart size={40} /><h1>Pagamento</h1><p>A etapa de pagamento será concluída no próximo fluxo do desafio.</p><Link to="/cart">Voltar ao carrinho</Link></section></main> }
