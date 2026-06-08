/**
 * Unified rendering pipeline — always CODE mode.
 *
 * This is a prompt library. Every piece of content — YAML, JSON, Python,
 * plain text, markdown prompts — should look like a code editor: dark
 * background, Shiki syntax highlighting, monospace font.
 *
 * Shiki's "markdown" language already handles headings (##), lists (-),
 * bold (**) etc. with appropriate colours, so prose-style prompts look
 * great without a separate markdown→HTML pipeline.
 */

import { getSingletonHighlighter } from 'shiki'
import { normalizeContent } from '@/lib/utils'
import { detectLang } from '@/components/docs/DocContent'

const THEMES = ['one-dark-pro', 'one-light'] as const
const LANGS = [
  'markdown', 'json', 'jsonc', 'yaml', 'python', 'javascript', 'typescript',
  'tsx', 'jsx', 'bash', 'sh', 'text', 'plaintext',
] as const

export async function getHighlighter() {
  return getSingletonHighlighter({ themes: THEMES, langs: LANGS })
}

export async function renderCode(content: string): Promise<{ html: string; lang: string; code: string }> {
  const normalized = normalizeContent(content)
  const { lang, code } = detectLang(normalized)

  const highlighter = await getHighlighter()
  const safeLoad = highlighter.getLoadedLanguages().includes(lang as never)
    ? lang
    : 'text'

  let html = highlighter.codeToHtml(code, {
    lang: safeLoad,
    themes: { dark: 'one-dark-pro', light: 'one-light' },
    defaultColor: false,
  })

  html = html
    .replace(/#abb2bf/gi, 'hsl(var(--foreground))')
    .replace(/#383a42/gi, 'hsl(var(--foreground))')

  return { html, lang, code }
}

export type RenderResult = { mode: 'code'; html: string; lang: string; code: string }

export async function renderContent(content: string): Promise<RenderResult> {
  const { html, lang, code } = await renderCode(content)
  return { mode: 'code', html, lang, code }
}
