import { ImageIcon } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { CategoryTabs } from '@/components/layout/CategoryTabs'
import { Footer } from '@/components/layout/Footer'
import { ProductTemplateGallery } from '@/components/product-templates/ProductTemplateGallery'
import { getDocs } from '@/lib/docs'
import { getProductTemplates } from '@/lib/product-templates'
import type { ProductTemplate } from '@/types'

const CATEGORY_LABELS: Record<ProductTemplate['category'], string> = {
  home_decor: 'Home & Decor',
  beauty_wellness: 'Beauty & Wellness',
}

export default async function ProductTemplatesPage() {
  const [docs, templates] = await Promise.all([getDocs(), getProductTemplates()])

  const grouped = templates.reduce<Record<string, ProductTemplate[]>>((acc, template) => {
    const label = CATEGORY_LABELS[template.category]
    if (!acc[label]) acc[label] = []
    acc[label].push(template)
    return acc
  }, {})

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <CategoryTabs docs={docs} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-0">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product Templates
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Product Templates</h1>
          </div>
        </div>

        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-24 text-center">
            <ImageIcon className="mb-4 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium">No product templates yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add rows to product_templates after uploading template images.
            </p>
          </div>
        ) : (
          <ProductTemplateGallery grouped={grouped} />
        )}
      </main>
      <Footer />
    </div>
  )
}
