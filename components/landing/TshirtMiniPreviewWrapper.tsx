'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const TshirtMiniPreview = dynamic(
  () => import('./TshirtMiniPreview').then(m => ({ default: m.TshirtMiniPreview })),
  { ssr: false }
)

export function TshirtMiniPreviewWrapper() {
  const [mountKey, setMountKey] = useState(0)
  const [ready, setReady] = useState(false)

  // Wait one RAF before creating Canvas so any previous WebGL context
  // (e.g. from TshirtViewer) has time to fully release before we open a new one.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => {
      cancelAnimationFrame(raf)
      setReady(false)
    }
  }, [mountKey])

  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) setMountKey((k) => k + 1)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  return (
    <div className="h-full w-full bg-[#111111]">
      {ready && <TshirtMiniPreview key={mountKey} />}
    </div>
  )
}
