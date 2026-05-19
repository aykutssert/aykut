import { NextResponse } from 'next/server'
import { createPB } from '@/lib/pocketbase'

export async function GET() {
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      filter: 'published = true',
      sort: '+category,+order_index',
      fields: 'id,title,slug,category,order_index,published',
    })
    return NextResponse.json(records, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  }
}
