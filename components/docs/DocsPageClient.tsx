'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { DeveloperSubnav } from '@/components/layout/DeveloperSubnav'
import { Footer } from '@/components/layout/Footer'
import type { DocMeta } from '@/types'

export function DocsPageClient({ docs }: { docs: DocMeta[] }) {
  const t = useTranslations('docs_page')

  const docsOnly = docs.filter((doc) => doc.category !== 'prompts')
  const grouped = docsOnly.reduce<Record<string, typeof docsOnly>>((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category].push(doc)
    return acc
  }, {})
  const categories = Object.keys(grouped)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar docs={docs} />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-0 pt-6 pb-12">
        <DeveloperSubnav />
        <div className="flex min-h-5 items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground">
            {t('article_count', { count: docsOnly.length, cats: categories.length })}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[117px] space-y-1 rounded-md border border-border bg-background p-3">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('categories')}
              </p>
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${category}`}
                  className="block rounded-md px-2 py-1.5 text-sm capitalize text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {category}
                </a>
              ))}
              <Link
                href="/prompts"
                className="mt-2 flex items-center justify-between rounded-md border border-border px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {t('prompts_link')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>

          <main className="min-w-0">
            {docsOnly.length === 0 ? (
              <div className="rounded-md border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">{t('no_posts_yet')}</p>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(grouped).map(([category, items]) => (
                  <section key={category} id={category} className="scroll-mt-32">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {category}
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        {t('article_count_short', { count: items.length })}
                      </span>
                    </div>
                    <div className="divide-y divide-border rounded-md border border-border">
                      {items.map((doc) => (
                        <Link
                          key={doc.id}
                          href={`/docs/${doc.category}/${doc.slug}`}
                          className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium group-hover:underline group-hover:underline-offset-4">
                              {doc.title}
                            </p>
                            {(doc.tags ?? []).length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {(doc.tags ?? []).slice(0, 4).map((tag) => (
                                  <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                        </Link>
                      ))}
                    </div>
                  </section>
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
