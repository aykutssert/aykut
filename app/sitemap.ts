import type { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { getProjects } from '@/lib/projects'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const postUrls: MetadataRoute.Sitemap = getBlogPosts().map(({ slug }) => ({
    url: `${siteUrl}/blog/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const projectUrls: MetadataRoute.Sitemap = getProjects().map(({ slug }) => ({
    url: `${siteUrl}/projects/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/scout`, changeFrequency: 'monthly', priority: 0.6 },
    ...projectUrls,
    ...postUrls,
  ]
}
