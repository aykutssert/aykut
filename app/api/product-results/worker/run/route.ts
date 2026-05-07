import { NextResponse } from 'next/server'
import { isProductWorkerAuthorized } from '@/lib/product-worker-auth'
import { runNextProductGenerationJob } from '@/lib/product-worker'

export async function POST(req: Request) {
  const auth = isProductWorkerAuthorized(req)

  if (!auth.ok && auth.reason === 'missing_secret') {
    return NextResponse.json({ error: 'PRODUCT_WORKER_SECRET is not configured' }, { status: 500 })
  }

  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runNextProductGenerationJob()
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
