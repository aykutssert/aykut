'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Globe } from 'lucide-react'

const LABELS: Record<string, string> = { tr: 'TR', en: 'EN' }
const OTHER: Record<string, string> = { tr: 'en', en: 'tr' }

export function LocaleSwitcher() {
  const pathname = usePathname() // e.g. /tr/pricing

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'tr'
  const targetLocale = OTHER[currentLocale]

  // Swap the locale prefix: /tr/pricing → /en/pricing
  const targetPath = pathname.replace(/^\/(tr|en)/, `/${targetLocale}`)

  return (
    <Link
      href={targetPath}
      className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Switch to ${targetLocale === 'tr' ? 'Türkçe' : 'English'}`}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{LABELS[targetLocale]}</span>
    </Link>
  )
}
