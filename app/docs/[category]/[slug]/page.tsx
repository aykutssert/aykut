import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollFadeAside } from '@/components/layout/ScrollFadeAside'
import { MobileOnThisPage } from '@/components/layout/MobileOnThisPage'

import { getDoc, getDocs, getDocVersions } from '@/lib/docs'
import { renderDocHtml } from '@/components/docs/DocContent'
import { renderMarkdownHtml } from '@/lib/render-markdown'
import { DocVersionHandler } from '@/components/docs/DocVersionHandler'
import { CopyPageButton } from '@/components/docs/CopyPageButton'
import { CopyCodeButton } from '@/components/docs/CopyCodeButton'
import { PromptLikeButton } from '@/components/docs/PromptLikeButton'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { DocViewTracker } from '@/components/docs/DocViewTracker'
import { DocNavLinks, DocSourceLink, DocRequiredImages, DocSidebarPanel } from '@/components/docs/DocClientUI'
import { BlogToc } from '@/components/docs/BlogToc'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const doc = await getDoc(category, slug)
  if (!doc) return {}
  const description = `${doc.title}`
  return {
    title: doc.title,
    description,
    openGraph: {
      title: doc.title,
      description,
      ...(doc.image_url ? { images: [{ url: doc.image_url }] } : {}),
    },
    twitter: {
      card: doc.image_url ? 'summary_large_image' : 'summary',
      title: doc.title,
      description,
      ...(doc.image_url ? { images: [doc.image_url] } : {}),
    },
  }
}

async function DocPageContent({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const [doc, docs] = await Promise.all([getDoc(category, slug), getDocs()])
  if (!doc) notFound()
  
  const isBlog = doc.category === 'blog'
  const [versions, renderedContent] = await Promise.all([
    getDocVersions(doc.id),
    isBlog
      ? renderMarkdownHtml(doc.content).then((html) => ({ html, lang: 'blog' }))
      : renderDocHtml(doc.content).then(({ html, lang }) => ({ html, lang })),
  ])
  const { html: currentHtml, lang: currentLang } = renderedContent
  const likedByMe = false

  const sameCategoryDocs = docs.filter((d) => d.category === doc.category)
  const currentIndex = sameCategoryDocs.findIndex((d) => d.id === doc.id)
  const prevDoc = currentIndex > 0 ? sameCategoryDocs[currentIndex - 1] : null
  const nextDoc = currentIndex < sameCategoryDocs.length - 1 ? sameCategoryDocs[currentIndex + 1] : null

  return (
    <div className="flex flex-col min-h-screen">
      <DocViewTracker title={doc.title} slug={doc.slug} category={doc.category} />
      <Navbar docs={docs} />

      <div id="main-content" className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Content */}
        <main className="flex-1 min-w-0 px-4 md:px-10 pt-3 pb-32">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-[1.4rem] font-bold tracking-tight leading-tight" style={{ fontFamily: '"Anthropic Serif Display", Georgia, "Times New Roman", Times, serif' }}>
                {doc.title}
              </h1>
              <div className="flex shrink-0 items-center gap-2">
                {doc.category === 'prompts' && (
                  <PromptLikeButton
                    docId={doc.id}
                    initialCount={doc.likes_count ?? 0}
                    initialLiked={likedByMe}
                  />
                )}
                {doc.category !== 'blog' && <CopyPageButton content={doc.content} />}
              </div>
            </div>
            {doc.description && (
              <p className="text-sm text-muted-foreground mt-2">{doc.description}</p>
            )}
            {doc.tags && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {doc.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/prompts?tag=${encodeURIComponent(tag)}`}
                    className="px-2 py-0.5 rounded border border-border text-[11px] font-mono bg-muted text-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    {tag}
                  </Link>
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
                fetchPriority="high"
                className="relative z-10 max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}

          {!!doc.required_images && <DocRequiredImages count={doc.required_images} />}

          <DocVersionHandler 
            doc={doc} 
            versions={versions} 
            currentHtml={currentHtml} 
            currentLang={currentLang} 
          />
          <CopyCodeButton />

          {doc.source_url && <DocSourceLink url={doc.source_url} />}
          <DocNavLinks prevDoc={prevDoc} nextDoc={nextDoc} />
        </main>

        {/* Right sidebar */}
        <ScrollFadeAside className="hidden lg:block w-[260px] shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto scrollbar-none border-l border-border pl-5">
          {isBlog ? (
            <BlogToc html={currentHtml} />
          ) : (
            <DocSidebarPanel
              currentId={doc.id}
              currentCategory={doc.category}
              docs={docs}
              tags={doc.tags ?? []}
            />
          )}
        </ScrollFadeAside>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default function DocPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DocPageContent params={params} />
    </Suspense>
  )
}
