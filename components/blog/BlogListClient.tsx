'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LocalizedBlogTitle } from '@/components/blog/LocalizedBlogTitle'
import type { BlogPostMeta } from '@/lib/blog'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-foreground/20">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[16/7] overflow-hidden bg-muted">
          {post.image ? (
            <>
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-xl opacity-60"
                style={{ backgroundImage: `url(${post.image})` }}
              />
              <img
                src={post.image}
                alt={post.title}
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

        <div className="p-3">
          <LocalizedBlogTitle
            as="h2"
            title={post.title}
            titleTr={post.titleTr}
            className="text-sm font-semibold leading-snug tracking-tight group-hover:underline group-hover:underline-offset-4"
          />
          {post.description && (
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {post.date && (
            <p className="mt-2 text-[10px] text-muted-foreground">{fmtDate(post.date)}</p>
          )}
        </div>
      </Link>
    </article>
  )
}

export function BlogListClient({ posts }: { posts: BlogPostMeta[] }) {
  const t = useTranslations('docs_page')

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-0 pt-6 pb-12">
        <main className="min-w-0">
          {posts.length === 0 ? (
            <div className="rounded-xl border border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">{t('no_posts_yet')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}
