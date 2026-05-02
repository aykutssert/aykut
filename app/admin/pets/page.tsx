import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PetAdminTable } from '@/components/admin/PetAdminTable'
import type { Pet } from '@/lib/pets'

async function getAllPets(): Promise<Pet[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('pets').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminPetsPage() {
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
