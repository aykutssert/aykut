'use client'

import { useLocaleContext } from './LocaleProvider'

export function LanguageToggle() {
  const { locale, setLocale } = useLocaleContext()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'tr' : 'en')}
      className="flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {locale === 'en' ? '🇹🇷 TR' : '🇬🇧 EN'}
    </button>
  )
}
