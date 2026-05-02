import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const petId = formData.get('petId') as string | null
  if (!file || !petId) return NextResponse.json({ error: 'Missing file or petId' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const path = `pets/${petId}/spritesheet.webp`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from('kernel')
    .upload(path, buffer, { contentType: 'image/webp', upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('kernel').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
