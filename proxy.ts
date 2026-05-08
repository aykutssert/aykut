import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const LOCK_PRODUCTION_SITE = true

const PUBLIC_API_PREFIXES = [
  '/api/search',
  '/api/auth',
  '/api/docs/like',
  '/api/feedback',
  '/api/pets/like',
  '/api/pets/likes',
  '/api/pets/download',
  '/api/pets/view',
  '/api/product-products',
  '/api/product-results',
]

// Locale detection from URL prefix
function getLocaleFromPath(pathname: string): 'tr' | 'en' {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  return 'tr'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Root redirect → /tr/
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/tr'
    return NextResponse.redirect(url, 308)
  }

  if (LOCK_PRODUCTION_SITE && process.env.VERCEL_ENV === 'production') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Site temporarily locked' }, { status: 503 })
    }

    const lockedPath = pathname === '/tr/locked' || pathname === '/en/locked' || pathname === '/locked'
    if (!lockedPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/tr/locked'
      return NextResponse.rewrite(url)
    }
  }

  const isPublicApi = pathname.startsWith('/api/')
    && PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))

  if (isPublicApi) {
    return NextResponse.next({ request })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const res = NextResponse.next({ request })
    res.headers.set('x-next-intl-locale', getLocaleFromPath(pathname))
    return res
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
  let isAdmin = false

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()
    isAdmin = Boolean(profile?.is_admin)
  }

  // Strip locale prefix for admin path checks
  const barePath = pathname.replace(/^\/(tr|en)/, '') || '/'

  if (barePath.startsWith('/admin') && barePath !== '/admin/login' && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (barePath.startsWith('/admin') && barePath !== '/admin/login' && user && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/tr/prompts'
    return NextResponse.redirect(url)
  }

  if (barePath === '/admin/login' && user && isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  if (barePath === '/admin/login' && user && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/tr/prompts'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/api/')) {
    if (!user || !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Set locale header for next-intl
  supabaseResponse.headers.set('x-next-intl-locale', getLocaleFromPath(pathname))

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|xml)$).*)',
  ],
}
