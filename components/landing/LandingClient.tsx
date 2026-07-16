'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, GraduationCap, Mail, MapPin, Sparkles, ExternalLink, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FadeInSection } from './FadeInSection'
import { StaggeredGrid } from './StaggeredGrid'
import { TiltCard } from './TiltCard'
import { HeroTyper } from './HeroTyper'
import { LocalizedBlogTitle } from '@/components/blog/LocalizedBlogTitle'
import type { BlogPostMeta } from '@/lib/blog'

type Props = {
  recentBlogPosts: BlogPostMeta[]
}

export function LandingClient({ recentBlogPosts }: Props) {
  const t = useTranslations('landing')
  const heroButtonClass = 'inline-flex items-center gap-1.5 rounded-xl border border-foreground/50 px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-foreground'
  const stackGroups = t.raw('stack.groups') as { label: string; items: string[] }[]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 dark:[--dot-color:hsl(var(--foreground)/0.12)] [--dot-color:hsl(var(--foreground)/0.18)]"
          style={{ backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />

      <section className="relative overflow-hidden">
        <div className="animate-glow-a absolute left-0 top-0 h-72 w-72 -translate-x-1/4 rounded-full bg-violet-400/40 blur-3xl dark:bg-violet-500/15 sm:h-80 sm:w-80 sm:left-1/4 sm:-translate-x-1/2" />
        <div className="animate-glow-b absolute right-0 top-4 h-56 w-56 translate-x-1/4 rounded-full bg-sky-400/40 blur-3xl dark:bg-sky-500/15 sm:h-64 sm:w-64 sm:right-1/4 sm:translate-x-1/2" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 pt-16 pb-6 text-center md:px-0 md:pt-24 md:pb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            {t('hero.badge')}
          </div>

          <h1 className="mx-auto max-w-xl text-4xl font-bold tracking-tight sm:text-5xl md:text-[3.5rem] md:leading-[1.15] min-h-[1.15em]">
            <HeroTyper className="animate-gradient hero-gradient-text bg-clip-text text-transparent" />
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted-foreground sm:max-w-md sm:text-[15px]">
            {t('hero.description')}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects"
              className={heroButtonClass}
            >
              {t('hero.cta_projects')}
              <ChevronDown className="h-3.5 w-3.5" />
            </a>
            <a
              href="#contact"
              className={heroButtonClass}
            >
              {t('hero.cta_contact')}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* About + Skills */}
      <section id="about" className="relative" style={{ scrollMarginTop: '72px' }}>
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 pb-6 md:px-0 md:pt-8 md:pb-8">
          <FadeInSection>
            <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div>
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t('about.label')}</h2>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-background/90 backdrop-blur-sm">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <Image src="/my-face.webp" alt="Aykut Sert" width={72} height={72} sizes="72px" className="rounded-xl object-cover ring-2 ring-border shrink-0" />
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">Aykut Sert</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{t('about.role')}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {t('about.location')}
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">{t('about.bio')}</p>

                  <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{t('about.education')}</span>
                  </div>
                </div>

                <div id="experience" className="p-6 sm:p-8" style={{ scrollMarginTop: '72px' }}>
                  <h3 className="mb-5 text-base font-semibold tracking-tight text-foreground">{t('about.experience.label')}</h3>
                  <div className="relative space-y-5 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-border">
                    <div className="relative pl-5">
                      <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-foreground/70 ring-2 ring-background" />
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div>
                          <p className="font-semibold text-sm">Borusan Otomotiv</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{t('about.experience.borusan_role')}</p>
                        </div>
                        <span className="shrink-0 text-[11px] font-mono text-muted-foreground">Jan 2025 - Jan 2026</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-muted-foreground">{t('about.experience.borusan_desc')}</p>
                    </div>
                    <div className="relative pt-2 pl-5">
                      <span className="absolute left-0 top-3.5 h-2 w-2 rounded-full bg-foreground/70 ring-2 ring-background" />
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div>
                          <p className="font-semibold text-sm">Negzel Teknoloji</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{t('about.experience.negzel_role')}</p>
                        </div>
                        <span className="shrink-0 text-[11px] font-mono text-muted-foreground">Jul 2023 - Aug 2024</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-muted-foreground">{t('about.experience.negzel_desc')}</p>
                    </div>
                  </div>
                </div>

              </div>
              </div>

              <div>
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t('stack.title')}</h2>
                </div>
                <div className="columns-1 sm:columns-2 [column-gap:0.75rem]">
                  {stackGroups.map(({ label, items }) => (
                    <section key={label} className="mb-3 break-inside-avoid rounded-xl border border-border bg-background/85 p-4 backdrop-blur-sm transition-colors duration-200 hover:border-foreground/15">
                      <h3 className="mb-3 text-xs font-semibold tracking-wide text-foreground">
                        {label}
                      </h3>
                      <ul className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <li key={item} className="rounded-md border border-border bg-background/70 px-2 py-1 text-[11px] leading-none text-muted-foreground transition-colors duration-150 hover:border-foreground/15 hover:text-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <div id="contact" className="mt-3 rounded-xl border border-border bg-background/85 p-4 backdrop-blur-sm" style={{ scrollMarginTop: '72px' }}>
                  <h3 className="mb-4 text-base font-semibold tracking-tight text-foreground">{t('contact.label')}</h3>
                  <div className="grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <a href="mailto:aykutssert@gmail.com" className="group flex items-center gap-3 text-muted-foreground transition-colors duration-200 hover:text-foreground">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/70 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                        <Mail className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] text-muted-foreground">{t('contact.email')}</span>
                        <span className="block truncate font-medium">aykutssert@gmail.com</span>
                      </span>
                    </a>
                    <a href="https://github.com/aykutssert" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-muted-foreground transition-colors duration-200 hover:text-foreground">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/70 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </span>
                      <span>
                        <span className="block text-[11px] text-muted-foreground">{t('contact.github')}</span>
                        <span className="block font-medium">aykutssert</span>
                      </span>
                    </a>
                    <a href="https://linkedin.com/in/aykut-sert-9139211b9" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-muted-foreground transition-colors duration-200 hover:text-foreground">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/70 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </span>
                      <span>
                        <span className="block text-[11px] text-muted-foreground">{t('contact.linkedin')}</span>
                        <span className="block font-medium">Aykut Sert</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Projects */}
      <main className="relative mx-auto w-full max-w-[1400px] flex-1 px-4 pt-6 pb-12 md:px-0 md:pt-8 md:pb-14">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t('projects.title')}</h2>
        </div>

        <StaggeredGrid id="projects" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ scrollMarginTop: '72px' }}>

          <TiltCard>
          <a href="https://premiumkiralama.com" target="_blank" rel="noopener noreferrer"
            className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
            <div className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-800/40 dark:bg-blue-950/40 dark:text-blue-300">
              {t('projects.premium.badge')}
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{t('projects.premium.title')}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t('projects.premium.description')}</p>
            </div>
            <p className="mt-auto text-[11px] font-mono text-muted-foreground/60">C# · ASP.NET Core · RabbitMQ · Redis · MongoDB · Docker</p>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              <span className="group-hover:underline underline-offset-2">{t('projects.open')}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </a>
          </TiltCard>

          <TiltCard>
          <Link href="/projects/inference"
            className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
            <div className="inline-flex w-fit items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/40 dark:text-violet-300">
              {t('projects.inference.badge')}
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{t('projects.inference.title')}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t('projects.inference.description')}</p>
            </div>
            <p className="mt-auto text-[11px] font-mono text-muted-foreground/60">Python · C++ · llama.cpp · Docker · RunPod · NVIDIA GPU</p>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              <span className="group-hover:underline underline-offset-2">{t('projects.open')}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
          </TiltCard>

          <TiltCard>
          <div
            className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
            <div className="inline-flex w-fit items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:border-stone-500/50 dark:bg-stone-800/40 dark:text-stone-300">
              Local SEO
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{t('projects.localseo.title')}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t('projects.localseo.description')}</p>
            </div>
            <div className="mt-auto space-y-2">
              <p className="text-[11px] font-mono text-muted-foreground/60">Next.js · SEO · Structured Data</p>
              <div className="grid gap-1.5 text-xs font-medium text-foreground">
                <a href="https://bagcilarmermerci.com/" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 transition-colors hover:text-muted-foreground">
                  {t('projects.localseo.links.countertop')} <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://myarabamekspertiz.com/" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 transition-colors hover:text-muted-foreground">
                  {t('projects.localseo.links.inspection')} <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://myarabamservis.com/" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 transition-colors hover:text-muted-foreground">
                  {t('projects.localseo.links.service')} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          </TiltCard>

          <TiltCard>
          <Link href="/projects/file-upload-service"
            className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
            <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              {t('projects.fileupload.badge')}
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{t('projects.fileupload.title')}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t('projects.fileupload.description')}</p>
            </div>
            <p className="mt-auto text-[11px] font-mono text-muted-foreground/60">Go · Docker · PostgreSQL · NATS · SeaweedFS · Observability</p>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              <span className="group-hover:underline underline-offset-2">{t('projects.open')}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
          </TiltCard>

          <TiltCard>
          <div className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
            <div className="inline-flex w-fit items-center rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[11px] font-semibold text-pink-700 dark:border-pink-800/40 dark:bg-pink-950/40 dark:text-pink-300">
              SwiftUI
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{t('projects.iosapps.title')}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t('projects.iosapps.description')}</p>
            </div>
            <div className="mt-auto space-y-2">
              <p className="text-[11px] font-mono text-muted-foreground/60">Swift · SwiftUI · SwiftData · AI · App Store</p>
              <div className="grid gap-1.5 text-xs font-medium text-foreground">
                <a href="https://apps.apple.com/us/app/my-pet-routine/id6768613964" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 transition-colors hover:text-muted-foreground">
                  My Pet Routine <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://apps.apple.com/us/app/flamy-habit-tracker/id6770295891" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 transition-colors hover:text-muted-foreground">
                  Flamy <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://apps.apple.com/us/app/pack-my-trip/id6768713391" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 transition-colors hover:text-muted-foreground">
                  TripPack <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://aykutssert.github.io/cadie/" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 transition-colors hover:text-muted-foreground">
                  Cadie <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          </TiltCard>

          <TiltCard>
          <a href="/scout"
            className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
            <div className="inline-flex w-fit items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:border-indigo-800/40 dark:bg-indigo-950/40 dark:text-indigo-300">
              Scout
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{t('projects.scout.title')}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t('projects.scout.description')}</p>
            </div>
            <p className="mt-auto text-[11px] font-mono text-muted-foreground/60">Go · AST · npm</p>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              <span className="group-hover:underline underline-offset-2">{t('projects.open')}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </a>
          </TiltCard>

        </StaggeredGrid>


        {/* ── Recent blog posts ── */}
        {recentBlogPosts.length > 0 && (
            <FadeInSection>
            <div className="mt-12 md:mt-16">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t('blog.latest')}</h2>
                <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {t('blog.all')} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recentBlogPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
                    {post.image && (
                      <div className="relative aspect-[16/7] overflow-hidden bg-muted">
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
                      </div>
                    )}
                    <div className="flex flex-col gap-2 p-3">
                      <LocalizedBlogTitle
                        as="h3"
                        title={post.title}
                        titleTr={post.titleTr}
                        className="font-semibold tracking-tight line-clamp-2 text-sm"
                      />
                      {post.description && (
                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{post.description}</p>
                      )}
                      <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                        <span className="group-hover:underline underline-offset-2">{t('blog.read')}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            </FadeInSection>
        )}
      </main>

      <Footer />
      </div>
    </div>
  )
}
