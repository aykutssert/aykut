import sharp from 'sharp'
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

function safeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'product-result'
}

export async function GET(req: Request) {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const service = createServiceClient()
  const { data: result, error } = await service
    .from('product_results')
    .select('id, image_url, status, product:products(name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 })
  if (result.status !== 'completed' || !result.image_url) {
    return NextResponse.json({ error: 'Result is not completed' }, { status: 400 })
  }

  const imageResponse = await fetch(result.image_url)
  if (!imageResponse.ok) {
    return NextResponse.json({ error: 'Failed to fetch result image' }, { status: 500 })
  }

  const source = Buffer.from(await imageResponse.arrayBuffer())
  const jpeg = await sharp(source).jpeg({ quality: 92, mozjpeg: true }).toBuffer()
  const product = Array.isArray(result.product) ? result.product[0] : result.product
  const filename = `${safeFileName(product?.name ?? 'product-result')}.jpg`

  return new NextResponse(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
