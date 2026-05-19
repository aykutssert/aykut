import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createAdminPB } from '@/lib/pocketbase'
import { PetViewer } from '@/components/pets/PetViewer'
import type { Pet } from '@/lib/pets'

interface Props {
  params: Promise<{ id: string }>
}

async function PreviewPetContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pb = await createAdminPB()
  let record
  try {
    record = await pb.collection('pets').getOne(id)
  } catch {
    notFound()
  }

  const pet: Pet = {
    id: record.id,
    display_name: record.display_name,
    description: record.description ?? null,
    spritesheet_url: record.spritesheet_url ?? '',
    source_url: record.source_url ?? null,
    published: record.published ?? false,
    is_nsfw: record.is_nsfw ?? false,
    created_at: record.created,
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-mono px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          Draft preview
        </span>
      </div>
      <h1 className="text-2xl font-bold mb-2">{pet.display_name}</h1>
      {pet.description && <p className="text-muted-foreground mb-8">{pet.description}</p>}
      <PetViewer spritesheetUrl={pet.spritesheet_url} size={256} />
    </div>
  )
}

export default function PreviewPetPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-8 w-48 bg-muted animate-pulse rounded-lg m-8" />}>
      <PreviewPetContent params={params} />
    </Suspense>
  )
}
