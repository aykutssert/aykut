import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export interface BlogPostMeta {
  slug: string
  title: string
  titleTr?: string
  description: string
  date: string
  image: string | null
  tags: string[]
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

const BLOG_DIR = join(process.cwd(), 'content', 'blog')

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^"|"$/g, ''))
        .filter(Boolean)
      continue
    }
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    data[key] = value
  }
  return { data, content: raw.slice(match[0].length) }
}

function loadPost(slug: string): BlogPost {
  const raw = readFileSync(join(BLOG_DIR, `${slug}.md`), 'utf8')
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: (data.title as string) ?? slug,
    titleTr: data.titleTr as string | undefined,
    description: (data.description as string) ?? '',
    date: (data.date as string) ?? '',
    image: (data.image as string) || null,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    content: content.trim(),
  }
}

export function getBlogPosts(): BlogPostMeta[] {
  const slugs = readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))

  return slugs
    .map((slug): BlogPostMeta => {
      const { title, titleTr, description, date, image, tags } = loadPost(slug)
      return { slug, title, titleTr, description, date, image, tags }
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)))
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    return loadPost(slug)
  } catch {
    return null
  }
}
