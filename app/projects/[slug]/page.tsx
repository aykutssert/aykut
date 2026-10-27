import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProject, getProjects } from '@/lib/projects'
import { renderMarkdownHtml } from '@/lib/render-markdown'
import { ProjectDetailClient } from '@/components/projects/ProjectDetailClient'
import { defaultOgImage, siteName } from '@/lib/site'

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
  const url = `/projects/${project.slug}`
  const images = project.image ? [{ url: project.image, alt: project.title }] : [defaultOgImage]
  return {
    title: project.title,
    description: project.description,
    keywords: project.tech,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName,
      title: project.title,
      description: project.description,
      url,
      images,
    },
    twitter: {
      card: project.image ? 'summary_large_image' : 'summary',
      title: project.title,
      description: project.description,
      images: images.map((image) => image.url),
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
