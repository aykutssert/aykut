'use client'

import { useEffect, useState, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isDocLiked, toggleDocLike } from '@/lib/likes'

type PromptLikeButtonProps = {
  docId: string
  initialCount?: number | null  // artık kullanılmıyor
  initialLiked?: boolean        // artık kullanılmıyor
  showCount?: boolean           // artık kullanılmıyor
  compact?: boolean
  onChange?: (liked: boolean) => void
}

export function PromptLikeButton({ docId, compact = false, onChange }: PromptLikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [ready, setReady] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setLiked(isDocLiked(docId))
    setReady(true)
  }, [docId])

  const toggle = useCallback(() => {
    const nowLiked = toggleDocLike(docId)
    setLiked(nowLiked)
    onChange?.(nowLiked)
    if (nowLiked) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 400)
    }
  }, [docId, onChange])

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      aria-label={liked ? 'Unlike prompt' : 'Like prompt'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border transition-colors',
        compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        liked
          ? 'border-rose-500/60 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15'
          : 'border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground',
        !ready && 'cursor-not-allowed opacity-50'
      )}
    >
      <Heart className={cn(
        'h-3.5 w-3.5',
        liked && 'fill-rose-500',
        animating && 'animate-heart-pop'
      )} />
    </button>
  )
}
