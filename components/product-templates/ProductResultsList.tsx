'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Clock3, ImageIcon, Loader2, PackagePlus, Trash2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { PRODUCT_IMAGE_SIZE_MAP } from '@/lib/product-image-sizes'
import { PRODUCT_TEMPLATE_CATEGORY_LABELS } from '@/lib/product-template-categories'
import type { ProductResult } from '@/types'

function statusTone(status: ProductResult['status']) {
  if (status === 'completed') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  if (status === 'failed') return 'bg-red-500/10 text-red-600 dark:text-red-400'
  return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
}

function StatusIcon({ status }: { status: ProductResult['status'] }) {
  if (status === 'failed') return <XCircle className="h-3.5 w-3.5" />
  if (status === 'completed') return <ImageIcon className="h-3.5 w-3.5" />
  return <Clock3 className="h-3.5 w-3.5" />
}

export function ProductResultsList({
  results,
  signedIn,
}: {
  results: ProductResult[]
  signedIn: boolean
}) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(result: ProductResult) {
    setDeletingId(result.id)

    const response = await fetch('/api/product-results/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: result.id }),
    })
    const payload = await response.json().catch(() => null) as { error?: string } | null
    setDeletingId(null)

    if (!response.ok) {
      toast.error(payload?.error ?? 'Delete failed')
      return
    }

    toast.success(result.status === 'pending' ? 'Draft cancelled.' : 'Result deleted.')
    router.refresh()
  }

  if (!signedIn) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-md border border-dashed border-border text-center">
        <PackagePlus className="mb-4 h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium">Sign in to view results.</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Prepared product photo jobs will stay tied to your account.
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-md border border-dashed border-border text-center">
        <ImageIcon className="mb-4 h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium">No results yet.</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Prepare a product with a template to collect drafts here.
        </p>
        <Link
          href="/product-studio/templates"
          className="mt-5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Browse templates
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {results.map((result) => (
        <article key={result.id} className="overflow-hidden rounded-md border border-border bg-background">
          <div className="grid grid-cols-2 border-b border-border">
            <div className="border-r border-border p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Template</p>
              {result.template ? (
                <>
                  <img
                    src={result.template.image_url}
                    alt={result.template.name}
                    className="aspect-[4/3] w-full rounded-sm bg-muted object-cover"
                  />
                  <p className="mt-2 truncate text-xs font-medium">{result.template.name}</p>
                </>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-muted text-xs text-muted-foreground">
                  Deleted
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Product</p>
              {result.product ? (
                <>
                  <img
                    src={result.product.image_url}
                    alt={result.product.name}
                    className="aspect-[4/3] w-full rounded-sm bg-muted object-contain"
                  />
                  <p className="mt-2 truncate text-xs font-medium">{result.product.name}</p>
                </>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-muted text-xs text-muted-foreground">
                  Deleted
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-xs font-medium ${statusTone(result.status)}`}>
                <StatusIcon status={result.status} />
                {result.status}
              </span>
              <span className="text-xs text-muted-foreground">
                {PRODUCT_IMAGE_SIZE_MAP[result.image_size as keyof typeof PRODUCT_IMAGE_SIZE_MAP] ?? result.image_size}
              </span>
            </div>

            {result.template && (
              <p className="text-xs text-muted-foreground">
                {PRODUCT_TEMPLATE_CATEGORY_LABELS[result.template.category]}
              </p>
            )}

            <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
              {result.final_prompt}
            </p>

            <div className="flex justify-end border-t border-border pt-3">
              <ConfirmDialog
                title={result.status === 'pending' ? 'Cancel draft' : 'Delete result'}
                description={
                  result.status === 'pending'
                    ? 'This pending product photo draft will be permanently deleted.'
                    : 'This product photo result will be permanently deleted.'
                }
                onConfirm={() => handleDelete(result)}
                confirmLabel={result.status === 'pending' ? 'Cancel draft' : 'Delete'}
                variant={result.status === 'pending' ? 'warning' : 'danger'}
              >
                <button
                  type="button"
                  disabled={deletingId === result.id}
                  className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-red-500 disabled:opacity-50"
                >
                  {deletingId === result.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  {result.status === 'pending' ? 'Cancel' : 'Delete'}
                </button>
              </ConfirmDialog>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
