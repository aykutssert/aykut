import type { Metadata } from 'next'
import { getDocs } from '@/lib/docs'
import { DocsPageClient } from '@/components/docs/DocsPageClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Curated, LLM-friendly documentation for AI concepts, agent frameworks, MCP, and more.',
}

export default async function DocsIndexPage() {
  let docs: Awaited<ReturnType<typeof getDocs>> = []
  try {
    docs = await getDocs()
  } catch {}

  return <DocsPageClient docs={docs} />
}
