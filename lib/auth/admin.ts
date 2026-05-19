import { cookies } from 'next/headers'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? ''

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  return token === ADMIN_SECRET && ADMIN_SECRET !== ''
}
