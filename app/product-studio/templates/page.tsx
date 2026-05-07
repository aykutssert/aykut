import { ImageIcon } from 'lucide-react'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { CategoryTabs } from '@/components/layout/CategoryTabs'
import { Footer } from '@/components/layout/Footer'
import { ProductSubnav } from '@/components/product-templates/ProductSubnav'
import { ProductTemplateGallery } from '@/components/product-templates/ProductTemplateGallery'
import { ProductTemplatesSkeleton } from '@/components/product-templates/ProductTemplatesSkeleton'
import { getDocs } from '@/lib/docs'
import { getProductTemplates } from '@/lib/product-templates'
import { getMyProductProducts } from '@/lib/product-products'

async function ProductTemplatesContent() {
  const [templates, products] = await Promise.all([getProductTemplates(), getMyProductProducts()])
  const hasProducts = products.length > 0

  return (
    <>
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-24 text-center">
          <ImageIcon className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium">No product templates yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add rows to product_templates after uploading template images.
          </p>
        </div>
      ) : (
        <ProductTemplateGallery templates={templates} hasProducts={hasProducts} />
      )}
    </>
  )
}

export default async function ProductTemplatesPage() {
  const docs = await getDocs()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <CategoryTabs docs={docs} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-0">
        <ProductSubnav />
        <Suspense fallback={<ProductTemplatesSkeleton />}>
          <ProductTemplatesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
