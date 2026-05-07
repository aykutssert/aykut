import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { CategoryTabs } from '@/components/layout/CategoryTabs'
import { Footer } from '@/components/layout/Footer'
import { ProductSubnav } from '@/components/product-templates/ProductSubnav'
import { ProductProductsClient } from '@/components/product-templates/ProductProductsClient'
import { ProductProductsSkeleton } from '@/components/product-templates/ProductProductsSkeleton'
import { AddProductButton } from '@/components/product-templates/AddProductButton'
import { getDocs } from '@/lib/docs'
import { getMyProductProducts } from '@/lib/product-products'
import { createClient } from '@/lib/supabase/server'

async function ProductProductsContent() {
  const [products, supabase] = await Promise.all([
    getMyProductProducts(),
    createClient(),
  ])
  const { data: { user } } = await supabase.auth.getUser()

  return <ProductProductsClient products={products} signedIn={Boolean(user)} />
}

export const metadata: Metadata = {
  title: 'My Products',
  description: 'Manage your uploaded products for AI product photography.',
}

export default async function ProductProductsPage() {
  const docs = await getDocs()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <CategoryTabs docs={docs} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-0">
        <ProductSubnav />
        <div className="mb-5 flex justify-end">
          <AddProductButton />
        </div>
        <Suspense fallback={<ProductProductsSkeleton />}>
          <ProductProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
