'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { PRODUCT_TEMPLATE_CATEGORIES, PRODUCT_TEMPLATE_CATEGORY_LABELS } from '@/lib/product-template-categories'
import type { ProductTemplate } from '@/types'

function ProductTemplateCard({
  template,
  onPreview,
}: {
  template: ProductTemplate
  onPreview: (template: ProductTemplate) => void
}) {
  return (
    <article className="mb-4 break-inside-avoid overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5">
      <button
        type="button"
        onClick={() => onPreview(template)}
        className="block w-full p-0"
        aria-label={`Preview ${template.name}`}
      >
        <img
          src={template.image_url}
          alt={template.name}
          loading="lazy"
          decoding="async"
          className="block w-full"
        />
      </button>
    </article>
  )
}

function TemplateLightbox({
  template,
  onClose,
  hasProducts,
}: {
  template: ProductTemplate
  onClose: () => void
  hasProducts: boolean
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] bg-background/85 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close preview"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-dvh items-center justify-center p-4 sm:p-10">
        <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5 sm:px-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{template.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {PRODUCT_TEMPLATE_CATEGORY_LABELS[template.category]}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {hasProducts ? (
                <Link
                  href={`/product-studio/create?template=${template.id}`}
                  className="rounded-md border border-foreground/15 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  Use template
                </Link>
              ) : (
                <Link
                  href="/product-studio/products"
                  className="rounded-md border border-foreground/15 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  Add a product first
                </Link>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex max-h-[calc(100dvh-160px)] items-center justify-center bg-muted/30 p-2 sm:p-4">
            <img
              src={template.image_url}
              alt={template.name}
              className="max-h-[calc(100dvh-192px)] w-auto max-w-full rounded-sm object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductTemplateGallery({ templates = [], hasProducts = false }: { templates: ProductTemplate[]; hasProducts?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [preview, setPreview] = useState<ProductTemplate | null>(null)

  const filtered = activeCategory
    ? templates.filter((t) => t.category === activeCategory)
    : templates

  return (
    <>
      {!hasProducts && (
        <Link
          href="/product-studio/products"
          className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/60"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Add a product to My Products before using a template.</span>
          <span className="ml-auto shrink-0 font-medium underline underline-offset-2">Go to My Products →</span>
        </Link>
      )}
      <div className="flex gap-6">
        {/* Left category filter */}
        <aside className="hidden w-48 shrink-0 md:block">
          <div className="rounded-xl border border-border p-3 sticky top-[105px]">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </p>
            <ul className="space-y-0.5">
              <li>
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                    activeCategory === null
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  All
                </button>
              </li>
              {PRODUCT_TEMPLATE_CATEGORIES.map((cat) => {
                const count = templates.filter((t) => t.category === cat.value).length
                if (count === 0) return null
                return (
                  <li key={cat.value}>
                    <button
                      onClick={() => setActiveCategory(cat.value)}
                      className={`w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors flex items-center justify-between gap-2 ${
                        activeCategory === cat.value
                          ? 'bg-foreground text-background font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="truncate">{cat.label}</span>
                      <span className={`text-xs shrink-0 ${activeCategory === cat.value ? 'text-background/70' : 'text-muted-foreground/60'}`}>{count}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Masonry grid */}
        <div className="flex-1 min-w-0">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {filtered.map((template) => (
              <ProductTemplateCard key={template.id} template={template} onPreview={setPreview} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-muted-foreground">No templates in this category.</p>
          )}
        </div>
      </div>

      {preview && <TemplateLightbox template={preview} onClose={() => setPreview(null)} hasProducts={hasProducts} />}
    </>
  )
}
