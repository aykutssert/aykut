const PET_LIKES_KEY = 'kernel_liked_pets'
const DOC_LIKES_KEY = 'kernel_liked_docs'

function readIds(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

function writeIds(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids))
  } catch {}
}

// Pets
export function getLikedPetIds(): string[] {
  return readIds(PET_LIKES_KEY)
}

export function isPetLiked(id: string): boolean {
  return readIds(PET_LIKES_KEY).includes(id)
}

export function togglePetLike(id: string): boolean {
  const ids = readIds(PET_LIKES_KEY)
  const liked = ids.includes(id)
  writeIds(PET_LIKES_KEY, liked ? ids.filter((i) => i !== id) : [...ids, id])
  return !liked
}

// Docs
export function getLikedDocIds(): string[] {
  return readIds(DOC_LIKES_KEY)
}

export function isDocLiked(id: string): boolean {
  return readIds(DOC_LIKES_KEY).includes(id)
}

export function toggleDocLike(id: string): boolean {
  const ids = readIds(DOC_LIKES_KEY)
  const liked = ids.includes(id)
  writeIds(DOC_LIKES_KEY, liked ? ids.filter((i) => i !== id) : [...ids, id])
  return !liked
}
