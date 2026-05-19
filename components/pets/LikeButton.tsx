'use client'

import { useEffect, useState, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPetLiked, togglePetLike } from '@/lib/likes'
import { usePetLikeStatus } from '@/components/pets/PetLikeStatusProvider'

interface LikeButtonProps {
  petId: string
  initialCount?: number  // artık kullanılmıyor
  compact?: boolean
  showCount?: boolean    // artık kullanılmıyor
  onChange?: (liked: boolean) => void
}

export function LikeButton({ petId, compact = false, showCount = false, onChange }: LikeButtonProps) {
  const ctx = usePetLikeStatus()
  const [localLiked, setLocalLiked] = useState(false)
  const [ready, setReady] = useState(false)
  const [animating, setAnimating] = useState(false)

  // Context varsa ondan al, yoksa localStorage'dan direkt oku
  const liked = ctx ? (ctx.getStatus(petId)?.liked ?? false) : localLiked
  const isReady = ctx ? ctx.ready : ready

  useEffect(() => {
    if (ctx) return
    setLocalLiked(isPetLiked(petId))
    setReady(true)
  }, [petId, ctx])

  const toggle = useCallback(() => {
    let nowLiked: boolean
    if (ctx) {
      nowLiked = ctx.toggle(petId)
    } else {
      nowLiked = togglePetLike(petId)
      setLocalLiked(nowLiked)
    }
    onChange?.(nowLiked)
    if (nowLiked) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 400)
    }
  }, [petId, ctx, onChange])

  return (
    <button
      onClick={toggle}
      disabled={!isReady}
      aria-label={liked ? 'Unlike' : 'Like'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border transition-colors',
        compact ? 'px-2.5 py-1.5' : 'px-4 py-2.5',
        liked
          ? 'border-rose-500/60 text-rose-500 bg-rose-500/10 hover:bg-rose-500/15'
          : 'border-foreground/15 text-muted-foreground hover:text-foreground hover:border-foreground/40',
        !isReady && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Heart className={cn(
        compact ? 'w-3.5 h-3.5' : 'w-4 h-4',
        liked && 'fill-rose-500',
        animating && 'animate-heart-pop'
      )} />
    </button>
  )
}
