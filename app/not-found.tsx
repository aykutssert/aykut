import Link from 'next/link'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PawPrint, FileText } from 'lucide-react'
import { cookies } from 'next/headers'
import enMessages from '@/messages/en.json'
import trMessages from '@/messages/tr.json'

async function NotFoundContent() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value === 'tr' ? 'tr' : 'en'
  const messages = locale === 'tr' ? trMessages : enMessages
  const t = (key: keyof typeof enMessages.not_found) => messages.not_found[key]

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[9rem] font-bold leading-none tabular-nums text-foreground/5 select-none mb-2">
        404
      </p>
      <h1 className="text-xl font-semibold tracking-tight mb-2 -mt-4">{t('title')}</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
        {t('description')}
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/pets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PawPrint className="w-4 h-4" />
          {t('browse_pets')}
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <FileText className="w-4 h-4" />
          {t('read_docs')}
        </Link>
      </div>
    </main>
  )
}

export default function NotFound() {
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
      <Suspense fallback={<div className="flex-1" />}>
        <NotFoundContent />
      </Suspense>
      <Footer />
    </div>
  )
}
