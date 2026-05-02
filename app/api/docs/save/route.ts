import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  const { id, payload, conflict } = await req.json()

  const supabase = adminClient()

  if (conflict) {
    const { error: rpcError } = await supabase.rpc('shift_order_index', {
      p_category: payload.category,
      p_from_index: payload.order_index,
    })
    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 })
  }

  if (id) {
    const { data: existing } = await supabase
      .from('docs')
      .select('image_url')
      .eq('id', id)
      .single()

    if (existing?.image_url && existing.image_url !== payload.image_url) {
      const parts = new URL(existing.image_url).pathname.split('/object/public/kernel/')
      if (parts[1]) await supabase.storage.from('kernel').remove([parts[1]])
    }

    const { error } = await supabase
      .from('docs')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await supabase.from('docs').insert(payload)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
