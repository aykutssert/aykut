'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from '@/messages/en.json'
import trMessages from '@/messages/tr.json'

type Locale = 'en' | 'tr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allMessages: Record<Locale, any> = { en: enMessages, tr: trMessages }

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
  const value = match?.[1]
  return value === 'tr' ? 'tr' : 'en'
}

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', setLocale: () => {} })

export function useLocaleContext() {
  return useContext(LocaleContext)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Start with 'en' on both server and client to avoid hydration mismatch.
  // Switch to the cookie locale in useEffect after hydration completes.
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    setLocaleState(readLocaleCookie())
  }, [])

  const setLocale = useCallback((next: Locale) => {
    document.cookie = `locale=${next};path=/;max-age=31536000`
    setLocaleState(next)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
