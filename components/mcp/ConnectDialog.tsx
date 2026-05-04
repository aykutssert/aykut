'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, Copy, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

const MCP_URL = process.env.NEXT_PUBLIC_MCP_URL ?? 'https://kernel-mcp.up.railway.app/mcp'

type Client = 'claude' | 'cursor' | 'windsurf'

const CLIENTS: { id: Client; label: string }[] = [
  { id: 'claude', label: 'Claude Desktop' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'windsurf', label: 'Windsurf' },
]

function getConfig(client: Client): string {
  const base = { type: 'http', url: MCP_URL }
  if (client === 'claude' || client === 'windsurf') {
    return JSON.stringify({ mcpServers: { kernel: base } }, null, 2)
  }
  return JSON.stringify({ kernel: base }, null, 2)
}

function getInstructions(client: Client): string {
  if (client === 'claude') return 'Add to ~/Library/Application Support/Claude/claude_desktop_config.json and restart Claude.'
  if (client === 'cursor') return 'Go to Cursor Settings → MCP → Add Server and paste the config.'
  return 'Go to Windsurf Settings → MCP → Add Server and paste the config.'
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConnectDialog({ open, onOpenChange }: Props) {
  const [activeClient, setActiveClient] = useState<Client>('claude')
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const config = getConfig(activeClient)
  const instructions = getInstructions(activeClient)

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onOpenChange(false) }}
    >
      <div className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 text-background" />
            </div>
            <div>
              <p className="font-semibold text-sm">Connect to your AI assistant</p>
              <p className="text-xs text-muted-foreground mt-0.5">Search and read Kernel docs directly from Claude, Cursor, or Windsurf.</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground transition-colors ml-2 mt-0.5 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* What you get */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Search docs', desc: 'by keyword or topic' },
              { label: 'Read content', desc: 'full doc in context' },
              { label: 'Browse categories', desc: 'list all sections' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border p-3">
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Client tabs */}
          <div>
            <div className="flex border border-border rounded-lg overflow-hidden w-fit text-xs mb-3">
              {CLIENTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveClient(c.id)}
                  className={cn(
                    'px-3 py-1.5 transition-colors',
                    activeClient === c.id
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-2">{instructions}</p>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
                <span className="text-xs font-mono text-muted-foreground">config.json</span>
                <CopyButton text={config} />
              </div>
              <pre className="text-xs font-mono p-4 bg-[#F5F5F5] dark:bg-[#262626] overflow-x-auto leading-relaxed">
                {config}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
