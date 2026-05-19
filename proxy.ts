import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

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

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  const secret = process.env.ADMIN_SECRET
  return Boolean(secret && token === secret)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (LOCK_PRODUCTION_SITE && process.env.NODE_ENV === 'production') {
    if (pathname.startsWith('/admin')) {
      return new NextResponse(null, { status: 404 })
    }
  }

  const admin = isAdmin(request)

  // Public API routes pass through
  const isPublicApi = pathname.startsWith('/api/')
    && PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))

  if (isPublicApi) {
    return NextResponse.next({ request })
  }

  // Admin route protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/admin/login' && admin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|xml)$).*)',
  ],
}
