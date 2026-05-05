import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type UpdatePasswordBody = {
  password?: string
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as UpdatePasswordBody | null
  const password = body?.password ?? ''

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
