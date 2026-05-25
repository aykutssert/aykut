import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { getAllCategories, getAllDocsMeta, resolveDocImageUrl } from '@/lib/docs'
import { DocForm } from '@/components/admin/DocForm'
import type { Doc } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

async function getDocById(id: string): Promise<Doc | null> {
  'use cache'
  cacheTag('docs', `doc-admin-${id}`)
  cacheLife('max')

  const pb = await createAdminPB()
  try {
    const r = await pb.collection('docs').getOne(id)
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      category: r.category,
      description: r.description ?? null,
      content: r.content ?? '',
      source_url: r.source_url ?? null,
      image_url: resolveDocImageUrl(r),
      required_images: r.required_images ?? null,
      variables: r.variables ?? [],
      tags: Array.isArray(r.tags) ? r.tags : [],
      order_index: r.order_index ?? 0,
      published: r.published ?? false,
      created_at: r.created,
      updated_at: r.updated,
    } as Doc
  } catch {
    return null
  }
}

async function EditDocContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [doc, categories, allDocs] = await Promise.all([
    getDocById(id),
    getAllCategories(),
    getAllDocsMeta(),
  ])

  if (!doc) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit blog</h1>
      <DocForm doc={doc} categories={categories} allDocs={allDocs} />
    </div>
  )
}

export default function EditDocPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />}>
      <EditDocContent params={params} />
    </Suspense>
  )
}
