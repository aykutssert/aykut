'use client'

import { useState, useEffect, useRef } from 'react'

const STAY_MS = 3000
const FADE_MS = 700

export function BeforeAfterShowcase({
  beforeSrc,
  afterSrc,
}: {
  beforeSrc: string
  afterSrc: string
}) {
  const [showAfter, setShowAfter] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    let fade: ReturnType<typeof setTimeout>
    let stay: ReturnType<typeof setTimeout>

    function cycle() {
      if (pausedRef.current) return
      stay = setTimeout(() => {
        setShowAfter((prev) => {
          const next = !prev
          setProgressKey((k) => k + 1)
          return next
        })
        fade = setTimeout(cycle, FADE_MS)
      }, STAY_MS)
    }

    fade = setTimeout(cycle, FADE_MS)
    return () => { clearTimeout(stay); clearTimeout(fade) }
  }, [])

  function handleClick() {
    pausedRef.current = !pausedRef.current
  }

  return (
    <div
      className="relative h-96 cursor-pointer overflow-hidden select-none bg-muted"
      onClick={handleClick}
      title="Click to pause / resume"
    >
      {/* Before */}
      <img
        src={beforeSrc}
        alt="Before — original product photo"
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          opacity: showAfter ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
        }}
        loading="lazy"
        decoding="async"
      />

      {/* After */}
      <img
        src={afterSrc}
        alt="After — AI-generated product photo"
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          opacity: showAfter ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
        }}
        loading="lazy"
        decoding="async"
      />

      {/* Label */}
      <div className="absolute left-3 top-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
          style={{ transition: `opacity ${FADE_MS}ms ease-in-out` }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: showAfter ? '#4ade80' : '#f97316',
              transition: `background ${FADE_MS}ms ease-in-out`,
            }}
          />
          {showAfter ? 'After · AI Generated' : 'Before · Original'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
        <div
          key={progressKey}
          className="h-full bg-white/50"
          style={{
            animation: `before-after-progress ${STAY_MS}ms linear forwards`,
          }}
        />
      </div>
    </div>
  )
}
