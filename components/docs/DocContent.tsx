import { codeToHtml } from 'shiki'
import { normalizeContent } from '@/lib/utils'
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

export function detectLang(raw: string): { lang: string; code: string } {
  const trimmed = raw.trim()
  const match = trimmed.match(FENCE_RE)
  if (match) return { lang: match[1] ?? 'text', code: match[2] }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return { lang: 'json', code: raw }
  }
  
  // Pure YAML manifests
  if (trimmed.startsWith('---') || /^name:\s+/m.test(trimmed) || /^description:\s+/m.test(trimmed) || /^system_prompt:\s+/m.test(trimmed)) {
    return { lang: 'yaml', code: raw }
  }

  // For mixed text and JSON (like story: ... instructions: { ... })
  // jsonc handles unquoted top-level keys and nested JSON blocks gracefully
  // without turning the entire block into a single green string like YAML does.
  if (/^(story|instructions):\s+/m.test(trimmed)) {
    return { lang: 'jsonc', code: raw }
  }

  return { lang: 'markdown', code: raw }
}

export async function renderDocHtml(content: string) {
  const normalized = normalizeContent(content)
  const { lang, code } = detectLang(normalized)

  let html = await codeToHtml(code, {
    lang,
    themes: { dark: 'one-dark-pro', light: 'one-light' },
    defaultColor: false,
  })

  html = html
    .replace(/#abb2bf/gi, 'hsl(var(--foreground))')
    .replace(/#383a42/gi, 'hsl(var(--foreground))')

  return { html, lang, code }
}

export async function DocContent({ content, variables = [] }: DocContentProps) {
  const { html, lang, code } = await renderDocHtml(content)
  return <DocRawContent html={html} content={code} variables={variables} withLines={lang !== 'markdown'} />
}
