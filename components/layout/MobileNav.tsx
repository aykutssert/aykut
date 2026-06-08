'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Menu, PawPrint, Sparkles, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'
import { ROAMING_PET_STORAGE_KEY, ROAMING_PET_EVENT } from '@/components/pets/RoamingPetToggle'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import type { DocMeta } from '@/types'

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


export function MobileNav({ docs }: { docs: DocMeta[] }) {
  const [open, setOpen] = useState(false)

  const pathname = usePathname()
  const petEnabled = useSyncExternalStore(subscribePet, readPetEnabled, () => true)
  const t = useTranslations('nav')
  const tMoreMenu = useTranslations('more_menu')

  function togglePet() {
    const next = !readPetEnabled()
    window.localStorage.setItem(ROAMING_PET_STORAGE_KEY, String(next))
    window.dispatchEvent(new Event(ROAMING_PET_EVENT))
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(false), 0)
    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const grouped = docs.reduce<Record<string, DocMeta[]>>((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category].push(doc)
    return acc
  }, {})

  const activeCategory = pathname.startsWith('/docs/')
    ? pathname.split('/')[2]
    : null

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
                <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-wide text-muted-foreground/70">
                  {t('navigate')}
                </p>
                <Link
                  href="/#projects"
                  className={cn('flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]')}
                >
                  <Sparkles className="h-4 w-4" />
                  {t('projects')}
                </Link>
                <Link
                  href="/#about"
                  className={cn('flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]')}
                >
                  <User className="h-4 w-4" />
                  {t('about')}
                </Link>
                <Link
                  href="/#contact"
                  className={cn('flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]')}
                >
                  <FileText className="h-4 w-4" />
                  {t('contact')}
                </Link>
              </div>

              <div className="mb-3 space-y-1 border-b border-border pb-3">
                <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-wide text-muted-foreground/70">
                  {t('developers')}
                </p>
                <Link
                  href="/prompts"
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith('/prompts')
                      ? 'bg-[#E5E5DF] text-foreground dark:bg-[#1E1917]'
                      : 'text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]'
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  {t('prompts')}
                </Link>
                <Link
                  href="/docs"
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith('/docs')
                      ? 'bg-[#E5E5DF] text-foreground dark:bg-[#1E1917]'
                      : 'text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]'
                  )}
                >
                  <FileText className="h-4 w-4" />
                  {t('blog')}
                </Link>
              </div>


              <div className="mb-3 space-y-1 border-b border-border pb-3">
                <Link
                  href="/pets"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]"
                >
                  <PawPrint className="h-4 w-4 text-pink-500" />
                  {t('pets')}
                </Link>
                <button
                  type="button"
                  onClick={togglePet}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]"
                >
                  <span className="flex items-center gap-2">
                    <PawPrint className={`h-4 w-4 ${petEnabled ? 'text-green-500' : 'text-red-400'}`} />
                    {tMoreMenu('label_pet')}
                  </span>
                  <span className={`text-xs font-medium ${petEnabled ? 'text-green-500' : 'text-red-400'}`}>
                    {petEnabled ? tMoreMenu('on') : tMoreMenu('off')}
                  </span>
                </button>
              </div>

              {/* Doc categories */}
              {Object.keys(grouped).length > 0 && (
                <div className="space-y-0.5">
                  <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-wide text-muted-foreground/70">
                    {t('categories')}
                  </p>
                  {Object.entries(grouped).map(([category, pages]) => {
                    const isActive = activeCategory === category
                    return (
                      <Link
                        key={category}
                        href={`/prompts?category=${encodeURIComponent(category)}`}
                        className={cn(
                          'flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-[#E5E5DF] text-foreground dark:bg-[#1E1917]'
                            : 'text-muted-foreground hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]'
                        )}
                      >
                        <span className="capitalize">{category}</span>
                        <span className="text-xs text-muted-foreground">{pages.length}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </nav>
          </div>
        </>,
        document.body
      )}

    </>
  )
}
