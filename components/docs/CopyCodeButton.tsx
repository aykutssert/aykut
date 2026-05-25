'use client'

import { useEffect } from 'react'

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`

function attachCopyBtn(container: HTMLElement, pre: HTMLElement) {
  if (container.querySelector('[data-copy-btn]')) return

  container.style.position = 'relative'

  const btn = document.createElement('button')
  btn.setAttribute('data-copy-btn', '')
  btn.style.cssText =
    'position:absolute;top:8px;right:8px;z-index:10;padding:6px;border-radius:6px;opacity:0;transition:opacity 0.15s ease;background:var(--muted,rgba(0,0,0,0.08));color:var(--muted-foreground,#888);cursor:pointer;'
  btn.innerHTML = COPY_ICON

  btn.addEventListener('click', async () => {
    const code = pre.querySelector('code') ?? pre
    const text = code.innerText ?? ''
    await navigator.clipboard.writeText(text)
    btn.innerHTML = CHECK_ICON
    setTimeout(() => { btn.innerHTML = COPY_ICON }, 1500)
  })

  container.appendChild(btn)
  container.addEventListener('mouseenter', () => { btn.style.opacity = '1' })
  container.addEventListener('mouseleave', () => { btn.style.opacity = '0' })
}

export function CopyCodeButton() {
  useEffect(() => {
    // Language-specified blocks: rehype-pretty-code wraps in <figure>
    document.querySelectorAll<HTMLElement>('[data-rehype-pretty-code-figure]').forEach((figure) => {
      const pre = figure.querySelector('pre')
      if (pre) attachCopyBtn(figure, pre)
    })

    // No-language blocks: plain <pre> NOT inside a figure
    document.querySelectorAll<HTMLElement>('.prose pre').forEach((pre) => {
      if (pre.closest('[data-rehype-pretty-code-figure]')) return
      attachCopyBtn(pre, pre)
    })
  }, [])

  return null
}
