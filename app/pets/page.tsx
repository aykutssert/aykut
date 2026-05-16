import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { DeveloperSubnav } from '@/components/layout/DeveloperSubnav'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { PetsGridSkeleton } from '@/components/pets/PetsGridSkeleton'
import { PetsListClient } from '@/components/pets/PetsListClient'
import { getDocs } from '@/lib/docs'
import { getPets, PER_PAGE } from '@/lib/pets-data'

interface Props {
  searchParams: Promise<{ page?: string; q?: string; sort?: string; nsfw?: string }>
}

async function PetsList({ searchParams }: Props) {
  const { page: pageParam, q = '', sort = 'newest', nsfw } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1') || 1)
  const sortVal = (sort === 'liked' ? 'liked' : sort === 'viewed' ? 'viewed' : 'newest') as 'newest' | 'liked' | 'viewed'
  const showNsfw = nsfw === '1'

  const { pets, total, totalLikes } = await getPets(page, q, sortVal, showNsfw)
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <PetsListClient
      pets={pets}
      total={total}
      totalLikes={totalLikes}
      totalPages={totalPages}
      page={page}
      q={q}
      sortVal={sortVal}
      showNsfw={showNsfw}
    />
  )
}

export const metadata: Metadata = {
  title: 'Codex Pets',
  description: 'Pixel-art companion pets with a REST API. Each sprite is unique per generation.',
}

export default async function PetsPage({ searchParams }: Props) {
  const docs = await getDocs()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar docs={docs} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-0 pt-6 pb-12">
        <DeveloperSubnav />
        <Suspense fallback={<PetsGridSkeleton />}>
          <PetsList searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
