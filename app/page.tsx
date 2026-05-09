import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Code2, PawPrint, Shirt, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getDocs } from '@/lib/docs'
import { FadeInSection } from '@/components/landing/FadeInSection'
import { TshirtMiniPreviewWrapper } from '@/components/landing/TshirtMiniPreviewWrapper'
import { KitchenShowcase } from '@/components/landing/KitchenShowcase'

export const metadata: Metadata = {
  title: 'Aykut Sert — Things I\'ve built',
  description: 'A collection of AI tools and developer experiments — Kitchen Studio, T-Shirt Studio, and a developer toolkit built with Next.js, Three.js, and OpenAI.',
}

export default async function LandingPage() {
  const docs = await getDocs()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* dot grid */}
        <div
          className="absolute inset-0 dark:[--dot-color:hsl(var(--foreground)/0.12)] [--dot-color:hsl(var(--foreground)/0.18)]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* color glows — light mode more opaque, dark mode subtler */}
        <div className="animate-glow-a absolute left-0 top-0 h-72 w-72 -translate-x-1/4 rounded-full bg-violet-400/40 blur-3xl dark:bg-violet-500/15 sm:h-80 sm:w-80 sm:left-1/4 sm:-translate-x-1/2" />
        <div className="animate-glow-b absolute right-0 top-4 h-56 w-56 translate-x-1/4 rounded-full bg-sky-400/40 blur-3xl dark:bg-sky-500/15 sm:h-64 sm:w-64 sm:right-1/4 sm:translate-x-1/2" />
        {/* vignette — transparent at top so glows show, fade to background at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 py-24 text-center md:px-0 md:py-32">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Full-stack · AI · 3D
          </div>

          <h1 className="mx-auto max-w-xl text-4xl font-bold tracking-tight sm:text-5xl md:text-[3.5rem] md:leading-[1.15]">
            <span
              className="animate-gradient bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #f97316, #7c3aed, #4f46e5, #2563eb, #0284c7, #06b6d4, #0ea5e9, #4f46e5, #7c3aed, #ea580c, #f97316)',
              }}
            >
              Things I&apos;ve built
            </span>
          </h1>

          <p className="mx-auto mt-3 text-sm text-muted-foreground/60">
            by <a href="https://github.com/aykutssert" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-2">Aykut Sert</a>
          </p>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted-foreground sm:max-w-md sm:text-[15px]">
            A collection of AI tools and developer experiments — built to learn, share, and push what&apos;s possible.
          </p>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="border-b border-border bg-gradient-to-r from-violet-50/60 via-sky-50/40 to-violet-50/60 dark:from-violet-950/20 dark:via-sky-950/10 dark:to-violet-950/20 overflow-hidden">
        <div className="flex py-2.5">
          <div className="animate-marquee flex shrink-0 items-center gap-0">
            {[
              'Next.js 15 App Router',
              'React Three Fiber',
              'WebGL Renderer',
              'OpenAI Image Generation',
              'Supabase Postgres',
              'Fabric.js UV Editor',
              'Self-hosted on VPS',
              'REST API',
              'npm CLI',
              'Full-text Search',
              'Community Prompts',
              'AI Documentation',
              'Real-time 3D Preview',
              'Next.js 15 App Router',
              'React Three Fiber',
              'WebGL Renderer',
              'OpenAI Image Generation',
              'Supabase Postgres',
              'Fabric.js UV Editor',
              'Self-hosted on VPS',
              'REST API',
              'npm CLI',
              'Full-text Search',
              'Community Prompts',
              'AI Documentation',
              'Real-time 3D Preview',
            ].map((text, i) => (
              <span key={i} className="flex shrink-0 items-center gap-4 px-4 text-xs text-muted-foreground/70">
                <span className="text-[8px] text-violet-400/60">✦</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Workflow cards ── */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-12 md:px-0 md:py-16">
        <FadeInSection>
        {/* Top row: Kitchen Studio + T-Shirt Studio */}
        <div className="grid gap-4 md:grid-cols-2">

          {/* Kitchen Studio */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
            <div className="flex flex-col p-6 pb-6">
              <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300">
                <Sparkles className="h-3 w-3" />
                Kitchen Studio
              </div>

              <h2 className="text-xl font-bold tracking-tight">AI countertop visualizer</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Upload a kitchen photo, generate realistic countertop alternatives with AI.
              </p>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden border-t border-border" style={{ minHeight: 450 }}>
              <KitchenShowcase />
            </div>
          </div>

          {/* T-Shirt Studio */}
          <Link
            href="/tshirt-studio"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl hover:shadow-foreground/5"
          >
            <div className="flex flex-col p-6 pb-6">
              <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/40 dark:text-violet-300">
                <Shirt className="h-3 w-3" />
                T-Shirt Studio
              </div>

              <h2 className="text-xl font-bold tracking-tight">3D t-shirt designer</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                UV canvas editor with drag, scale &amp; rotate — renders live on a real 3D shirt model with WebGL.
              </p>
            </div>

            {/* Live 3D preview */}
            <div className="relative flex flex-1 overflow-hidden border-t border-border bg-[#111111]" style={{ minHeight: 450 }}>
              <TshirtMiniPreviewWrapper />
              <div className="absolute left-3 bottom-3 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  Live demo
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

        </div>

        {/* Bottom: Developer */}
        <Link
          href="/prompts"
          className="group mt-4 relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl hover:shadow-foreground/5 md:flex-row"
        >
          <div className="flex flex-col p-6 pb-5 md:flex-1">
            <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-700 dark:border-sky-800/40 dark:bg-sky-950/40 dark:text-sky-300">
              <Code2 className="h-3 w-3" />
              Developer
            </div>

            <h2 className="text-xl font-bold tracking-tight">Developer toolkit</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Full-text searchable docs system, a curated prompt library, and pixel-art Codex pets with a public REST API and npm CLI.
            </p>

            <p className="mt-4 text-[11px] font-mono text-muted-foreground/60">Next.js · Supabase · REST API · npm</p>

            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              <span className="group-hover:underline underline-offset-2">Explore</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Code terminal */}
          <div className="p-6 md:w-80 md:border-l border-t md:border-t-0 border-border flex flex-col justify-center">
            <div className="overflow-hidden rounded-xl border border-border font-mono text-xs">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 text-[10px] tracking-wide text-muted-foreground/60">terminal</span>
              </div>
              <div className="space-y-1 bg-muted/20 px-4 py-4 leading-5 text-muted-foreground">
                <p>
                  <span className="text-foreground/50">$</span>{' '}
                  <span className="text-foreground/80">npx</span>{' '}
                  kernel-pets add gutsy
                </p>
                <p className="mt-2 text-foreground/35"># installs a Codex pet into ~/.codex/pets</p>
              </div>
              <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-4 py-2">
                <PawPrint className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-[10px] text-muted-foreground/60">published npm cli for one-command installs</span>
              </div>
            </div>
          </div>
        </Link>

        </FadeInSection>
      </main>

      <Footer />
    </div>
  )
}
