import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProject, getProjects } from '@/lib/projects'
import { renderMarkdownHtml } from '@/lib/render-markdown'
import { ProjectDetailClient } from '@/components/projects/ProjectDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
    twitter: {
      card: project.image ? 'summary_large_image' : 'summary',
      title: project.title,
      description: project.description,
      ...(project.image ? { images: [project.image] } : {}),
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const html = project.content ? await renderMarkdownHtml(project.content) : ''

  return <ProjectDetailClient project={project} html={html} />
}
