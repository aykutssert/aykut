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
      className="flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]"
    >
      {locale === 'en' ? '🇹🇷 TR' : '🇬🇧 EN'}
    </button>
  )
}
