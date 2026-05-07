export function isProductWorkerAuthorized(req: Request) {
  const expectedSecret = process.env.PRODUCT_WORKER_SECRET?.trim()
  if (!expectedSecret) return { ok: false as const, reason: 'missing_secret' }

  const authorization = req.headers.get('authorization')?.trim()
  const bearerSecret = authorization?.toLowerCase().startsWith('bearer ')
    ? authorization.slice(7).trim()
    : ''
  const headerSecret = req.headers.get('x-product-worker-secret')?.trim() ?? ''

  if (bearerSecret === expectedSecret || headerSecret === expectedSecret) {
    return { ok: true as const }
  }

  return {
    ok: false as const,
    reason: 'unauthorized',
  }
}
