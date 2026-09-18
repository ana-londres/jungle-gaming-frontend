export async function enableMocking() {
  // A entrega é autossuficiente e depende dos mocks no build de demonstração.
  // VITE_ENABLE_MSW=false permite desativá-los quando uma API externa for usada.
  if (import.meta.env.VITE_ENABLE_MSW === 'false') return

  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
