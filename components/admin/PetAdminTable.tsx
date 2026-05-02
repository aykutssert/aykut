'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Pet } from '@/lib/pets'

export function PetAdminTable({ pets: initialPets }: { pets: Pet[] }) {
  const router = useRouter()
  const [pets, setPets] = useState(initialPets)

  async function handleTogglePublish(id: string, current: boolean) {
    setPets((prev) => prev.map((p) => p.id === id ? { ...p, published: !current } : p))
    const res = await fetch('/api/pets/publish', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published: !current }),
    })
    if (!res.ok) {
      setPets((prev) => prev.map((p) => p.id === id ? { ...p, published: current } : p))
    } else {
      router.refresh()
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch('/api/pets/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 w-12" />
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {pets.map((pet, i) => (
            <tr key={pet.id} className={i < pets.length - 1 ? 'border-b border-border' : ''}>
              <td className="px-4 py-2">
                <div
                  className="w-8 h-8 rounded overflow-hidden shrink-0"
                  style={{
                    backgroundImage: `url(${pet.spritesheet_url})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '0 0',
                    backgroundSize: 'auto 100%',
                    imageRendering: 'pixelated',
                  }}
                />
              </td>
              <td className="px-4 py-2 font-medium">{pet.display_name}</td>
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{pet.id}</td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(pet.id, pet.published)}
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70',
                      pet.published
                        ? 'bg-foreground text-background dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {pet.published ? 'Published' : 'Draft'}
                  </button>
                  {pet.is_nsfw && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30">
                      NSFW
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 justify-end">
                  <Link
                    href={`/admin/preview/pet/${pet.id}`}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/admin/pets/edit/${pet.id}`}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(pet.id, pet.display_name)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
