import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'

export async function POST(req: Request) {
  const formData = await req.formData()

  const id = formData.get('id') as string
  const display_name = formData.get('display_name') as string
  const description = formData.get('description') as string
  const published = formData.get('published') === 'true'
  const is_nsfw = formData.get('is_nsfw') === 'true'
  const webp = formData.get('webp') as File | null

  if (!id || !display_name || !webp) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const pb = await createAdminPB()

  // Check if already exists
  try {
    await pb.collection('pets').getOne(id)
    return NextResponse.json({ ok: true, skipped: true })
  } catch {
    // doesn't exist, continue
  }

  const uploadForm = new FormData()
  uploadForm.append('id', id)
  uploadForm.append('display_name', display_name)
  if (description) uploadForm.append('description', description)
  uploadForm.append('published', String(published))
  uploadForm.append('is_nsfw', String(is_nsfw))
  uploadForm.append('spritesheet', webp, `${id}.webp`)

  // Build spritesheet_url from PB file URL
  const record = await pb.collection('pets').create(uploadForm)
  const spritesheetUrl = pb.files.getURL(record, record.spritesheet)

  await pb.collection('pets').update(record.id, { spritesheet_url: spritesheetUrl })

  revalidateTag('pets', 'max')
  return NextResponse.json({ ok: true, skipped: false })
}
