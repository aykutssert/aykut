'use client'

import { useEffect, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from '@/messages/en.json'
import trMessages from '@/messages/tr.json'

type Locale = 'en' | 'tr'

// Static HTML is built with the default locale (tr). The first client render
// must match that to avoid a hydration mismatch, so we read the cookie in an
// effect and swap after mount rather than in the initial state.
function readCookie(): Locale {
  if (typeof document === 'undefined') return 'tr'
  if (document.cookie.includes('locale=en')) return 'en'
  return 'tr'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('tr')

  useEffect(() => {
    const cookieLocale = readCookie()
    if (cookieLocale !== locale) setLocale(cookieLocale)
    document.documentElement.lang = cookieLocale
  }, [locale])

  const messages = locale === 'tr' ? trMessages : enMessages

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
