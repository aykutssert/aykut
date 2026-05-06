import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/auth/admin'

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const buffer = Buffer.from(await file.arrayBuffer())
  const webp = await sharp(buffer).webp({ quality: 88 }).toBuffer()
  const filename = `templates/${Date.now()}.webp`

  const { error } = await supabase.storage
    .from('product-template-images')
    .upload(filename, webp, { contentType: 'image/webp', upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('product-template-images').getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}
