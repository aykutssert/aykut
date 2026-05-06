'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type PetLikeStatus = {
  liked: boolean
  count: number
}

type PetLikeStatusContextValue = {
  getStatus: (petId: string) => PetLikeStatus | null
  setStatus: (petId: string, status: PetLikeStatus) => void
  ready: boolean
}

const PetLikeStatusContext = createContext<PetLikeStatusContextValue | null>(null)

function getFingerprint(): string {
  const key = 'codex_fp'
  let fp = localStorage.getItem(key)
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem(key, fp)
  }
  return fp
}

export function PetLikeStatusProvider({
  petIds,
  children,
}: {
  petIds: string[]
  children: React.ReactNode
}) {
  const [statuses, setStatuses] = useState<Record<string, PetLikeStatus>>({})
  const [ready, setReady] = useState(false)
  const idsKey = petIds.join(',')

  useEffect(() => {
    let active = true

    async function loadStatuses() {
      if (!petIds.length) {
        setReady(true)
        return
      }

      const params = new URLSearchParams()
      params.set('ids', idsKey)
      params.set('fp', getFingerprint())

      const res = await fetch(`/api/pets/likes?${params}`)
      if (!res.ok) {
        if (active) setReady(true)
        return
      }

      const data = await res.json().catch(() => null) as {
        items?: Record<string, PetLikeStatus>
      } | null

      if (active) {
        setStatuses(data?.items ?? {})
        setReady(true)
      }
    }

    void loadStatuses()

    return () => {
      active = false
    }
  }, [idsKey, petIds.length])

  const getStatus = useCallback((petId: string) => statuses[petId] ?? null, [statuses])
  const setStatus = useCallback((petId: string, status: PetLikeStatus) => {
    setStatuses((current) => ({ ...current, [petId]: status }))
  }, [])

  const value = useMemo(
    () => ({ getStatus, setStatus, ready }),
    [getStatus, setStatus, ready]
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

export function getPetLikeFingerprint() {
  return getFingerprint()
}
