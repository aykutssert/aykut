import { NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'
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
    const doc = await pb.collection('docs').getOne(id, { fields: 'id,category,slug' })
    await pb.collection('docs').update(id, { published })
    revalidateTag('docs', 'max')
    revalidatePath(`/docs/${doc.category}/${doc.slug}`)
    revalidatePath('/docs', 'layout')
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
