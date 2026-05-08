import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { CategoryTabs } from '@/components/layout/CategoryTabs'
import { Footer } from '@/components/layout/Footer'
import { ProductResultsList } from '@/components/product-templates/ProductResultsList'
import { ProductResultsSkeleton } from '@/components/product-templates/ProductResultsSkeleton'
import { ProductSubnav } from '@/components/product-templates/ProductSubnav'
import { getDocs } from '@/lib/docs'
import { getMyProductResults } from '@/lib/product-results'
import { getProductUsageSnapshot } from '@/lib/product-usage'
import { createClient } from '@/lib/supabase/server'

async function ProductResultsContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [results, usage] = await Promise.all([
    getMyProductResults(),
    user ? getProductUsageSnapshot(user.id) : Promise.resolve(null),
  ])

  return <ProductResultsList results={results} signedIn={Boolean(user)} usage={usage} />
}

export const metadata: Metadata = {
  title: 'Results',
  description: 'Your AI-generated product photos.',
}

export default async function ProductResultsPage() {
  const docs = await getDocs()
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <CategoryTabs docs={docs} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-0">
        <ProductSubnav />
        <Suspense fallback={<ProductResultsSkeleton />}>
          <ProductResultsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
