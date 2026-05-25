import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { PetEditForm } from '@/components/admin/PetEditForm'
import type { Pet } from '@/lib/pets'

interface Props {
  params: Promise<{ id: string }>
}

async function getPetById(id: string): Promise<Pet | null> {
  'use cache'
  cacheTag('pets', `pet-admin-${id}`)
  cacheLife('hours')

  const pb = await createAdminPB()
  try {
    const r = await pb.collection('pets').getOne(id)
    return {
      id: r.id,
      display_name: r.display_name,
      description: r.description ?? null,
      spritesheet_url: r.spritesheet_url ?? '',
      source_url: r.source_url ?? null,
      published: r.published ?? false,
      is_nsfw: r.is_nsfw ?? false,
      likes_count: 0,
      views_count: 0,
      created_at: r.created,
    }
  } catch {
    return null
  }
}

async function EditPetContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pet = await getPetById(id)
  if (!pet) notFound()

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
