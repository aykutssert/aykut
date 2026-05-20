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

import { codeToHtml } from 'shiki'
import { normalizeContent } from '@/lib/utils'
import { detectLang } from '@/components/docs/DocContent'

export async function renderCode(content: string): Promise<{ html: string; lang: string; code: string }> {
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

export type RenderResult = { mode: 'code'; html: string; lang: string; code: string }

export async function renderContent(content: string): Promise<RenderResult> {
  const { html, lang, code } = await renderCode(content)
  return { mode: 'code', html, lang, code }
}
