import { NextResponse } from 'next/server'
import { createPB } from '@/lib/pocketbase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? []
  if (!ids.length) return NextResponse.json([])

  try {
    const pb = createPB()
    const filter = ids.map((id) => `id = "${id}"`).join(' || ')
    const records = await pb.collection('pets').getFullList({ filter })
    const pets = records.map((r) => ({
      id: r.id,
      display_name: r.display_name,
      description: r.description ?? null,
      spritesheet_url: r.spritesheet_url ?? '',
      source_url: r.source_url ?? null,
      published: r.published ?? false,
      is_nsfw: r.is_nsfw ?? false,
      created_at: r.created,
    }))
    return NextResponse.json(pets)
  } catch {
    return NextResponse.json([])
  }
}
