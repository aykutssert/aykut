import { cacheTag, cacheLife } from 'next/cache'
import { createPB } from '@/lib/pocketbase'
import type { Pet } from '@/lib/pets'

const PER_PAGE = 15
export { PER_PAGE }

export async function getPet(id: string): Promise<Pet | null> {
  'use cache'
  cacheTag('pets', `pet-${id}`)
  cacheLife('days')
  try {
    const pb = createPB()
    const record = await pb.collection('pets').getFirstListItem(
      `id = "${id}" && published = true && is_nsfw = false`
    )
    return {
      id: record.id,
      display_name: record.display_name as string,
      description: (record.description as string) || null,
      spritesheet_url: record.spritesheet_url as string,
      source_url: (record.source_url as string) || null,
      published: record.published as boolean,
      is_nsfw: record.is_nsfw as boolean,
      likes_count: 0,
      views_count: 0,
      created_at: record.created,
    }
  } catch {
    return null
  }
}

function mapPet(r: Record<string, unknown>): Pet {
  return {
    id: r.id as string,
    display_name: r.display_name as string,
    description: (r.description as string) || null,
    spritesheet_url: r.spritesheet_url as string,
    source_url: (r.source_url as string) || null,
    published: r.published as boolean,
    is_nsfw: r.is_nsfw as boolean,
    likes_count: 0,
    views_count: 0,
    created_at: r.created as string,
  }
}

export async function getPets(
  page: number,
  q: string,
  sort: string,
  showNsfw: boolean,
): Promise<{ pets: Pet[]; total: number; totalLikes: number }> {
  'use cache'
  cacheTag('pets')
  cacheLife('minutes')

  try {
    const pb = createPB()

    const filters: string[] = ['published = true']
    if (!showNsfw) filters.push('is_nsfw = false')
    if (q) {
      const safe = q.replace(/"/g, '')
      filters.push(`(display_name ~ "${safe}" || description ~ "${safe}")`)
    }

    // likes/viewed sort kaldırıldı, created_at'e fallback
    const sortMap: Record<string, string> = {
      newest: '-created',
      oldest: '+created',
      liked: '-created',
      viewed: '-created',
    }
    const pbSort = sortMap[sort] ?? '-created'

    const result = await pb.collection('pets').getList(page, PER_PAGE, {
      filter: filters.join(' && '),
      sort: pbSort,
    })

    return {
      pets: result.items.map((r) => mapPet(r as unknown as Record<string, unknown>)),
      total: result.totalItems,
      totalLikes: 0,
    }
  } catch {
    return { pets: [], total: 0, totalLikes: 0 }
  }
}
