'use client'

import type { CSSProperties } from 'react'
import { useLocale } from 'next-intl'

type Props = {
  title: string
  titleTr?: string
  as?: 'h1' | 'h2' | 'h3' | 'span'
  className?: string
  style?: CSSProperties
}

export function LocalizedBlogTitle({ title, titleTr, as = 'span', className, style }: Props) {
  const locale = useLocale()
  const text = locale === 'tr' && titleTr ? titleTr : title

  if (as === 'h1') return <h1 className={className} style={style}>{text}</h1>
  if (as === 'h2') return <h2 className={className} style={style}>{text}</h2>
  if (as === 'h3') return <h3 className={className} style={style}>{text}</h3>
  return <span className={className} style={style}>{text}</span>
}
