'use client'

import { useLocale } from 'next-intl'

export function LanguageToggle() {
  const locale = useLocale()

  function handleToggle() {
    const next = locale === 'en' ? 'tr' : 'en'
    document.cookie = `locale=${next};path=/;max-age=31536000`
    window.location.reload()
  }

  return (
    <button
      onClick={handleToggle}
      className="flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[#EEEEE8] dark:hover:bg-[#171513] hover:text-foreground"
    >
      {locale === 'en' ? '🇹🇷 TR' : '🇬🇧 EN'}
    </button>
  )
}
