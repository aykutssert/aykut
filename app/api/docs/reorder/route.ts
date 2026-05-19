import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { items } = await req.json() as { items: { id: string; order_index: number }[] }
  try {
    const pb = await createAdminPB()
    await Promise.all(items.map(({ id, order_index }) =>
      pb.collection('docs').update(id, { order_index })
    ))
    revalidateTag('docs', 'max')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
