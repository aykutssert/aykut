'use client'

import { useState, useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from '@/messages/en.json'
import trMessages from '@/messages/tr.json'

type Locale = 'en' | 'tr'

function readCookie(): Locale {
  if (typeof document === 'undefined') return 'en'
  return document.cookie.includes('locale=tr') ? 'tr' : 'en'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = readCookie()
    if (saved !== locale) setLocale(saved)
  }, [])

  const messages = locale === 'tr' ? trMessages : enMessages

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
