'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
import { useLocale, useTranslations } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ZoomableImage } from '@/components/ui/ZoomableImage'
import type { Project } from '@/lib/projects'

const PROSE_CLASSES = `prose prose-sm prose-neutral dark:prose-invert max-w-none
  prose-headings:font-bold prose-headings:tracking-tight
  prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
  prose-h3:text-sm prose-h3:mt-6 prose-h3:mb-2
  prose-p:leading-6 prose-p:text-foreground/90
  prose-strong:text-foreground
  prose-code:text-[0.8em] prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
  prose-a:text-foreground prose-a:underline-offset-4
  prose-li:marker:text-muted-foreground`

export function ProjectDetailClient({ project, html }: { project: Project; html: string }) {
  const locale = useLocale()
  const t = useTranslations('projects_page')
  const title = locale === 'tr' && project.titleTr ? project.titleTr : project.title
  const description = locale === 'tr' && project.descriptionTr ? project.descriptionTr : project.description

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-0 pt-6 pb-24">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('back')}
        </Link>

        <div className="mt-5">
          <h1 className="text-[1.6rem] font-bold tracking-tight leading-tight" style={{ fontFamily: '"Anthropic Serif", Georgia, serif' }}>
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          )}

          {project.tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((item) => (
                <span key={item} className="rounded border border-border bg-muted px-2 py-0.5 text-[11px] font-mono text-foreground">
                  {item}
                </span>
              ))}
            </div>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-foreground/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground hover:bg-muted/40"
            >
              <GithubIcon className="h-4 w-4" />
              {t('view_source')}
            </a>
          )}
        </div>

        {project.image && (
          <div className="mt-8">
            <ZoomableImage src={project.image} alt={title} priority />
          </div>
        )}

        {html && <div className={`mt-8 ${PROSE_CLASSES}`} dangerouslySetInnerHTML={{ __html: html }} />}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
