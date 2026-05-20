import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'

export async function POST() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true })
}
