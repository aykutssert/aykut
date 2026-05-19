import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('docs')
    .select('id, title, slug, category, order_index, published')
    .eq('published', true)
    .order('category')
    .order('order_index')

  return NextResponse.json(data ?? [], {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
