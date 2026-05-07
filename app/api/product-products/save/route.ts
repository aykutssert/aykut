import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const MAX_PRODUCT_IMAGE_BYTES = 15 * 1024 * 1024

function storagePathFromPublicUrl(url: string) {
  try {
    const path = new URL(url).pathname
    const marker = '/object/public/product-images/'
    const index = path.indexOf(marker)
    return index >= 0 ? path.slice(index + marker.length) : null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const formData = await req.formData()
  const id = String(formData.get('id') ?? '').trim()
  const file = formData.get('image') as File | null
  const category = String(formData.get('category') ?? 'beauty_wellness').trim()
  const name = String(formData.get('name') ?? '').trim()
  const productNote = String(formData.get('product_note') ?? '').trim()

  if (!id && !file) {
    return NextResponse.json({ error: 'Missing product image' }, { status: 400 })
  }

  if (!category || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const service = createServiceClient()

  const existing = id
    ? await service
      .from('products')
      .select('id, image_url')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    : null

  if (id && !existing?.data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  let imageUrl = existing?.data?.image_url ?? ''
  let uploadedPath: string | null = null

  if (file) {
    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Product image must be smaller than 15MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const webp = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer()
    uploadedPath = `${user.id}/${Date.now()}.webp`

    const { error: uploadError } = await service.storage
      .from('product-images')
      .upload(uploadedPath, webp, { contentType: 'image/webp', upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: publicUrl } = service.storage.from('product-images').getPublicUrl(uploadedPath)
    imageUrl = publicUrl.publicUrl
  }

  const { data, error } = await service
    .from('products')
    .upsert({
      ...(id ? { id } : {}),
      user_id: user.id,
      category,
      name,
      image_url: imageUrl,
      product_note: productNote || null,
    })
    .select('id')
    .single()

  if (error) {
    if (uploadedPath) await service.storage.from('product-images').remove([uploadedPath])
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (uploadedPath && existing?.data?.image_url) {
    const oldPath = storagePathFromPublicUrl(existing.data.image_url)
    if (oldPath) {
      const { error: removeError } = await service.storage.from('product-images').remove([oldPath])
      if (removeError) {
        return NextResponse.json({ error: removeError.message }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ ok: true, id: data.id })
}
