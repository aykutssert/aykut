import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  try {
    const pb = await createAdminPB()
    const original = await pb.collection('pets').getOne(id)
    await pb.collection('pets').create({
      display_name: `Copy of ${original.display_name}`,
      description: original.description,
      spritesheet_url: original.spritesheet_url,
      source_url: original.source_url,
      published: false,
      is_nsfw: original.is_nsfw,
    })
    revalidateTag('pets', 'max')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 404 })
  }
}
