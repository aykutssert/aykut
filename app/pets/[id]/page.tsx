import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createPB } from '@/lib/pocketbase'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PetDetailSection } from '@/components/pets/PetDetailSection'
import { getDocs } from '@/lib/docs'
import { Download, ExternalLink } from 'lucide-react'
import { LikeButton } from '@/components/pets/LikeButton'
import { ShareButton } from '@/components/pets/ShareModal'
import { CurlCommand } from '@/components/pets/CurlCommand'
import { BackButton } from '@/components/pets/BackButton'
import type { Pet } from '@/lib/pets'

interface Props {
  params: Promise<{ id: string }>
}

async function getPet(id: string): Promise<Pet | null> {
  try {
    const pb = createPB()
    const record = await pb.collection('pets').getFirstListItem(
      `id = "${id}" && published = true && is_nsfw = false`
    )
    return {
      id: record.id,
      display_name: record.display_name as string,
      description: (record.description as string) || null,
      spritesheet_url: record.spritesheet_url as string,
      source_url: (record.source_url as string) || null,
      published: record.published as boolean,
      is_nsfw: record.is_nsfw as boolean,
      likes_count: 0,
      views_count: 0,
      created_at: record.created,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const pet = await getPet(id)
  if (!pet) return {}
  return {
    title: pet.display_name,
    description: pet.description ?? undefined,
    openGraph: {
      title: pet.display_name,
      description: pet.description ?? undefined,
      images: pet.spritesheet_url ? [{ url: pet.spritesheet_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pet.display_name,
      description: pet.description ?? undefined,
      images: pet.spritesheet_url ? [pet.spritesheet_url] : [],
    },
  }
}

async function PetPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [pet, docs] = await Promise.all([getPet(id), getDocs()])
  if (!pet) notFound()

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar docs={docs} />

        <main className="flex-1 max-w-[900px] mx-auto w-full px-4 md:px-0 py-12">
          <BackButton />
          <PetDetailSection spritesheetUrl={pet.spritesheet_url} size={256}>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">Codex Pet</p>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{pet.display_name}</h1>
            {pet.description && (
              <p className="text-muted-foreground mb-8 leading-relaxed">{pet.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`/api/pets/download?id=${pet.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                Download .codex-pet
              </a>
              <LikeButton petId={pet.id} initialCount={0} showCount />
              <ShareButton petId={pet.id} petName={pet.display_name} description={pet.description} spritesheetUrl={pet.spritesheet_url} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Download the package, then unzip it into{' '}
              <code className="text-xs">{`$HOME/.codex/pets/${pet.id}`}</code>
            </p>
            {pet.source_url && (
              <a
                href={pet.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Source
              </a>
            )}
            <p className="text-xs text-muted-foreground mt-8">
              Alternatively, copy and paste this command into your terminal.
            </p>
            <CurlCommand petId={pet.id} />
          </PetDetailSection>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default function PetPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PetPageContent params={params} />
    </Suspense>
  )
}
