import { NextResponse, type NextRequest } from 'next/server'
import { absoluteUrl } from '@/lib/site'
import { createPublicClient } from '@/lib/supabase/server'

type ResetPasswordBody = {
  email?: string
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as ResetPasswordBody | null
  const email = (body?.email ?? '').trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const supabase = createPublicClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: absoluteUrl('/auth/callback?next=/reset-password'),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
