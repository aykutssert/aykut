'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { DeveloperSubnav } from '@/components/layout/DeveloperSubnav'
import { Footer } from '@/components/layout/Footer'
import type { DocMeta } from '@/types'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function BlogCard({ doc }: { doc: DocMeta }) {
  return (
    <article className="overflow-hidden rounded-md border border-border bg-background transition-colors hover:border-foreground/30">
      <Link href={`/docs/${doc.category}/${doc.slug}`} className="group block">
        {/* Fixed aspect ratio image area with blur fill */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {doc.image_url ? (
            <>
              {/* Blur fill background */}
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-xl opacity-60"
                style={{ backgroundImage: `url(${doc.image_url})` }}
              />
              {/* Actual image centered, object-contain */}
              <img
                src={doc.image_url}
                alt={doc.title}
                loading="lazy"
                decoding="async"
                className="relative z-10 h-full w-full object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-muted-foreground/40">No image</span>
            </div>
          )}
        </div>

        <div className="p-3.5">
          <h2 className="text-sm font-semibold leading-snug tracking-tight group-hover:underline group-hover:underline-offset-4">
            {doc.title}
          </h2>
          {doc.description && (
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
              {doc.description}
            </p>
          )}
          {(doc.tags ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {(doc.tags ?? []).slice(0, 3).map((tag) => (
                <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {doc.created_at && (
            <p className="mt-2 text-[10px] text-muted-foreground">{fmtDate(doc.created_at)}</p>
          )}
        </div>
      </Link>
    </article>
  )
}

export function DocsPageClient({ docs }: { docs: DocMeta[] }) {
  const t = useTranslations('docs_page')

  const docsOnly = docs.filter((doc) => doc.category !== 'prompts')

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar docs={docs} />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-0 pt-6 pb-12">
        <DeveloperSubnav />

        <div>
          <main className="min-w-0">
            {docsOnly.length === 0 ? (
              <div className="rounded-md border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">{t('no_posts_yet')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {docsOnly.map((doc) => (
                  <BlogCard key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
