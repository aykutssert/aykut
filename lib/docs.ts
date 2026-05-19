import { cacheTag, cacheLife } from 'next/cache'
import { createPB } from '@/lib/pocketbase'
import type { Doc, DocMeta, TaggedDoc, DocVersion } from '@/types'

const PB_URL = process.env.POCKETBASE_URL ?? 'https://db.kernelgallery.com'

function resolveImageUrl(r: Record<string, unknown>): string | null {
  if (r.image && typeof r.image === 'string' && r.image.trim() !== '') {
    return `${PB_URL}/api/files/docs/${r.id}/${r.image}`
  }
  return (r.image_url as string) || null
}

type PromptSort = 'default' | 'alpha' | 'newest' | 'oldest'

function parseTags(val: unknown): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val as string[]
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return [] }
  }
  return []
}

function mapDoc(r: Record<string, unknown>): Doc {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    category: r.category as string,
    description: (r.description as string) || null,
    content: r.content as string,
    source_url: (r.source_url as string) || null,
    image_url: resolveImageUrl(r),
    required_images: (r.required_images as number) || null,
    variables: (r.variables as { name: string; default?: string }[]) || [],
    tags: parseTags(r.tags),
    order_index: (r.order_index as number) || 0,
    published: r.published as boolean,
    likes_count: 0,
    created_at: r.created as string,
    updated_at: r.updated as string,
  }
}

function mapDocMeta(r: Record<string, unknown>): DocMeta {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    category: r.category as string,
    order_index: (r.order_index as number) || 0,
    published: r.published as boolean,
    tags: parseTags(r.tags),
    description: (r.description as string) || null,
    image_url: resolveImageUrl(r),
  }
}

function mapTaggedDoc(r: Record<string, unknown>): TaggedDoc {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    category: r.category as string,
    description: (r.description as string) || null,
    content: r.content as string,
    image_url: resolveImageUrl(r),
    order_index: (r.order_index as number) || 0,
    published: r.published as boolean,
    tags: parseTags(r.tags),
    created_at: r.created as string,
    likes_count: 0,
  }
}

export async function getDocVersions(docId: string): Promise<DocVersion[]> {
  'use cache'
  cacheTag('docs', `versions-${docId}`)
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('doc_versions').getFullList({
      filter: `doc_id = "${docId}"`,
      sort: '-version_number',
    })
    return records.map((r) => ({
      id: r.id,
      doc_id: r.doc_id as string,
      version_number: r.version_number as number,
      content: r.content as string,
      change_summary: (r.change_summary as string) || null,
      author_handle: (r.author_handle as string) || null,
      created_at: r.created,
    }))
  } catch {
    return []
  }
}

export async function getDocs(): Promise<DocMeta[]> {
  'use cache'
  cacheTag('docs')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      filter: 'published = true',
      sort: '+category,+order_index',
    })
    return records.map((r) => mapDocMeta(r as unknown as Record<string, unknown>))
  } catch {
    return []
  }
}

export async function getDoc(category: string, slug: string): Promise<Doc | null> {
  'use cache'
  cacheTag('docs', `doc-${category}-${slug}`)
  cacheLife('max')
  try {
    const pb = createPB()
    const record = await pb.collection('docs').getFirstListItem(
      `category = "${category}" && slug = "${slug}" && published = true`
    )
    return mapDoc(record as unknown as Record<string, unknown>)
  } catch {
    return null
  }
}

export async function getCategories(): Promise<string[]> {
  'use cache'
  cacheTag('docs')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      filter: 'published = true',
      sort: '+category',
      fields: 'category',
    })
    return [...new Set(records.map((r) => r.category as string))]
  } catch {
    return []
  }
}

export async function getAllCategories(): Promise<string[]> {
  'use cache'
  cacheTag('docs')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      sort: '+category',
      fields: 'category',
    })
    return [...new Set(records.map((r) => r.category as string))]
  } catch {
    return []
  }
}

