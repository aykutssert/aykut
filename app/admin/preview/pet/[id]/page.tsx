import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PetViewer } from '@/components/pets/PetViewer'
import type { Pet } from '@/lib/pets'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PreviewPetPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: pet } = await supabase.from('pets').select('*').eq('id', id).single() as { data: Pet | null }
  if (!pet) notFound()

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
