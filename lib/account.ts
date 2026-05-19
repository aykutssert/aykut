// Likes are stored in localStorage — no server-side liked data
import type { Pet } from '@/lib/pets'
import type { TaggedDoc } from '@/types'
import type { TaggedDocWithPreview } from '@/lib/prompt-preview'

export type LikedPet = Pet & { liked_at: string }
export type LikedDoc = TaggedDocWithPreview & { liked_at: string; liked_by_me: boolean }

export async function getLikedPets(_userId: string): Promise<LikedPet[]> {
  return []
}

export async function getLikedDocs(_userId: string): Promise<LikedDoc[]> {
  return []
}
