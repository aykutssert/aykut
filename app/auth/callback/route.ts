import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { absoluteUrl } from '@/lib/site'

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/prompts'
  return value
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = safeNextPath(requestUrl.searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const redirectUrl = new URL(absoluteUrl(next))
      if (redirectUrl.pathname === '/prompts' && !redirectUrl.searchParams.has('auth')) {
        redirectUrl.searchParams.set('auth', 'confirmed')
      }
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(absoluteUrl('/prompts?auth=callback-error'))
}
