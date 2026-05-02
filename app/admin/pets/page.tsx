import Link from 'next/link'
import { Suspense } from 'react'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { PetAdminTable } from '@/components/admin/PetAdminTable'
import type { Pet } from '@/lib/pets'

async function getAllPets(): Promise<Pet[]> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase.from('pets').select('*').order('created_at', { ascending: false })
  return data ?? []
}

async function PetList() {
  const pets = await getAllPets()

  if (pets.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        No pets yet.{' '}
        <Link href="/admin/pets/new" className="underline underline-offset-4 hover:text-foreground">
          Add the first one.
        </Link>
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
