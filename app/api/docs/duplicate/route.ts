import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'

export async function POST(req: Request) {
  const { id } = await req.json()
  try {
    const pb = await createAdminPB()
    const original = await pb.collection('docs').getOne(id)
    const maxRecords = await pb.collection('docs').getList(1, 1, {
      filter: `category = "${original.category}"`,
      sort: '-order_index',
    })
    const maxIndex = (maxRecords.items[0]?.order_index as number ?? 0) + 1

    const newDoc = await pb.collection('docs').create({
      title: `Copy of ${original.title}`,
      slug: `${original.slug}-copy`,
      category: original.category,
      content: original.content,
      source_url: original.source_url,
      image_url: null,
      tags: original.tags,
      order_index: maxIndex,
      published: false,
    })

    revalidateTag('docs', 'max')
    return NextResponse.json({ id: newDoc.id })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 404 })
  }
}
