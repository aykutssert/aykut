'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function BackButton() {
  const router = useRouter()
  const t = useTranslations('pets_page')

  function handleBack() {
    if (window.history.length > 1) router.back()
    else router.push('/pets')
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {t('back')}
    </button>
  )
}
