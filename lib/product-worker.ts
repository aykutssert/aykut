import { generateProductImage } from '@/lib/openai/product-image-generation'
import { PRODUCT_IMAGE_SIZE_MAP, type ProductImageQuality, type ProductImageSize } from '@/lib/product-image-sizes'
import { getProductGenerationUnitCost, recordProductUsageEvent } from '@/lib/product-usage'
import { createServiceClient } from '@/lib/supabase/server'

type ProductWorkerJob = {
  id: string
  user_id: string
  product_id: string
  template_id: string
  image_size: ProductImageSize
  image_quality: ProductImageQuality
  final_prompt: string
  product: { image_url: string } | { image_url: string }[] | null
  template: { image_url: string } | { image_url: string }[] | null
}

type ProductWorkerResult =
  | { ok: true; job: null }
  | { ok: true; jobId: string; status: 'completed'; imageUrl: string }
  | { ok: false; jobId: string; status: 'failed'; error: string }

export async function runNextProductGenerationJob(): Promise<ProductWorkerResult> {
  const job = await claimNextProductGenerationJob()
  if (!job) return { ok: true, job: null }

  try {
    const productImageUrl = firstRelation(job.product)?.image_url
    const templateImageUrl = firstRelation(job.template)?.image_url

    if (!productImageUrl || !templateImageUrl) {
      throw new Error('Product or template image is missing')
    }

    const [productImage, templateImage] = await Promise.all([
      fetchImageBlob(productImageUrl),
      fetchImageBlob(templateImageUrl),
    ])

    const imageBuffer = await generateProductImage({
      productImage,
      templateImage,
      prompt: job.final_prompt,
      imageSize: job.image_size,
      imageQuality: job.image_quality,
    })

    const imageUrl = await uploadGeneratedImage(job, imageBuffer)
    await completeJob(job, imageUrl)

    return { ok: true, jobId: job.id, status: 'completed', imageUrl }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Product generation failed'
    await failJob(job.id, message)
    return { ok: false, jobId: job.id, status: 'failed', error: message }
  }
}

async function claimNextProductGenerationJob(): Promise<ProductWorkerJob | null> {
  const service = createServiceClient()
  const { data: queued, error: selectError } = await service
    .from('product_results')
    .select(`
      id,
      user_id,
      product_id,
      template_id,
      image_size,
      image_quality,
      final_prompt,
      product:products(image_url),
      template:product_templates(image_url)
    `)
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (selectError) throw new Error(selectError.message)
  if (!queued) return null

  const job = queued as ProductWorkerJob
  const { data: claimed, error: updateError } = await service
    .from('product_results')
    .update({
      status: 'processing',
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', job.id)
    .eq('status', 'queued')
    .select('id')
    .maybeSingle()

  if (updateError) throw new Error(updateError.message)
  if (!claimed) return null

  return job
}

async function fetchImageBlob(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`)
  }
  return response.blob()
}

async function uploadGeneratedImage(job: ProductWorkerJob, imageBuffer: Buffer) {
  const service = createServiceClient()
  const path = `${job.user_id}/${job.id}.webp`
  const { error: uploadError } = await service.storage
    .from('product-results')
    .upload(path, imageBuffer, { contentType: 'image/webp', upsert: true })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = service.storage.from('product-results').getPublicUrl(path)
  return data.publicUrl
}

async function completeJob(job: ProductWorkerJob, imageUrl: string) {
  const service = createServiceClient()
  const { error } = await service
    .from('product_results')
    .update({
      status: 'completed',
      image_url: imageUrl,
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', job.id)
    .eq('status', 'processing')

  if (error) throw new Error(error.message)

  const units = getProductGenerationUnitCost(job.image_size, job.image_quality)
  await recordProductUsageEvent({
    userId: job.user_id,
    resultId: job.id,
    action: 'image_generation',
    units,
    metadata: {
      image_size: job.image_size,
      output_size: PRODUCT_IMAGE_SIZE_MAP[job.image_size],
      image_quality: job.image_quality,
    },
  })
}

async function failJob(jobId: string, message: string) {
  const service = createServiceClient()
  await service
    .from('product_results')
    .update({
      status: 'failed',
      error_message: message.slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
}

function firstRelation<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}
