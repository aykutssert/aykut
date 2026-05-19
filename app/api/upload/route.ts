import { NextResponse } from 'next/server'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'
import sharp from 'sharp'

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const webp = await sharp(buffer).webp({ quality: 85 }).toBuffer()
  const filename = `${Date.now()}.webp`
  const webpFile = new File([new Uint8Array(webp)], filename, { type: 'image/webp' })

  try {
    const pb = await createAdminPB()
    // Store as a temp doc record to get file URL
    const uploadForm = new FormData()
    uploadForm.append('image', webpFile)
    uploadForm.append('title', filename)
    uploadForm.append('slug', filename)
    uploadForm.append('category', '_uploads')
    uploadForm.append('content', '')
    uploadForm.append('published', 'false')

    const record = await pb.collection('docs').create(uploadForm)
    const url = pb.files.getURL(record, record.image as string)
    return NextResponse.json({ url })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE() {
  // Images are managed by Pocketbase, cleanup handled there
  return NextResponse.json({ ok: true })
}
