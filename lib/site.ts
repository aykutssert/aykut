const DEFAULT_SITE_URL = 'https://aykutsert.com'

function normalizeSiteUrl(value: string | undefined) {
  const raw = (value || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')

  try {
    return new URL(raw).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
export const siteHost = new URL(siteUrl).host

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${normalizedPath}`
}

export const siteName = 'Aykut Sert'
export const siteDescription =
  'Portfolio of Aykut Sert, computer engineer building microservice backends, web apps, iOS apps, and AI integrations with C#, ASP.NET Core, Next.js, and Swift.'
export const defaultOgImage = { url: '/kernel-logo.png', width: 512, height: 512, alt: siteName }
