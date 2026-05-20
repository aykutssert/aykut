import { NextResponse } from 'next/server'
import { cacheTag, cacheLife } from 'next/cache'
import { createPB } from '@/lib/pocketbase'
import { renderPromptPreview } from '@/lib/prompt-preview'
import { resolveDocImageUrl } from '@/lib/docs'
import type { TaggedDoc } from '@/types'
import type { TaggedDocWithPreview } from '@/lib/prompt-preview'

const VALID_ID = /^[a-z0-9]{15}$/i

// Cache Shiki rendering per doc so repeated loads (e.g. navigating to Likes
// tab repeatedly) don't re-run the syntax highlighter each time.
async function renderDocPreview(doc: TaggedDoc, maxLines: number): Promise<TaggedDocWithPreview> {
  'use cache'
  cacheTag('docs', `doc-${doc.id}`)
  cacheLife('max')
  const preview = await renderPromptPreview(doc.content, maxLines)
  return { ...doc, ...preview }
}

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
      image_url: resolveDocImageUrl(r),
      order_index: r.order_index ?? 0,
      published: r.published ?? false,
      tags: Array.isArray(r.tags) ? r.tags : [],
      created_at: r.created,
      liked_by_me: true,
    }))

    const withPreviews = await Promise.all(
      docs.map((doc) => renderDocPreview(doc, doc.image_url ? 4 : 5))
    )

    return NextResponse.json(withPreviews.map((doc) => ({
      ...doc,
      liked_by_me: true,
      liked_at: new Date().toISOString(),
    })))
  } catch {
    return NextResponse.json([])
  }
}
