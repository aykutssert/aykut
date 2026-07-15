import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { BlogListClient } from '@/components/blog/BlogListClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on AI tooling, software engineering, and developer workflows by Aykut Sert.',
}

export default function BlogIndexPage() {
  const posts = getBlogPosts()
  return <BlogListClient posts={posts} />
}
