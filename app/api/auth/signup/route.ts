import { NextResponse, type NextRequest } from 'next/server'
import { normalizeUsername, validateUsername } from '@/lib/auth/username'
import { absoluteUrl } from '@/lib/site'
import { createPublicClient, createServiceClient } from '@/lib/supabase/server'

type SignupBody = {
  username?: string
  email?: string
  password?: string
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as SignupBody | null
  const username = normalizeUsername(body?.username ?? '')
  const email = (body?.email ?? '').trim().toLowerCase()
  const password = body?.password ?? ''

  const usernameError = validateUsername(username)
  if (usernameError) {
    return NextResponse.json({ error: usernameError }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const admin = createServiceClient()
  const { data: existingProfile, error: profileError } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (profileError) {
    return NextResponse.json({ error: 'Could not check username availability.' }, { status: 500 })
  }

  if (existingProfile) {
    return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 })
  }

  const supabase = createPublicClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: absoluteUrl('/auth/callback?next=/prompts'),
    },
  })

  if (error) {
    const message = error.message.toLowerCase()
    if (message.includes('profiles_username') || message.includes('duplicate key')) {
      return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 })
    }

    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    userId: data.user?.id ?? null,
    needsEmailConfirmation: !data.session,
  })
}
