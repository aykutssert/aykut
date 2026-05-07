import { createClient } from '@/lib/supabase/server'
import type { ProductResult } from '@/types'

type ProductResultRow = Omit<ProductResult, 'product' | 'template'> & {
  product: ProductResult['product'] | ProductResult['product'][] | null
  template: ProductResult['template'] | ProductResult['template'][] | null
}

function firstRelation<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

export async function getMyProductResults(): Promise<ProductResult[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('product_results')
    .select(`
      id,
      user_id,
      product_id,
      template_id,
      image_size,
      final_prompt,
      negative_prompt,
      image_url,
      status,
      created_at,
      product:products(id, name, image_url),
      template:product_templates(id, name, category, image_url)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return ((data ?? []) as ProductResultRow[]).map((result) => ({
    ...result,
    product: firstRelation(result.product),
    template: firstRelation(result.template),
  }))
}
