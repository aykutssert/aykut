import { NextResponse } from 'next/server'
import { renderContent } from '@/lib/render'

export async function POST(req: Request) {
  const { content } = await req.json()
  const result = await renderContent(content ?? '')
  return NextResponse.json({ html: result.html, mode: result.mode })
}
