'use client'

import { useEffect, useState } from 'react'
import { diffWordsWithSpace } from 'diff'
import { X, ChevronDown, ChevronUp, GitCompare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Version {
  id: string
  version_number: number
  content: string
  change_summary: string | null
  author_handle: string | null
  created_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function approxTokens(text: string) {
  return Math.round(text.length / 4)
}

function DiffModal({ version, currentContent, onClose }: {
  version: Version
  currentContent: string
  onClose: () => void
}) {
  const changes = diffWordsWithSpace(version.content, currentContent)

  let addedTokens = 0
  let removedTokens = 0
  changes.forEach((part) => {
    if (part.added) addedTokens += approxTokens(part.value)
    if (part.removed) removedTokens += approxTokens(part.value)
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[85vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <GitCompare className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">v{version.version_number} &rarr; Current Version</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="p-4 bg-muted/30 border-b border-border text-xs text-muted-foreground italic">
          Changes between v{version.version_number} and current version
        </div>

        {/* Token delta */}
        <div className="flex items-center gap-5 px-6 pt-4 text-[13px] font-mono select-none">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="text-base leading-none">≈</span>
            +{addedTokens} tokens
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <span className="text-base leading-none">≈</span>
            -{removedTokens} tokens
          </span>
        </div>

        {/* Diff body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap p-5 rounded-md bg-[#F5F5F5] dark:bg-[#262626] border border-border">
            {changes.map((part, i) => (
              <span
                key={i}
                className={cn(
                  part.added
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : part.removed
                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 line-through'
                    : ''
                )}
              >
                {part.value}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function DocVersionDiff({ docId, currentContent }: { docId: string; currentContent: string }) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [comparingVersion, setComparingVersion] = useState<Version | null>(null)

  useEffect(() => {
    if (!open || versions.length > 0) return
    setLoading(true)
    fetch(`/api/docs/versions?docId=${docId}`)
      .then((r) => r.json())
      .then((data) => { setVersions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [open, docId, versions.length])

  return (
    <>
      <div className="pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <GitCompare className="w-4 h-4" />
          Version history
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {open && (
          <div className="mt-3 space-y-1.5">
            {loading && <p className="text-xs text-muted-foreground">Loading versions...</p>}
            {!loading && versions.length === 0 && (
              <p className="text-xs text-muted-foreground">No versions saved yet.</p>
            )}
            {!loading && versions.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono font-semibold text-foreground shrink-0">v{v.version_number}</span>
                  {i === 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">latest</span>
                  )}
                  {v.change_summary && (
                    <span className="text-xs text-muted-foreground truncate">{v.change_summary}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-muted-foreground">{formatDate(v.created_at)}</span>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setComparingVersion(v)}
                      className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Compare with current"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {comparingVersion && (
        <DiffModal
          version={comparingVersion}
          currentContent={currentContent}
          onClose={() => setComparingVersion(null)}
        />
      )}
    </>
  )
}
