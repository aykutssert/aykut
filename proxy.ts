import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_API_PREFIXES = [
  '/api/search',
  '/api/auth',
  '/api/docs/like',
  '/api/pets/like',
  '/api/pets/download',
  '/api/pets/view',
]

function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function isAdminEmail(email: string | undefined) {
  const allowed = adminEmails()
  if (allowed.length === 0) return process.env.NODE_ENV !== 'production'
  return Boolean(email && allowed.includes(email.toLowerCase()))
}

export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl
  const isAdmin = isAdminEmail(user?.email)

  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && user && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/prompts'
    return NextResponse.redirect(url)
  }

  if (pathname === '/admin/login' && user && isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  if (pathname === '/admin/login' && user && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/prompts'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/api/')) {
    const isPublic = PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))
    if (!isPublic && (!user || !isAdmin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
