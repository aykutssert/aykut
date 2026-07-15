'use client'

import { useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from '@/messages/en.json'
import trMessages from '@/messages/tr.json'

type Locale = 'en' | 'tr'

function readCookie(): Locale {
  if (typeof document === 'undefined') return 'tr'
  if (document.cookie.includes('locale=en')) return 'en'
  return 'tr'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale] = useState<Locale>(() => readCookie())

  const messages = locale === 'tr' ? trMessages : enMessages

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
