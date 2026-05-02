import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(req: Request) {
  const { id, published } = await req.json()
  if (!id || typeof published !== 'boolean') {
    return NextResponse.json({ error: 'Missing id or published' }, { status: 400 })
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await supabase.from('docs').update({ published }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag('docs', 'max')
  return NextResponse.json({ ok: true })
}
