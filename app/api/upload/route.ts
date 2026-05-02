import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const webp = await sharp(buffer).webp({ quality: 85 }).toBuffer()

  const filename = `${Date.now()}.webp`
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.storage
    .from('kernel')
    .upload(filename, webp, { contentType: 'image/webp', upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('kernel').getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}

export async function DELETE(req: Request) {
  const { url } = await req.json() as { url: string }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const parts = new URL(url).pathname.split('/object/public/kernel/')
  if (parts[1]) await supabase.storage.from('kernel').remove([parts[1]])
  return NextResponse.json({ ok: true })
}
