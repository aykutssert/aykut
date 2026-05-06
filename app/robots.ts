import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/login',
        '/account/',
        '/reset-password',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
