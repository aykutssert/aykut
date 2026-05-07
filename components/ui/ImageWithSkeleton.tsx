'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  /**
   * Set to true when the wrapper has a fixed/known size (e.g. h-12 w-12 thumbnails).
   * Skeleton is rendered as absolute inset-0 so it fills the container without affecting layout.
   * Set to false (default) for variable-height images (masonry). Skeleton rendered as a
   * placeholder block that is removed once the image loads.
   */
  fixedContainer?: boolean
  /** Only used when fixedContainer=false. CSS aspect-ratio string e.g. "3/4". Defaults to "3/4". */
  skeletonAspect?: string
}

export function ImageWithSkeleton({
  src,
  alt,
  className,
  wrapperClassName,
  loading = 'lazy',
  decoding = 'async',
  fixedContainer = false,
  skeletonAspect = '3/4',
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false)

  if (fixedContainer) {
    return (
      <div className={cn('relative', wrapperClassName)}>
        {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          className={cn(
            'relative block h-full w-full object-cover',
            !loaded && 'opacity-0',
            loaded && 'opacity-100 transition-opacity duration-300',
            className,
          )}
        />
      </div>
    )
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      {!loaded && (
        <div
          className="w-full animate-pulse bg-muted"
          style={{ aspectRatio: skeletonAspect }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setLoaded(true)}
        className={cn(
          'block w-full',
          !loaded && 'absolute inset-0 h-full opacity-0',
          loaded && 'opacity-100 transition-opacity duration-300',
          className,
        )}
      />
    </div>
  )
}
