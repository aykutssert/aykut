import { cookies } from 'next/headers'
import { createHash } from 'crypto'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? ''

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex')
}

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  return ADMIN_SECRET !== '' && token === hashSecret(ADMIN_SECRET)
}
