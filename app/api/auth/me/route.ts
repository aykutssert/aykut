import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ user: null })
  }

  const admin = createServiceClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle()

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: profile?.username ?? null,
    },
  })
}
