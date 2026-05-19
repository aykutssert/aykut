'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from '@/messages/en.json'

type Locale = 'en' | 'tr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>

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
  const [locale, setLocaleState] = useState<Locale>('en')
  const [messages, setMessages] = useState<Messages>(enMessages)

  useEffect(() => {
    const saved = readLocaleCookie()
    if (saved === 'tr') {
      import('@/messages/tr.json').then((m) => {
        setMessages(m.default)
        setLocaleState('tr')
      })
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    document.cookie = `locale=${next};path=/;max-age=31536000`
    if (next === 'tr') {
      import('@/messages/tr.json').then((m) => {
        setMessages(m.default)
        setLocaleState('tr')
      })
    } else {
      setMessages(enMessages)
      setLocaleState('en')
    }
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
