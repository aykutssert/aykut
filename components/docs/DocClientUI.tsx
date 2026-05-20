'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, ExternalLink, ImageIcon } from 'lucide-react'
import type { DocMeta } from '@/types'

// Previous / Next navigation
export function DocNavLinks({
  prevDoc,
  nextDoc,
}: {
  prevDoc: DocMeta | null
  nextDoc: DocMeta | null
}) {
  const t = useTranslations('doc')
  if (!prevDoc && !nextDoc) return null
  return (
    <div className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4">
      {prevDoc ? (
        <Link
          href={`/docs/${prevDoc.category}/${prevDoc.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t('previous')}</p>
            <p className="font-medium group-hover:text-foreground">{prevDoc.title}</p>
          </div>
        </Link>
      ) : <div />}
      {nextDoc ? (
        <Link
          href={`/docs/${nextDoc.category}/${nextDoc.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
        >
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t('next')}</p>
            <p className="font-medium group-hover:text-foreground">{nextDoc.title}</p>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : <div />}
    </div>
  )
}

// Source link
export function DocSourceLink({ url }: { url: string }) {
  const t = useTranslations('doc')
  return (
    <div className="mt-10 pt-6 border-t border-border">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        {t('source')}
      </a>
    </div>
  )
}

// Requires images badge
export function DocRequiredImages({ count }: { count: number }) {
  const t = useTranslations('doc')
  return (
    <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full border w-fit text-sm font-medium
      bg-amber-50 border-amber-200 text-amber-700
      dark:bg-amber-950/40 dark:border-amber-800/50 dark:text-amber-400">
      <ImageIcon className="w-4 h-4 shrink-0" />
      <span>{t('requires_images', { count })}</span>
    </div>
  )
}

// Right sidebar: Related or More in category
export function DocSidebarPanel({
  currentId,
  currentCategory,
  docs,
  tags,
}: {
  currentId: string
  currentCategory: string
  docs: DocMeta[]
  tags: string[]
}) {
  const t = useTranslations('doc')

  const related = tags.length > 0
    ? docs.filter((d) => d.id !== currentId && (d.tags ?? []).some((tag) => tags.includes(tag))).slice(0, 8)
    : []

  const sidebarDocs = related.length > 0
    ? { label: t('related'), items: related }
    : {
        label: t('more_in', { category: currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1) }),
        items: docs.filter((d) => d.id !== currentId && d.category === currentCategory).slice(0, 8),
      }

  if (sidebarDocs.items.length === 0) return null

  return (
    <div className="pt-1.5 pb-8 pr-1">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground mb-4">{sidebarDocs.label}</p>
      <div className="flex flex-col gap-3">
        {sidebarDocs.items.map((d) => (
          <Link
            key={d.id}
            href={`/docs/${d.category}/${d.slug}`}
            className="group block rounded-md border border-border bg-background p-3 transition-colors hover:border-foreground/30"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-[13px] font-medium leading-snug tracking-tight line-clamp-2 group-hover:underline group-hover:underline-offset-2">
                {d.title}
              </h3>
              {d.image_url && (
                <span className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                  {t('badge_image')}
                </span>
              )}
            </div>
            {d.description && (
              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/90">
                {d.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
