import { renderCode } from '@/lib/render'
import { DocRawContent } from './DocRawContent'

interface Variable {
  name: string
  default?: string
}

interface DocContentProps {
  content: string
  variables?: Variable[]
}

const FENCE_RE = /^```(\w+)?\n([\s\S]*?)```\s*$/

/** Exported so lib/render.ts and lib/prompt-preview.ts can reuse it */
export function detectLang(raw: string): { lang: string; code: string } {
  const trimmed = raw.trim()
  const match = trimmed.match(FENCE_RE)
  if (match) return { lang: match[1] ?? 'text', code: match[2] }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return { lang: 'json', code: raw }
  }

  // Pure YAML manifests
  if (
    trimmed.startsWith('---') ||
    /^name:\s+/m.test(trimmed) ||
    /^description:\s+/m.test(trimmed) ||
    /^system_prompt:\s+/m.test(trimmed)
  ) {
    return { lang: 'yaml', code: raw }
  }

  // Mixed text + JSON (story: ... instructions: { ... })
  if (/^(story|instructions):\s+/m.test(trimmed)) {
    return { lang: 'jsonc', code: raw }
  }

  return { lang: 'markdown', code: raw }
}

/** Kept for backward compat (prompt-preview.ts, byids cache, etc.) */
export async function renderDocHtml(content: string) {
  return renderCode(content)
}

export async function DocContent({ content, variables = [] }: DocContentProps) {
  const { html, lang, code } = await renderCode(content)
  return (
    <DocRawContent
      html={html}
      content={code}
      variables={variables}
      withLines={lang !== 'markdown'}
    />
  )
}
