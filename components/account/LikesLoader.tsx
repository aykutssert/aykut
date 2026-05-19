'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getLikedPetIds, getLikedDocIds } from '@/lib/likes'
import { AccountLikesClient } from './AccountLikesClient'
import type { LikedPet, LikedDoc } from '@/lib/account'

export function LikesLoader() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') === 'prompts' ? 'prompts' : 'pets'

  const [pets, setPets] = useState<LikedPet[]>([])
  const [prompts, setPrompts] = useState<LikedDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const petIds = getLikedPetIds()
      const docIds = getLikedDocIds()

      const [petsData, docsData] = await Promise.all([
        petIds.length
          ? fetch(`/api/pets/byids?ids=${petIds.join(',')}`).then((r) => r.json()).catch(() => [])
          : Promise.resolve([]),
        docIds.length
          ? fetch(`/api/docs/byids?ids=${docIds.join(',')}`).then((r) => r.json()).catch(() => [])
          : Promise.resolve([]),
      ])

      setPets(petsData.map((p: LikedPet) => ({ ...p, liked_at: new Date().toISOString() })))
      setPrompts(docsData)
      setLoading(false)
    }

    void load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl border border-border bg-muted/50" />
        ))}
      </div>
    )
  }

  return <AccountLikesClient initialPets={pets} initialPrompts={prompts} type={type} />
}
