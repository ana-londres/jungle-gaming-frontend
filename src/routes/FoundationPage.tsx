import { ArrowRight, ShoppingBag } from '@phosphor-icons/react'

export function FoundationPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-border pb-5">
        <img src="/assets/kurio-logo.svg" alt="Kurio" className="h-4 w-auto" />
        <ShoppingBag size={20} aria-label="Carrinho" />
      </header>
      <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Base técnica pronta</p>
        <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Marketplace Kurio</h1>
        <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
          A fundação da aplicação está configurada. A interface de descoberta será construída na próxima etapa.
        </p>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          Em preparação <ArrowRight size={18} aria-hidden="true" />
        </span>
      </section>
    </main>
  )
}
