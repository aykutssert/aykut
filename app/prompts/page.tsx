import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'

import { DeveloperSubnav } from '@/components/layout/DeveloperSubnav'
import { Footer } from '@/components/layout/Footer'
import { TagPageClient } from '@/components/tags/TagPageClient'
import { PromptsGridSkeleton } from '@/components/prompts/PromptsGridSkeleton'
import { getAllTags, getDocs, getPromptDocsWithPreviews } from '@/lib/docs'

interface Props {
  searchParams: Promise<{ q?: string; tag?: string | string[]; sort?: string; auth?: string }>
}

export const metadata: Metadata = {
  title: 'Prompts',
  description: 'Browse and filter Kernel prompts.',
}

async function PromptsContent({ searchParams }: Props) {
  const params = await searchParams
  const tags = Array.isArray(params.tag)
    ? params.tag
    : params.tag
      ? [params.tag]
      : []
  const sort = params.sort === 'alpha' || params.sort === 'newest' || params.sort === 'oldest'
    ? params.sort
    : 'default'

  const promptQuery = params.q?.trim() ?? ''
  const [docs, allTags] = await Promise.all([
    getPromptDocsWithPreviews({ q: promptQuery, tags, sort }),
    getAllTags(),
  ])

  return (
    <TagPageClient
      docs={docs}
      allTags={allTags}
      tags={tags}
      initialQuery={promptQuery}
      initialSort={sort}
      authStatus={params.auth}
    />
  )
}

export default async function PromptsPage({ searchParams }: Props) {
  const docs = await getDocs()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-0">
        <DeveloperSubnav />
        <Suspense fallback={<PromptsGridSkeleton />}>
          <PromptsContent searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
