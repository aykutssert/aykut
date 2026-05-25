import type { Metadata } from 'next'
import { getDocs, getRecentBlogPosts, getRecentPrompts } from '@/lib/docs'
import { LandingClient } from '@/components/landing/LandingClient'
import { DiscoverWidget } from '@/components/layout/DiscoverWidget'

export const metadata: Metadata = {
  title: 'Aykut Sert',
  description: 'Full-stack developer building web apps, mobile apps, and developer tools. Next.js, Go, C#, React Native, Swift.',
}

export default async function LandingPage() {
  const [docs, recentBlogPosts, recentPrompts] = await Promise.all([
    getDocs().catch(() => []),
    getRecentBlogPosts(3).catch(() => []),
    getRecentPrompts(3).catch(() => []),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Aykut Sert',
    jobTitle: 'Full-Stack Developer',
    url: 'https://kernelgallery.com',
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
      'C#', 'Go', 'TypeScript', 'Swift', 'Python',
      'ASP.NET Core', 'Next.js', 'SwiftUI',
      'MongoDB', 'PostgreSQL', 'Redis', 'RabbitMQ',
      'Docker', 'Microservices', 'RAG', 'LLM',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingClient docs={docs} recentBlogPosts={recentBlogPosts} recentPrompts={recentPrompts} />
      <DiscoverWidget />
    </>
  )
}
