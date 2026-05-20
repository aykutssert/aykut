'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from '@/messages/en.json'
import trMessages from '@/messages/tr.json'

type Locale = 'en' | 'tr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', setLocale: () => {} })

export function useLocaleContext() {
  return useContext(LocaleContext)
}

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
  return match?.[1] === 'tr' ? 'tr' : 'en'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocaleCookie)
  const [messages, setMessages] = useState<Messages>(() =>
    readLocaleCookie() === 'tr' ? trMessages : enMessages
  )

  const setLocale = useCallback((next: Locale) => {
    document.cookie = `locale=${next};path=/;max-age=31536000`
    setMessages(next === 'tr' ? trMessages : enMessages)
    setLocaleState(next)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