export async function getAllDocsMeta(): Promise<Pick<Doc, 'id' | 'title' | 'slug' | 'category' | 'order_index'>[]> {
  'use cache'
  cacheTag('docs')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      sort: '+category,+order_index',
      fields: 'id,title,slug,category,order_index',
    })
    return records.map((r) => ({
      id: r.id,
      title: r.title as string,
      slug: r.slug as string,
      category: r.category as string,
      order_index: (r.order_index as number) || 0,
    }))
  } catch {
    return []
  }
}

export async function getDocsByTag(tag: string): Promise<TaggedDoc[]> {
  'use cache'
  cacheTag('docs', `tag-${tag}`)
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      filter: `published = true && tags ~ '"${tag}"'`,
      sort: '+category,+order_index',
    })
    return records.map((r) => mapTaggedDoc(r as unknown as Record<string, unknown>))
  } catch {
    return []
  }
}

export async function getPromptDocs(): Promise<TaggedDoc[]> {
  'use cache'
  cacheTag('docs', 'prompts')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      filter: 'published = true && category = "prompts"',
      sort: '+order_index',
    })
    return records.map((r) => mapTaggedDoc(r as unknown as Record<string, unknown>))
  } catch {
    return []
  }
}

export async function getPromptDocsFiltered({
  q = '',
  tags = [],
  sort = 'default',
}: {
  q?: string
  tags?: string[]
  sort?: PromptSort
}): Promise<TaggedDoc[]> {
  'use cache'
  cacheTag('docs', 'prompts')
  cacheLife('max')

  try {
    const pb = createPB()
    const filters: string[] = ['published = true', 'category = "prompts"']

    for (const tag of tags.filter(Boolean)) {
      filters.push(`tags ~ '"${tag}"'`)
    }

    if (q.trim()) {
      const safe = q.trim().replace(/"/g, '')
      filters.push(`(title ~ "${safe}" || description ~ "${safe}" || content ~ "${safe}")`)
    }

    const sortMap: Record<PromptSort, string> = {
      default: '+order_index',
      alpha: '+title',
      newest: '-created',
      oldest: '+created',
    }

    const records = await pb.collection('docs').getFullList({
      filter: filters.join(' && '),
      sort: sortMap[sort] ?? '+order_index',
    })

    return records.map((r) => mapTaggedDoc(r as unknown as Record<string, unknown>))
  } catch {
    return []
  }
}

export async function getAllTags(): Promise<string[]> {
  'use cache'
  cacheTag('docs')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      filter: 'published = true',
    })
    const all = records.flatMap((r) => parseTags(r.tags))
    return [...new Set(all)].sort()
  } catch {
    return []
  }
}

export async function getAllDocParams(): Promise<{ category: string; slug: string }[]> {
  'use cache'
  cacheTag('docs')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getFullList({
      filter: 'published = true',
      fields: 'category,slug',
    })
    return records.map((r) => ({ category: r.category as string, slug: r.slug as string }))
  } catch {
    return []
  }
}

export async function getRecentPrompts(limit = 3): Promise<Pick<TaggedDoc, 'id' | 'title' | 'slug' | 'description' | 'image_url' | 'tags' | 'created_at'>[]> {
  'use cache'
  cacheTag('docs', 'prompts')
  cacheLife('max')
  try {
    const pb = createPB()
    const records = await pb.collection('docs').getList(1, limit, {
      filter: 'published = true && category = "prompts"',
      sort: '-created',
      fields: 'id,title,slug,description,image_url,image,tags,created',
    })
    return records.items.map((r) => ({
      id: r.id,
      title: r.title as string,
      slug: r.slug as string,
      description: (r.description as string) || null,
      image_url: resolveImageUrl(r as unknown as Record<string, unknown>),
      tags: parseTags(r.tags),
      created_at: r.created,
    }))
  } catch {
    return []
  }
}
