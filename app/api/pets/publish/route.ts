import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, published } = await req.json()
  if (!id || typeof published !== 'boolean') {
    return NextResponse.json({ error: 'Missing id or published' }, { status: 400 })
  }
  try {
    const pb = await createAdminPB()
    await pb.collection('pets').update(id, { published })
    revalidateTag('pets', 'max')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
