'use client'

import { useLocale } from 'next-intl'

export function PostDate({ iso }: { iso: string }) {
  const locale = useLocale() === 'tr' ? 'tr-TR' : 'en-US'
  return (
    <time dateTime={iso}>
      {new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
    </time>
  )
}
