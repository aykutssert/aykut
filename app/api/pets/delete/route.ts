import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'

export async function DELETE(req: Request) {
  const { id } = await req.json() as { id: string }
  try {
    const pb = await createAdminPB()
    await pb.collection('pets').delete(id)
    revalidateTag('pets', 'max')
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
