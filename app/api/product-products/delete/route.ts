import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

function storagePathFromPublicUrl(url: string, bucket: string) {
  try {
    const path = new URL(url).pathname
    const marker = `/object/public/${bucket}/`
    const index = path.indexOf(marker)
    return index >= 0 ? path.slice(index + marker.length) : null
  } catch {
    return null
  }
}

export async function DELETE(req: Request) {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const { id } = await req.json().catch(() => ({})) as { id?: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const service = createServiceClient()
  const { data: product } = await service
    .from('products')
    .select('image_url')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const { data: results, error: resultsError } = await service
    .from('product_results')
    .select('image_url')
    .eq('product_id', id)
    .eq('user_id', user.id)

  if (resultsError) return NextResponse.json({ error: resultsError.message }, { status: 500 })

  const productPath = storagePathFromPublicUrl(product.image_url, 'product-images')
  if (productPath) {
    const { error: removeError } = await service.storage.from('product-images').remove([productPath])
    if (removeError) return NextResponse.json({ error: removeError.message }, { status: 500 })
  }

  const resultPaths = (results ?? [])
    .map((result) => result.image_url ? storagePathFromPublicUrl(result.image_url, 'product-results') : null)
    .filter((path): path is string => Boolean(path))

  if (resultPaths.length > 0) {
    const { error: removeError } = await service.storage.from('product-results').remove(resultPaths)
    if (removeError) return NextResponse.json({ error: removeError.message }, { status: 500 })
  }

  const { error } = await service
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
