import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createAdminPB } from '@/lib/pocketbase'
import { PetEditForm } from '@/components/admin/PetEditForm'
import type { Pet } from '@/lib/pets'

interface Props {
  params: Promise<{ id: string }>
}

async function EditPetContent({ params }: { params: Promise<{ id: string }> }) {
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
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit pet</h1>
      <PetEditForm pet={pet} />
    </div>
  )
}

export default function EditPetPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />}>
      <EditPetContent params={params} />
    </Suspense>
  )
}
