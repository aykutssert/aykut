import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollFadeAside } from '@/components/layout/ScrollFadeAside'
import { MobileOnThisPage } from '@/components/layout/MobileOnThisPage'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { renderMarkdownHtml } from '@/lib/render-markdown'
import { CopyCodeButton } from '@/components/docs/CopyCodeButton'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { BlogToc } from '@/components/docs/BlogToc'
import { PostDate } from '@/components/blog/PostDate'
import { LocalizedBlogTitle } from '@/components/blog/LocalizedBlogTitle'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getBlogPosts().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
    twitter: {
      card: post.image ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.description,
      ...(post.image ? { images: [post.image] } : {}),
    },
  }
}

const PROSE_CLASSES = `prose prose-sm prose-neutral dark:prose-invert max-w-none
  prose-headings:font-bold prose-headings:tracking-tight
  prose-h1:text-xl prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
  prose-h3:text-sm prose-h3:mt-6 prose-h3:mb-2
  prose-p:leading-6 prose-p:text-foreground/90
  prose-strong:text-foreground
  prose-code:text-[0.8em] prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-transparent prose-pre:p-0 prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:overflow-hidden
  prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground
  prose-hr:border-border
  prose-a:text-foreground prose-a:underline-offset-4
  [&_figure]:my-4 [&_figure[data-rehype-pretty-code-figure]]:border [&_figure[data-rehype-pretty-code-figure]]:border-border [&_figure[data-rehype-pretty-code-figure]]:rounded-lg [&_figure[data-rehype-pretty-code-figure]]:overflow-hidden
  [&_figure[data-rehype-pretty-code-figure]_pre]:m-0 [&_figure[data-rehype-pretty-code-figure]_pre]:rounded-none [&_figure[data-rehype-pretty-code-figure]_pre]:border-0`

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const html = await renderMarkdownHtml(post.content)

  const posts = getBlogPosts()
  const currentIndex = posts.findIndex((p) => p.slug === post.slug)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div id="main-content" className="flex flex-1 max-w-[1400px] mx-auto w-full">
        <main className="flex-1 min-w-0 px-4 md:px-10 pt-8 md:pt-10 pb-32">
          <div className="mb-8">
            <LocalizedBlogTitle
              as="h1"
              title={post.title}
              titleTr={post.titleTr}
              className="text-[1.4rem] font-bold tracking-tight leading-tight"
              style={{ fontFamily: '"Anthropic Serif Display", Georgia, "Times New Roman", Times, serif' }}
            />
            {post.description && (
              <p className="text-sm text-muted-foreground mt-2">{post.description}</p>
            )}
            {post.date && (
              <p className="mt-3 text-xs text-muted-foreground">
                <PostDate iso={post.date} />
              </p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded border border-border text-[11px] font-mono bg-muted text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mobile On This Page */}
          {!post.image && (
            <div className="lg:hidden mb-6">
              <MobileOnThisPage content={post.content} />
            </div>
          )}

          {/* Cover image */}
          {post.image && (
            <div className="relative mb-8 rounded-xl border border-border overflow-hidden flex justify-center items-center" style={{ maxHeight: '70vh' }}>
              <div
                className="absolute inset-0 scale-110 blur-2xl brightness-90"
                style={{ backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <img
                src={post.image}
                alt={post.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="relative z-10 max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}

          <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: html }} />
          <CopyCodeButton />

          {(prevPost || nextPost) && (
            <nav className="mt-12 flex items-stretch gap-3 border-t border-border pt-6">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="flex-1 rounded-lg border border-border p-3 text-sm transition-colors hover:border-foreground/20"
                >
                  <span className="block text-[10px] text-muted-foreground">&larr;</span>
                  <LocalizedBlogTitle title={prevPost.title} titleTr={prevPost.titleTr} className="mt-1 block font-medium line-clamp-2" />
                </Link>
              ) : <span className="flex-1" />}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="flex-1 rounded-lg border border-border p-3 text-right text-sm transition-colors hover:border-foreground/20"
                >
                  <span className="block text-[10px] text-muted-foreground">&rarr;</span>
                  <LocalizedBlogTitle title={nextPost.title} titleTr={nextPost.titleTr} className="mt-1 block font-medium line-clamp-2" />
                </Link>
              ) : <span className="flex-1" />}
            </nav>
          )}
        </main>

        {/* Right sidebar */}
        <ScrollFadeAside className="hidden lg:block w-[260px] shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto scrollbar-none border-l border-border pl-5">
          <BlogToc html={html} />
        </ScrollFadeAside>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
