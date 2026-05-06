import { Suspense } from 'react'
import { getRoamingPetSpritesheetUrl } from '@/lib/roaming-pet'
import { RoamingPetClient } from './RoamingPetClient'

async function RoamingPetFetcher() {
  const spritesheetUrl = await getRoamingPetSpritesheetUrl()
  if (!spritesheetUrl) return null

  return <RoamingPetClient spritesheetUrl={spritesheetUrl} />
}

export function RoamingPetWrapper() {
  return (
    <Suspense fallback={null}>
      <RoamingPetFetcher />
    </Suspense>
  )
}
