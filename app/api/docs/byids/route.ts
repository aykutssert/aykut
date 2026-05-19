import { NextResponse } from 'next/server'
import { createPB } from '@/lib/pocketbase'
import { withPromptPreviews } from '@/lib/prompt-preview'
import type { TaggedDoc } from '@/types'

const PB_URL = process.env.POCKETBASE_URL ?? 'https://db.kernelgallery.com'

function resolveImageUrl(r: { id: string; image?: string; image_url?: string }): string | null {
  if (r.image && r.image.trim() !== '') {
    return `${PB_URL}/api/files/docs/${r.id}/${r.image}`
  }
  return r.image_url ?? null
}

const VALID_ID = /^[a-z0-9]{15}$/i

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = (searchParams.get('ids')?.split(',') ?? []).filter((id) => VALID_ID.test(id))
  if (!ids.length) return NextResponse.json([])

  try {
    const pb = createPB()
    const filter = `published = true && (${ids.map((id) => `id = "${id}"`).join(' || ')})`
    const records = await pb.collection('docs').getFullList({ filter })

    const docs: TaggedDoc[] = records.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      category: r.category,
      description: r.description ?? null,
      content: r.content ?? '',
      image_url: resolveImageUrl(r),
      order_index: r.order_index ?? 0,
      published: r.published ?? false,
      tags: Array.isArray(r.tags) ? r.tags : [],
      created_at: r.created,
      liked_by_me: true,
    }))

    const withPreviews = await withPromptPreviews(docs, (doc) => doc.image_url ? 4 : 5)

    const result = withPreviews.map((doc) => ({
      ...doc,
      liked_by_me: true,
      liked_at: new Date().toISOString(),
    }))

    return NextResponse.json(result)
  } catch {
    return NextResponse.json([])
  }
}
