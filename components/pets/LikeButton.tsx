'use client'

import { useEffect, useState, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPetLikeFingerprint, usePetLikeStatus } from '@/components/pets/PetLikeStatusProvider'

interface LikeButtonProps {
  petId: string
  initialCount?: number
  compact?: boolean
  showCount?: boolean
  onChange?: (liked: boolean, count: number) => void
}

export function LikeButton({ petId, initialCount = 0, compact = false, showCount = false, onChange }: LikeButtonProps) {
  const likeStatus = usePetLikeStatus()
  const status = likeStatus?.getStatus(petId)
  const [localLiked, setLocalLiked] = useState(false)
  const [localCount, setLocalCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [localReady, setLocalReady] = useState(false)
  const [animating, setAnimating] = useState(false)
  const liked = status?.liked ?? localLiked
  const count = status?.count ?? localCount
  const ready = likeStatus ? likeStatus.ready : localReady

  useEffect(() => {
    if (likeStatus) return

    const fp = getPetLikeFingerprint()
    fetch(`/api/pets/like?id=${petId}&fp=${fp}`)
      .then((r) => r.json())
      .then(({ liked, count }) => {
        setLocalLiked(liked)
        setLocalCount(count)
        setLocalReady(true)
      })
      .catch(() => setLocalReady(true))
  }, [petId, likeStatus])

  const toggle = useCallback(async () => {
    if (loading) return
    setLoading(true)
    const fp = getPetLikeFingerprint()
    try {
      const res = await fetch('/api/pets/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: petId, fingerprint: fp }),
      })
      if (res.ok) {
        const data = await res.json()
        setLocalLiked(data.liked)
        setLocalCount(data.count)
        likeStatus?.setStatus(petId, { liked: data.liked, count: data.count })
        onChange?.(data.liked, data.count)
        if (data.liked) {
          setAnimating(true)
          setTimeout(() => setAnimating(false), 400)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [petId, loading, onChange, likeStatus])

  return (
    <button
      onClick={toggle}
      disabled={!ready || loading}
      aria-label={liked ? 'Unlike' : 'Like'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border transition-colors',
        compact ? 'px-2.5 py-1.5' : 'px-3 py-2',
        liked
          ? 'border-rose-500/60 text-rose-500 bg-rose-500/10 hover:bg-rose-500/15'
          : 'border-foreground/15 text-muted-foreground hover:text-foreground hover:border-foreground/40',
        (!ready || loading) && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Heart className={cn(
        compact ? 'w-3.5 h-3.5' : 'w-4 h-4',
        liked && 'fill-rose-500',
        animating && 'animate-heart-pop'
      )} />
      {showCount && count > 0 && (
        <span className="text-sm tabular-nums">{count.toLocaleString()}</span>
      )}
    </button>
  )
}
