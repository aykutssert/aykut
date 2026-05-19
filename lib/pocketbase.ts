import PocketBase from 'pocketbase'

const PB_URL = process.env.POCKETBASE_URL ?? 'https://db.kernelgallery.com'

export function createPB() {
  return new PocketBase(PB_URL)
}

export async function createAdminPB() {
  const pb = new PocketBase(PB_URL)
  await pb.collection('_superusers').authWithPassword(
    process.env.PB_ADMIN_EMAIL ?? '',
    process.env.PB_ADMIN_PASSWORD ?? '',
  )
  return pb
}
