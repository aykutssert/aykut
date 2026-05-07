import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { CategoryTabs } from '@/components/layout/CategoryTabs'
import { Footer } from '@/components/layout/Footer'
import { ProductResultsList } from '@/components/product-templates/ProductResultsList'
import { ProductSubnav } from '@/components/product-templates/ProductSubnav'
import { getDocs } from '@/lib/docs'
import { getMyProductResults } from '@/lib/product-results'
import { createClient } from '@/lib/supabase/server'

async function ProductResultsContent() {
  const [results, supabase] = await Promise.all([
    getMyProductResults(),
    createClient(),
  ])
  const { data: { user } } = await supabase.auth.getUser()

  return <ProductResultsList results={results} signedIn={Boolean(user)} />
}

function ProductResultsSkeleton() {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-md border border-dashed border-border">
      <p className="text-sm text-muted-foreground">Loading results...</p>
    </div>
  )
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
