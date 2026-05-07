import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isProductImageSize, isProductImageQuality } from '@/lib/product-image-sizes'

export async function POST(req: Request) {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const { id, prompt, image_size, image_quality } = await req.json().catch(() => ({})) as { id?: string; prompt?: string; image_size?: string; image_quality?: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const service = createServiceClient()
  const { data: source, error: sourceError } = await service
    .from('product_results')
    .select('product_id, template_id, image_size, image_quality, final_prompt')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (sourceError) return NextResponse.json({ error: sourceError.message }, { status: 500 })
  if (!source) return NextResponse.json({ error: 'Result not found' }, { status: 404 })

  const { data, error } = await service
    .from('product_results')
    .insert({
      user_id: user.id,
      product_id: source.product_id,
      template_id: source.template_id,
      image_size: (image_size && isProductImageSize(image_size)) ? image_size : source.image_size,
      image_quality: (image_quality && isProductImageQuality(image_quality)) ? image_quality : source.image_quality,
      final_prompt: prompt?.trim() || source.final_prompt,
      negative_prompt: '',
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, id: data.id })
}
