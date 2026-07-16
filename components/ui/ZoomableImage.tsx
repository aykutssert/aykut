'use client'

import { useEffect, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

// Theme-aware framed image with click-to-zoom lightbox.
// Border: subtle black in light mode, white in dark mode, so the image edges
// stay visible regardless of the image's own background.
export function ZoomableImage({ src, alt, className, priority = false }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'group relative block w-full overflow-hidden rounded-xl border border-black/15 bg-background dark:border-white/20',
          className
        )}
        aria-label={`${alt} - zoom`}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className="w-full"
        />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 bg-background/70 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 dark:border-white/20">
          <ZoomIn className="h-4 w-4 text-foreground" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white transition-colors hover:bg-black/60"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[92vh] max-w-[95vw] rounded-lg border border-white/20 object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
