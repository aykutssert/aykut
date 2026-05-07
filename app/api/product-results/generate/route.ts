import { NextResponse } from 'next/server'
import { getProductGenerationUnitCost } from '@/lib/product-usage'
import { assertProductUsageAvailable, ProductUsageLimitError } from '@/lib/product-usage'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isProductImageSize, isProductImageQuality } from '@/lib/product-image-sizes'
import type { ProductImageQuality, ProductImageSize } from '@/lib/product-image-sizes'

type ProductResultForGenerate = {
  id: string
  user_id: string
  image_size: ProductImageSize
  image_quality: ProductImageQuality
  status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed'
}

export async function POST(req: Request) {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const { id, prompt, image_size, image_quality } = await req.json().catch(() => ({})) as { id?: string; prompt?: string; image_size?: string; image_quality?: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const service = createServiceClient()
  const { data: result, error: resultError } = await service
    .from('product_results')
    .select('id, user_id, image_size, image_quality, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (resultError) return NextResponse.json({ error: resultError.message }, { status: 500 })
  if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 })

  const typedResult = result as ProductResultForGenerate

  if (typedResult.status === 'queued' || typedResult.status === 'processing') {
    return NextResponse.json({ ok: true, status: typedResult.status })
  }

  if (typedResult.status === 'completed') {
    return NextResponse.json({ error: 'Result already completed' }, { status: 409 })
  }

  if (typedResult.status !== 'pending' && typedResult.status !== 'failed') {
    return NextResponse.json({ error: 'Result cannot be generated' }, { status: 409 })
  }

  const resolvedSize = (image_size && isProductImageSize(image_size)) ? image_size : typedResult.image_size
  const resolvedQuality = (image_quality && isProductImageQuality(image_quality)) ? image_quality : typedResult.image_quality
  const units = getProductGenerationUnitCost(resolvedSize, resolvedQuality)

  try {
    await assertProductUsageAvailable(user.id, units)
  } catch (error) {
    if (error instanceof ProductUsageLimitError) {
      return NextResponse.json({
        error: 'Monthly usage limit reached',
        requiredUnits: error.requiredUnits,
        usage: error.snapshot,
      }, { status: 402 })
    }

    throw error
  }

  const { data: queued, error: updateError } = await service
    .from('product_results')
    .update({
      status: 'queued',
      error_message: null,
      ...(prompt?.trim() ? { final_prompt: prompt.trim() } : {}),
      image_size: resolvedSize,
      image_quality: resolvedQuality,
      updated_at: new Date().toISOString(),
    })
    .eq('id', typedResult.id)
    .eq('user_id', user.id)
    .in('status', ['pending', 'failed'])
    .select('id')
    .maybeSingle()

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  if (!queued) return NextResponse.json({ error: 'Result is already queued or processing' }, { status: 409 })

  return NextResponse.json({ ok: true, status: 'queued', units })
}
