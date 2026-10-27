import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { LandingClient } from '@/components/landing/LandingClient'
import { defaultOgImage, siteDescription, siteName, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: siteName },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
    url: '/',
    images: [defaultOgImage],
  },
}

export default function LandingPage() {
  const recentBlogPosts = getBlogPosts().slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    image: `${siteUrl}/my-face.webp`,
    name: 'Aykut Sert',
    url: siteUrl,
    email: 'aykutssert@gmail.com',
    sameAs: [
      'https://github.com/aykutssert',
      'https://linkedin.com/in/aykut-sert-9139211b9',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Gebze Technical University',
    },
    knowsAbout: [
      'C#', 'Python', 'C++', 'ASP.NET Core', 'EF Core', 'Dapper',
      'Microservices', 'Distributed Systems', 'REST', 'WebSocket', 'Caching', 'Rate limiting',
      'MSSQL', 'PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'Docker', 'CI/CD',
      'Swift', 'SwiftUI', 'Next.js', 'LLM',
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    author: { '@id': `${siteUrl}/#person` },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <LandingClient recentBlogPosts={recentBlogPosts} />
    </>
  )
}
