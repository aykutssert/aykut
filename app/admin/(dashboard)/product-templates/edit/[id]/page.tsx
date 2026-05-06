import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ProductTemplateForm } from '@/components/admin/ProductTemplateForm'
import type { ProductTemplate } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

async function EditProductTemplateContent({ params }: Props) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: template } = await supabase
    .from('product_templates')
    .select('id, category, name, image_url, sort_order, is_active, created_at')
    .eq('id', id)
    .single() as { data: ProductTemplate | null }

  if (!template) notFound()

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Edit product template</h1>
      <ProductTemplateForm template={template} />
    </div>
  )
}

export default function EditProductTemplatePage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />}>
      <EditProductTemplateContent params={params} />
    </Suspense>
  )
}
