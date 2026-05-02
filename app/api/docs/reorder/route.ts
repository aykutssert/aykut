import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const { items } = await req.json() as { items: { id: string; order_index: number }[] }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const updates = items.map(({ id, order_index }) =>
    supabase.from('docs').update({ order_index }).eq('id', id)
  )

  await Promise.all(updates)
  revalidateTag('docs', 'max')
  return NextResponse.json({ ok: true })
}
