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

async function hashSecret(secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value
  const secret = process.env.ADMIN_SECRET
  if (!secret || !token) return false
  const expected = await hashSecret(secret)
  return token === expected
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (LOCK_PRODUCTION_SITE && process.env.NODE_ENV === 'production') {
    if (pathname.startsWith('/admin')) {
      return new NextResponse(null, { status: 404 })
    }
  }

  const admin = await isAdmin(request)

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
