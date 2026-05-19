import { NextResponse } from 'next/server'
import { createPB } from '@/lib/pocketbase'

function snippet(content: string, query: string, len = 140): string {
  const lower = content.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return content.slice(0, len) + (content.length > len ? '…' : '')
  const start = Math.max(0, idx - 50)
  const end = Math.min(content.length, idx + 90)
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() ?? ''
  const tag = searchParams.get('tag')?.trim() ?? ''

  try {
    const pb = createPB()
    const filters: string[] = ['published = true']
    if (tag) filters.push(`tags ~ '"${tag}"'`)
    if (q) {
      const safe = q.replace(/"/g, '')
      filters.push(`(title ~ "${safe}" || content ~ "${safe}")`)
    }

    const records = await pb.collection('docs').getList(1, 8, {
      filter: filters.join(' && '),
      sort: q ? '' : '+order_index',
    })

    return NextResponse.json(
      records.items.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        slug: doc.slug,
        tags: Array.isArray(doc.tags) ? doc.tags : [],
        snippet: q ? snippet((doc.content as string) ?? '', q) : null,
      })),
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    )
  } catch {
    return NextResponse.json([])
  }
}
