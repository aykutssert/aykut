'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function LanguageToggle({ locale }: { locale: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next = locale === 'en' ? 'tr' : 'en'
    document.cookie = `locale=${next};path=/;max-age=31536000`
    startTransition(() => router.refresh())
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      {locale === 'en' ? 'TR' : 'EN'}
    </button>
  )
}
