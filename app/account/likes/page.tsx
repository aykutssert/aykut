import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getDocs } from '@/lib/docs'
import { LikesLoader } from '@/components/account/LikesLoader'
export const metadata: Metadata = {
  title: 'Library',
}

function LikesLoaderFallback() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-xl border border-border bg-muted/50" />
      ))}
    </div>
  )
}

export default async function AccountLikesPage() {
  const docs = await getDocs()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-12 pt-6 md:px-0">
        <Suspense fallback={<LikesLoaderFallback />}>
          <LikesLoader />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
