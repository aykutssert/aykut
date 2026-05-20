'use client'

import { useState } from 'react'
import { Check, Clipboard } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function CopyPageButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('doc')

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex shrink-0 items-center gap-1.5 text-sm whitespace-nowrap text-foreground border border-foreground/25 rounded-md px-3 py-1.5 transition-colors
      hover:bg-[#EEEEE8] dark:hover:bg-[#171513]"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          {t('copied')}
        </>
      ) : (
        <>
          <Clipboard className="w-3.5 h-3.5" />
          {t('copy_prompt')}
        </>
      )}
    </button>
  )
}
