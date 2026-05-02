'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Eye } from 'lucide-react'
import { DeleteDocButton } from './DeleteDocButton'
import { ReorderPanel } from './ReorderPanel'
import { cn } from '@/lib/utils'
import type { Doc } from '@/types'

export function DocTable({ docs: initialDocs }: { docs: Doc[] }) {
  const router = useRouter()
  const [docs, setDocs] = useState(initialDocs)
  const categories = ['All', ...Array.from(new Set(docs.map((d) => d.category))).sort()]
  const [active, setActive] = useState('All')
  const [mode, setMode] = useState<'list' | 'reorder'>('list')

  async function handleTogglePublish(id: string, current: boolean) {
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, published: !current } : d))
    const res = await fetch('/api/docs/publish', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published: !current }),
    })
    if (!res.ok) {
      setDocs((prev) => prev.map((d) => d.id === id ? { ...d, published: current } : d))
    } else {
      router.refresh()
    }
  }

  const filtered = active === 'All' ? docs : docs.filter((d) => d.category === active)
  const reorderDocs = active !== 'All'
    ? docs.filter((d) => d.category === active).sort((a, b) => a.order_index - b.order_index)
    : []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActive(cat); setMode('list') }}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                active === cat
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {active !== 'All' && (
            <div className="flex border border-border rounded-lg overflow-hidden text-xs">
              {(['list', 'reorder'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'px-3 py-1 capitalize transition-colors',
                    mode === m ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {m === 'list' ? 'List' : 'Reorder'}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground shrink-0">{filtered.length} doc{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {mode === 'reorder' && active !== 'All' ? (
        <ReorderPanel docs={reorderDocs} category={active} />
      ) : filtered.length === 0 ? (
        <p className="text-center py-16 text-sm text-muted-foreground">No docs in this category.</p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc.id} className={i < filtered.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{doc.order_index}</td>
                  <td className="px-4 py-3 font-medium">{doc.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{doc.category}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{doc.slug}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(doc.id, doc.published)}
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70',
                        doc.published
                          ? 'bg-foreground text-background dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {doc.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/preview/${doc.id}`}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/edit/${doc.id}`}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteDocButton id={doc.id} title={doc.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
