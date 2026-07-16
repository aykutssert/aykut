const DEFAULT_SITE_URL = 'https://kernelgallery.com'

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
