'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export function PetsPageScroller() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  const prevPage = useRef(page)

  useEffect(() => {
    if (page !== prevPage.current) {
      prevPage.current = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [page])

  return null
}
