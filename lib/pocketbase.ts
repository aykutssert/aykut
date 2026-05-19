import PocketBase from 'pocketbase'

const PB_URL = process.env.POCKETBASE_URL ?? 'https://db.kernelgallery.com'

export function createPB() {
  return new PocketBase(PB_URL)
}

// Singleton admin instance — reuses the auth token until it expires
let adminPB: PocketBase | null = null
let adminAuthExpiry = 0

export async function createAdminPB(): Promise<PocketBase> {
  const now = Date.now()

  // Reuse if token is still valid (refresh 5 min before expiry)
  if (adminPB && adminPB.authStore.isValid && now < adminAuthExpiry - 5 * 60 * 1000) {
    return adminPB
  }

  const pb = new PocketBase(PB_URL)
  const auth = await pb.collection('_superusers').authWithPassword(
    process.env.PB_ADMIN_EMAIL ?? '',
    process.env.PB_ADMIN_PASSWORD ?? '',
  )

  adminPB = pb
  // PocketBase tokens are valid for 30 days by default; use the token's expiry if available
  const expiry = (auth.record as unknown as { tokenExpiry?: number })?.tokenExpiry
  adminAuthExpiry = expiry ? expiry * 1000 : now + 24 * 60 * 60 * 1000

  return pb
}
