import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ProductTemplateTable } from '@/components/admin/ProductTemplateTable'
import type { ProductTemplate } from '@/types'

async function getAllProductTemplates(): Promise<ProductTemplate[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('product_templates')
    .select('id, category, name, image_url, sort_order, is_active, created_at')
    .order('category')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return data ?? []
}

async function ProductTemplateList() {
  const templates = await getAllProductTemplates()

  if (templates.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        No product templates yet.{' '}
        <Link href="/admin/product-templates/new" className="underline underline-offset-4 hover:text-foreground">
          Add the first one.
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Product Templates</h1>
      <ProductTemplateTable templates={templates} />
    </div>
  )
}

export default function AdminProductTemplatesPage() {
  return (
    <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />}>
      <ProductTemplateList />
    </Suspense>
  )
}
