import PocketBase from 'pocketbase'

const PB_URL = process.env.POCKETBASE_URL ?? 'https://db.kernelgallery.com'

export function createPB() {
  const pb = new PocketBase(PB_URL)
  pb.autoCancellation(false)
  return pb
}

export async function createAdminPB(): Promise<PocketBase> {
  const pb = new PocketBase(PB_URL)
  pb.autoCancellation(false)
  await pb.collection('_superusers').authWithPassword(
    process.env.PB_ADMIN_EMAIL ?? '',
    process.env.PB_ADMIN_PASSWORD ?? '',
  )
  return pb
}
