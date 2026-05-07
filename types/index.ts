import type { ProductTemplateCategory } from '@/lib/product-template-categories'
import type { ProductImageQuality, ProductImageSize } from '@/lib/product-image-sizes'

export interface Doc {
  id: string
  title: string
  slug: string
  category: string
  description: string | null
  content: string
  source_url: string | null
  image_url: string | null
  required_images: number | null
  variables: { name: string; default?: string }[]
  tags: string[]
  order_index: number
  published: boolean
  likes_count?: number | null
  created_at: string
  updated_at: string
  liked_by_me?: boolean
}

export interface DocMeta {
  id: string
  title: string
  slug: string
  category: string
  order_index: number
  published: boolean
  tags: string[]
  description: string | null
  image_url: string | null
  likes_count?: number | null
}

export type TaggedDoc = Pick<
  Doc,
  | 'id'
  | 'title'
  | 'slug'
  | 'category'
  | 'description'
  | 'content'
  | 'image_url'
  | 'order_index'
  | 'published'
  | 'tags'
  | 'created_at'
  | 'likes_count'
>

export interface DocVersion {
  id: string
  doc_id: string
  version_number: number
  content: string
  change_summary: string | null
  author_handle: string | null
  created_at: string
}

export interface ProductTemplate {
  id: string
  category: ProductTemplateCategory
  name: string
  image_url: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface ProductProduct {
  id: string
  user_id: string
  category: string
  name: string
  image_url: string
  product_note: string | null
  created_at: string
}

export interface ProductResult {
  id: string
  user_id: string
  product_id: string
  template_id: string | null
  image_size: ProductImageSize
  image_quality: ProductImageQuality
  final_prompt: string
  negative_prompt: string
  image_url: string | null
  status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  created_at: string
  updated_at: string
  product: Pick<ProductProduct, 'id' | 'name' | 'image_url'> | null
  template: Pick<ProductTemplate, 'id' | 'name' | 'category' | 'image_url'> | null
}
