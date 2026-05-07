'use client'

import { Plus } from 'lucide-react'

export function AddProductButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('kernel-add-product-open'))}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-80"
    >
      <Plus className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Add product</span>
    </button>
  )
}
