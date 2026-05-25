import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { getDocs, resolveDocImageUrl } from '@/lib/docs'
import { ScrollFadeAside } from '@/components/layout/ScrollFadeAside'
import { MobileOnThisPage } from '@/components/layout/MobileOnThisPage'
import { renderDocHtml } from '@/components/docs/DocContent'
import { renderMarkdownHtml } from '@/lib/render-markdown'
import { DocVersionHandler } from '@/components/docs/DocVersionHandler'
import { CopyPageButton } from '@/components/docs/CopyPageButton'
import { CopyCodeButton } from '@/components/docs/CopyCodeButton'
import { DocNavLinks, DocSourceLink, DocRequiredImages, DocSidebarPanel } from '@/components/docs/DocClientUI'
import { Pencil } from 'lucide-react'
import type { Doc } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

async function getDocById(id: string): Promise<Doc | null> {
  'use cache'
  cacheTag('docs', `doc-admin-${id}`)
  cacheLife('hours')

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

async function PreviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [doc, docs] = await Promise.all([getDocById(id), getDocs()])
  if (!doc) notFound()

  const isBlog = doc.category === 'blog'
  const { html: currentHtml, lang: currentLang } = isBlog
    ? { html: await renderMarkdownHtml(doc.content), lang: 'blog' }
    : await renderDocHtml(doc.content)

  const currentIndex = docs.findIndex((d) => d.id === doc.id)
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null

  return (
    <div className="flex flex-col min-h-screen">
      {/* Preview banner */}
      <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
        <span className="font-medium">Preview — {doc.published ? 'Published' : 'Draft'}</span>
        <Link href={`/admin/edit/${doc.id}`} className="flex items-center gap-1.5 hover:underline">
          <Pencil className="w-3 h-3" />
          Back to editor
        </Link>
      </div>

      <div id="main-content" className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Content */}
        <main className="flex-1 min-w-0 px-4 md:px-10 pt-3 pb-32">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-[1.4rem] font-bold tracking-tight leading-tight" style={{ fontFamily: '"Anthropic Serif Display", Georgia, "Times New Roman", Times, serif' }}>
                {doc.title}
              </h1>
              {doc.category !== 'blog' && <CopyPageButton content={doc.content} />}
            </div>
            {doc.description && (
              <p className="text-sm text-muted-foreground mt-2">{doc.description}</p>
            )}
            {doc.tags && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {doc.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded border border-border text-[11px] font-mono bg-muted text-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mobile On This Page */}
          {!doc.image_url && (
            <div className="lg:hidden mb-6">
              <MobileOnThisPage content={doc.content} />
            </div>
          )}

          {/* Image */}
          {doc.image_url && (
            <div className="relative mb-8 rounded-xl border border-border overflow-hidden flex justify-center items-center" style={{ maxHeight: '70vh' }}>
              <div
                className="absolute inset-0 scale-110 blur-2xl brightness-90"
                style={{ backgroundImage: `url(${doc.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <img
                src={doc.image_url}
                alt={doc.title}
                loading="eager"
                decoding="async"
                className="relative z-10 max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}

          {!!doc.required_images && <DocRequiredImages count={doc.required_images} />}

          <DocVersionHandler
            doc={doc}
            versions={[]}
            currentHtml={currentHtml}
            currentLang={currentLang}
          />
          <CopyCodeButton />

          {doc.source_url && <DocSourceLink url={doc.source_url} />}
          <DocNavLinks prevDoc={prevDoc} nextDoc={nextDoc} />
        </main>

        {/* Right sidebar */}
        <ScrollFadeAside className="hidden lg:block w-[260px] shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto scrollbar-none border-l border-border pl-5">
          <DocSidebarPanel
            currentId={doc.id}
            currentCategory={doc.category}
            docs={docs}
            tags={doc.tags ?? []}
          />
        </ScrollFadeAside>
      </div>
    </div>
  )
}

export default function AdminPreviewPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-8 w-48 bg-muted animate-pulse rounded-lg m-8" />}>
      <PreviewContent params={params} />
    </Suspense>
  )
}
