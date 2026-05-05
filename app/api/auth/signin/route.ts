import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type SigninBody = {
  email?: string
  password?: string
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as SigninBody | null
  const email = (body?.email ?? '').trim().toLowerCase()
  const password = body?.password ?? ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.json({
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email,
        }
      : null,
  })
}
