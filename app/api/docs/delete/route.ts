import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(req: Request) {
  const { id } = await req.json() as { id: string }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: doc } = await supabase
    .from('docs')
    .select('image_url')
    .eq('id', id)
    .single()

  if (doc?.image_url) {
    const url = new URL(doc.image_url)
    const parts = url.pathname.split('/object/public/kernel/')
    if (parts[1]) {
      await supabase.storage.from('kernel').remove([parts[1]])
    }
  }

  await supabase.from('docs').delete().eq('id', id)

  return NextResponse.json({ ok: true })
}
