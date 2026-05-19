// Deprecated: image uploads are now handled directly in /api/docs/save
// This route is kept to avoid 404s from any cached references
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Use /api/docs/save with FormData instead' }, { status: 410 })
}

export async function DELETE() {
  return NextResponse.json({ ok: true })
}
