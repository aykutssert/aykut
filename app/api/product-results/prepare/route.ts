import { NextResponse } from 'next/server'
import { isProductImageQuality, isProductImageSize } from '@/lib/product-image-sizes'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as {
    product_id?: string
    template_id?: string
    final_prompt?: string
    image_size?: string
    image_quality?: string
  }

  const productId = body.product_id?.trim()
  const templateId = body.template_id?.trim()
  const finalPrompt = body.final_prompt?.trim()
  const imageSize = body.image_size?.trim() || '1:1'
  const imageQuality = body.image_quality?.trim() || 'medium'

  if (!productId || !templateId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!isProductImageSize(imageSize)) {
    return NextResponse.json({ error: 'Invalid image size' }, { status: 400 })
  }

  if (!isProductImageQuality(imageQuality)) {
    return NextResponse.json({ error: 'Invalid image quality' }, { status: 400 })
  }

  const service = createServiceClient()
  const [{ data: product }, { data: template }] = await Promise.all([
    service
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('user_id', user.id)
      .maybeSingle(),
    service
      .from('product_templates')
      .select('id')
      .eq('id', templateId)
      .eq('is_active', true)
      .maybeSingle(),
  ])

  if (!product || !template) {
    return NextResponse.json({ error: 'Product or template not found' }, { status: 404 })
  }

  const { data, error } = await service
    .from('product_results')
    .insert({
      user_id: user.id,
      product_id: productId,
      template_id: templateId,
      image_size: imageSize,
      image_quality: imageQuality,
      final_prompt: finalPrompt || 'Place the selected product into the selected template scene.',
      negative_prompt: '',
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id })
}
