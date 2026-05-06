import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const MAX_IDS = 50

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = (searchParams.get('ids') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, MAX_IDS)
  const fp = searchParams.get('fp')?.trim() ?? ''

  if (ids.length === 0) {
    return NextResponse.json({ items: {} })
  }

  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()
  const supabase = createServiceClient()

  const petQuery = supabase
    .from('pets')
    .select('id, likes_count')
    .in('id', ids)
    .eq('published', true)

  const likeQuery = user
    ? supabase.from('pet_likes').select('pet_id').eq('user_id', user.id).in('pet_id', ids)
    : fp
      ? supabase
          .from('pet_likes')
          .select('pet_id')
          .eq('fingerprint', fp)
          .is('user_id', null)
          .in('pet_id', ids)
      : Promise.resolve({ data: [] })

  const [{ data: pets }, { data: likes }] = await Promise.all([petQuery, likeQuery])
  const likedIds = new Set((likes ?? []).map((like) => like.pet_id))

  const items = Object.fromEntries(
    (pets ?? []).map((pet) => [
      pet.id,
      {
        liked: likedIds.has(pet.id),
        count: pet.likes_count ?? 0,
      },
    ])
  )

  return NextResponse.json({ items })
}
