import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { BlogListClient } from '@/components/blog/BlogListClient'
import { defaultOgImage, siteName } from '@/lib/site'

const description = 'Writing on AI tooling, software engineering, and developer workflows by Aykut Sert.'

export const metadata: Metadata = {
  title: 'Blog',
  description,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    siteName,
    title: `Blog - ${siteName}`,
    description,
    url: '/blog',
    images: [defaultOgImage],
  },
}

export default function BlogIndexPage() {
  const posts = getBlogPosts()
  return <BlogListClient posts={posts} />
}
