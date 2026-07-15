'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('not_found')

  return (
    <div className="relative flex flex-col min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 [--dot-color:hsl(var(--foreground)/0.18)] dark:[--dot-color:hsl(var(--foreground)/0.12)]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-[9rem] font-bold leading-none tabular-nums text-foreground/5 select-none mb-2">
          404
        </p>
        <h1 className="text-xl font-semibold tracking-tight mb-2 -mt-4">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
          {t('description')}
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <FileText className="w-4 h-4" />
          {t('read_docs')}
        </Link>
      </main>
      <Footer />
    </div>
  )
}
