import { cacheLife, cacheTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/server'

export async function getRoamingPetSpritesheetUrl(): Promise<string | null> {
  'use cache'
  cacheTag('site_settings', 'pets')
  cacheLife('minutes')

  const supabase = createPublicClient()
  const { data: setting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'roaming_pet_id')
    .single()

  if (!setting?.value) return null

  const { data: pet } = await supabase
    .from('pets')
    .select('spritesheet_url')
    .eq('id', setting.value)
    .single()

  return pet?.spritesheet_url ?? null
}
