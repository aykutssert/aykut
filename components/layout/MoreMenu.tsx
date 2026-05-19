'use client'

import { useEffect, useRef, useState } from 'react'
import { useSyncExternalStore } from 'react'
import { ChevronDown, Heart, MessageSquarePlus, PawPrint } from 'lucide-react'
import Link from 'next/link'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { ROAMING_PET_STORAGE_KEY, ROAMING_PET_EVENT } from '@/components/pets/RoamingPetToggle'
import { useTranslations } from 'next-intl'

function readPetEnabled() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(ROAMING_PET_STORAGE_KEY) !== 'false'
}

function subscribePet(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  function onStorage(event: StorageEvent) {
    if (event.key === ROAMING_PET_STORAGE_KEY) callback()
  }
  window.addEventListener(ROAMING_PET_EVENT, callback)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(ROAMING_PET_EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function MoreMenu() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const petEnabled = useSyncExternalStore(subscribePet, readPetEnabled, () => true)
  const t = useTranslations('nav')

  function togglePet() {
    const next = !readPetEnabled()
    window.localStorage.setItem(ROAMING_PET_STORAGE_KEY, String(next))
    window.dispatchEvent(new Event(ROAMING_PET_EVENT))
  }

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        aria-expanded={open}
      >
        {t('more')}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[80] w-44 overflow-hidden rounded-lg border border-border bg-background shadow-xl">
<button
            type="button"
            onClick={() => { setOpen(false); setFeedbackOpen(true) }}
            className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            {t('suggest')}
          </button>
          <Link
            href="/pets"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PawPrint className="h-3.5 w-3.5 text-pink-500" />
            {t('pets')}
          </Link>
          <Link
            href="/account/likes"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            {t('liked')}
          </Link>
          <button
            type="button"
            onClick={togglePet}
            className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <PawPrint className={`h-3.5 w-3.5 ${petEnabled ? 'text-green-500' : 'text-red-400'}`} />
              Pet
            </span>
            <span className={`text-[10px] font-medium ${petEnabled ? 'text-green-500' : 'text-red-400'}`}>
              {petEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      )}

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  )
}
