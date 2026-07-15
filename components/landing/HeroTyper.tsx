'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const TYPE_SPEED = 55

export function HeroTyper({ className }: { className?: string }) {
  const t = useTranslations('landing.hero')
  const text = t('text')

  return <TypedText key={text} text={text} className={className} />
}

function TypedText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState(() => text.slice(0, 1))

  useEffect(() => {
    if (displayed.length >= text.length) return

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, TYPE_SPEED)

    return () => clearTimeout(timer)
  }, [text, displayed])

  return (
    <span className={className}>
      {displayed || text}
    </span>
  )
}
