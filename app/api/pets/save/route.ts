import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json() as {
    id?: string
    display_name: string
    description: string
    spritesheet_url: string
    source_url?: string
    published: boolean
    is_nsfw: boolean
  }

  try {
    const pb = await createAdminPB()
    if (body.id) {
      await pb.collection('pets').update(body.id, {
        display_name: body.display_name,
        description: body.description,
        spritesheet_url: body.spritesheet_url,
        source_url: body.source_url || null,
        published: body.published,
        is_nsfw: body.is_nsfw,
      })
    } else {
      await pb.collection('pets').create({
        display_name: body.display_name,
        description: body.description,
        spritesheet_url: body.spritesheet_url,
        source_url: body.source_url || null,
        published: body.published,
        is_nsfw: body.is_nsfw,
      })
    }
    revalidateTag('pets', 'max')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
