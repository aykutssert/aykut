'use client'

import { useState, useEffect, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Menu, PawPrint, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'
import { ROAMING_PET_STORAGE_KEY, ROAMING_PET_EVENT } from '@/components/pets/RoamingPetToggle'
import { cn } from '@/lib/utils'
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


export function MobileNav() {
  const [open, setOpen] = useState(false)

  const pathname = usePathname()
  const petEnabled = useSyncExternalStore(subscribePet, readPetEnabled, () => true)
  const t = useTranslations('nav')

  function togglePet() {
    const next = !readPetEnabled()
    window.localStorage.setItem(ROAMING_PET_STORAGE_KEY, String(next))
    window.dispatchEvent(new Event(ROAMING_PET_EVENT))
  }

  function handleSectionClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (pathname !== '/') return

    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    setOpen(false)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.pushState(null, '', `#${id}`)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(false), 0)
    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-1.5 rounded-md hover:bg-[#EEEEE8] dark:hover:bg-[#171513] text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[200] bg-black/40" onClick={() => setOpen(false)} />

          <div className="fixed top-0 left-0 bottom-0 z-[201] w-72 bg-background border-r shadow-xl flex flex-col">
            <div className="sticky top-0 flex items-center justify-between px-4 h-14 border-b bg-background shrink-0">
              <span className="text-sm font-semibold">{t('more')}</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-[#EEEEE8] dark:hover:bg-[#171513] text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="mb-4 border-b border-border pb-3">
                <Link
                  href="/#experience"
                  onClick={(event) => handleSectionClick(event, 'experience')}
                  className={cn('flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200 text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]')}
                >
                  {t('experience')}
                </Link>
                <Link
                  href="/#projects"
                  onClick={(event) => handleSectionClick(event, 'projects')}
                  className={cn('flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]')}
                >
                  {t('projects')}
                </Link>
              </div>

              <div className="mb-3 space-y-1 border-b border-border pb-3">
                <Link
                  href="/blog"
                  className={cn(
                    'flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200',
                    pathname.startsWith('/blog')
                      ? 'bg-[#E5E5DF] text-foreground dark:bg-[#1E1917]'
                      : 'text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]'
                  )}
                >
                  {t('blog')}
                </Link>
              </div>


              <div className="mb-3 space-y-1">
                <button
                  type="button"
                  onClick={togglePet}
                  className="flex items-center rounded-md px-2 py-2 transition-colors duration-200 hover:bg-[#EEEEE8] dark:hover:bg-[#171513]"
                  aria-label={petEnabled ? 'Hide roaming pet' : 'Show roaming pet'}
                  aria-pressed={petEnabled}
                >
                  <PawPrint className={`h-4 w-4 ${petEnabled ? 'text-green-500' : 'text-red-400'}`} />
                </button>
              </div>
            </nav>
          </div>
        </>,
        document.body
      )}

    </>
  )
}
