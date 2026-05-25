import Link from 'next/link'
import { Suspense } from 'react'
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { resolveDocImageUrl } from '@/lib/docs'
import { DocTable } from '@/components/admin/DocTable'
import type { Doc } from '@/types'

async function getAllDocs(): Promise<Doc[]> {
  'use cache'
  cacheTag('docs')
  cacheLife('hours')

  const pb = await createAdminPB()
  const records = await pb.collection('docs').getFullList({
    sort: 'category,order_index',
    fields: 'id,title,slug,category,description,order_index,published,image,image_url,tags,created,updated',
  })
  return records.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.category,
    description: r.description ?? null,
    content: '',
    source_url: null,
    image_url: resolveDocImageUrl(r),
    required_images: null,
    variables: [],
    tags: Array.isArray(r.tags) ? r.tags : [],
    order_index: r.order_index ?? 0,
    published: r.published ?? false,
    created_at: r.created,
    updated_at: r.updated,
  })) as Doc[]
}

async function DocList() {
  const docs = await getAllDocs()

  if (docs.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        No docs yet.{' '}
        <Link href="/admin/new" className="underline underline-offset-4 hover:text-foreground">
          Create the first one.
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">All docs</h1>
      <DocTable docs={docs} />
    </div>
  )
}

export default function AdminDocsPage() {
  return (
    <Suspense fallback={<div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />}>
      <DocList />
    </Suspense>
  )
}
