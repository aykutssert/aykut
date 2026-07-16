import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export interface ProjectMeta {
  slug: string
  title: string
  titleTr?: string
  description: string
  descriptionTr?: string
  tech: string[]
  github: string | null
  image: string | null
  order: number
}

export interface Project extends ProjectMeta {
  content: string
}

const PROJECTS_DIR = join(process.cwd(), 'content', 'projects')

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

function loadProject(slug: string): Project {
  const raw = readFileSync(join(PROJECTS_DIR, `${slug}.md`), 'utf8')
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: (data.title as string) ?? slug,
    titleTr: data.titleTr as string | undefined,
    description: (data.description as string) ?? '',
    descriptionTr: data.descriptionTr as string | undefined,
    tech: Array.isArray(data.tech) ? (data.tech as string[]) : [],
    github: (data.github as string) || null,
    image: (data.image as string) || null,
    order: data.order ? Number(data.order) : 0,
    content: content.trim(),
  }
}

export function getProjects(): ProjectMeta[] {
  const slugs = readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))

  return slugs
    .map((slug): ProjectMeta => {
      const { content: _content, ...meta } = loadProject(slug)
      return meta
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

export function getProject(slug: string): Project | null {
  try {
    return loadProject(slug)
  } catch {
    return null
  }
}
