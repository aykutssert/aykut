'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getLikedPetIds, togglePetLike } from '@/lib/likes'

type PetLikeStatus = {
  liked: boolean
  count: number
}

type PetLikeStatusContextValue = {
  getStatus: (petId: string) => PetLikeStatus | null
  setStatus: (petId: string, status: PetLikeStatus) => void
  toggle: (petId: string) => boolean
  ready: boolean
}

const PetLikeStatusContext = createContext<PetLikeStatusContextValue | null>(null)

export function PetLikeStatusProvider({
  petIds,
  children,
}: {
  petIds: string[]
  children: React.ReactNode
}) {
  const [statuses, setStatuses] = useState<Record<string, PetLikeStatus>>({})
  const [ready, setReady] = useState(false)

  const petKey = useMemo(() => [...petIds].sort().join(','), [petIds])

  useEffect(() => {
    const likedIds = getLikedPetIds()
    const initial: Record<string, PetLikeStatus> = {}
    for (const id of petIds) {
      initial[id] = { liked: likedIds.includes(id), count: 0 }
    }
    setStatuses(initial)
    setReady(true)
  }, [petKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const getStatus = useCallback((petId: string) => statuses[petId] ?? null, [statuses])

  const setStatus = useCallback((petId: string, status: PetLikeStatus) => {
    setStatuses((prev) => ({ ...prev, [petId]: status }))
  }, [])

  const toggle = useCallback((petId: string) => {
    const nowLiked = togglePetLike(petId)
    setStatuses((prev) => ({ ...prev, [petId]: { liked: nowLiked, count: 0 } }))
    return nowLiked
  }, [])

  const value = useMemo(
    () => ({ getStatus, setStatus, toggle, ready }),
    [getStatus, setStatus, toggle, ready]
  )

  return (
    <PetLikeStatusContext.Provider value={value}>
      {children}
    </PetLikeStatusContext.Provider>
  )
}

export function usePetLikeStatus() {
  return useContext(PetLikeStatusContext)
}

// Geriye dönük uyumluluk için
export function getPetLikeFingerprint() {
  return ''
}
