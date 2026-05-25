'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

function parseHeadingsFromHtml(html: string): Heading[] {
  const headings: Heading[] = []
  const regex = /<h([2-4])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const id = match[2]
    // Strip inner HTML tags to get plain text
    const text = match[3].replace(/<[^>]+>/g, '').trim()
    headings.push({ id, text, level })
  }
  return headings
}

export function BlogToc({ html }: { html: string }) {
  const headings = parseHeadingsFromHtml(html)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="pt-4">
      <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-xs leading-relaxed transition-colors hover:text-foreground ${
                level === 3 ? 'pl-3' : level === 4 ? 'pl-6' : ''
              } ${
                activeId === id
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
