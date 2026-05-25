import { Suspense } from 'react'
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { PetAdminTable } from '@/components/admin/PetAdminTable'
import type { Pet } from '@/lib/pets'

async function getAllPets(): Promise<Pet[]> {
  'use cache'
  cacheTag('pets')
  cacheLife('max')

  const pb = await createAdminPB()
  const records = await pb.collection('pets').getFullList({
    sort: '-created',
    fields: 'id,display_name,description,spritesheet_url,source_url,published,is_nsfw,created',
  })
  return records.map((r) => ({
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
  })) as Pet[]
}

async function PetList() {
  const pets = await getAllPets()

  if (pets.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        No pets yet. Use bulk import to add pets.
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Pets</h1>
      <PetAdminTable pets={pets} />
    </div>
  )
}

export default function AdminPetsPage() {
  return (
    <Suspense fallback={<div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />}>
      <PetList />
    </Suspense>
  )
}
