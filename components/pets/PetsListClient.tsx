'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { Heart, SearchX, PawPrint, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { PetListCard } from './PetListCard'
import { PetsSearchBar } from './PetsSearchBar'
import { PetsSortTabs } from './PetsSortTabs'
import { PetsPageScroller } from './PetsPageScroller'
import { PetLikeStatusProvider } from './PetLikeStatusProvider'
import { RoamingPetToggle } from './RoamingPetToggle'
import type { Pet } from '@/lib/pets'

type Props = {
  pets: Pet[]
  total: number
  totalLikes: number
  totalPages: number
  page: number
  q: string
  sortVal: 'newest' | 'liked' | 'viewed'
  showNsfw: boolean
}

export function PetsListClient({ pets, total, totalLikes, totalPages, page, q, sortVal, showNsfw }: Props) {
  const t = useTranslations('pets_page')

  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (sortVal !== 'newest') params.set('sort', sortVal)
    params.set('page', String(p))
    return `/pets?${params.toString()}`
  }

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Codex Pets</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-1">
          {total > 0 && (
            <>
              {totalLikes > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-rose-500">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  {totalLikes.toLocaleString()}
                </span>
              )}
              <p className="text-xs text-muted-foreground">
                {t('pet_count', { count: total })}{totalPages > 1 ? ` · ${t('page_of', { page, total: totalPages })}` : ''}
              </p>
            </>
          )}
          <RoamingPetToggle />
        </div>
      </div>

      <Suspense>
        <PetsPageScroller />
      </Suspense>
      <div className="flex flex-col gap-3 mb-8">
        <Suspense>
          <PetsSearchBar defaultValue={q} />
        </Suspense>
        <Suspense>
          <PetsSortTabs defaultSort={sortVal} showNsfw={showNsfw} />
        </Suspense>
      </div>

      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {q ? (
            <>
              <SearchX className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <p className="text-sm font-medium mb-1">{t('no_pets_found', { q })}</p>
              <p className="text-xs text-muted-foreground mb-6">{t('try_different')}</p>
              <Link
                href={(() => {
                  const p = new URLSearchParams()
                  if (sortVal !== 'newest') p.set('sort', sortVal)
                  if (showNsfw) p.set('nsfw', '1')
                  const s = p.toString()
                  return s ? `/pets?${s}` : '/pets'
                })()}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {t('clear_search')}
              </Link>
            </>
          ) : (
            <>
              <PawPrint className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">{t('no_pets_yet')}</p>
            </>
          )}
        </div>
      ) : (
        <>
          <PetLikeStatusProvider petIds={pets.map((pet) => pet.id)}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pets.map((pet) => (
                <PetListCard key={pet.id} pet={pet} />
              ))}
            </div>
          </PetLikeStatusProvider>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Link
                href={pageHref(page - 1)}
                className={cn(
                  'p-2 rounded-lg border border-border transition-colors',
                  hasPrev ? 'hover:bg-muted text-foreground' : 'pointer-events-none opacity-30'
                )}
                aria-disabled={!hasPrev}
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>

              {(() => {
                const items: (number | 'ellipsis')[] = []
                const delta = 2
                const range = new Set([
                  1,
                  totalPages,
                  ...Array.from({ length: delta * 2 + 1 }, (_, i) => page - delta + i).filter(
                    (p) => p >= 1 && p <= totalPages
                  ),
                ])
                let prev: number | null = null
                for (const p of [...range].sort((a, b) => a - b)) {
                  if (prev !== null && p - prev > 1) items.push('ellipsis')
                  items.push(p)
                  prev = p
                }
                return items.map((item, i) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground text-sm">…</span>
                  ) : (
                    <Link
                      key={item}
                      href={pageHref(item)}
                      className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors',
                        item === page
                          ? 'bg-foreground text-background font-medium'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {item}
                    </Link>
                  )
                )
              })()}

              <Link
                href={pageHref(page + 1)}
                className={cn(
                  'p-2 rounded-lg border border-border transition-colors',
                  hasNext ? 'hover:bg-muted text-foreground' : 'pointer-events-none opacity-30'
                )}
                aria-disabled={!hasNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </>
  )
}
