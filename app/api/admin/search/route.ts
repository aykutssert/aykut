import { NextResponse } from 'next/server'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() ?? ''
  if (!q) return NextResponse.json({ docs: [], pets: [] })

  const safe = q.replace(/"/g, '')

  try {
    const pb = await createAdminPB()
    const [docsRes, petsRes] = await Promise.all([
      pb.collection('docs').getList(1, 6, {
        filter: `title ~ "${safe}" || slug ~ "${safe}" || category ~ "${safe}"`,
        fields: 'id,title,category,slug,published',
      }),
      pb.collection('pets').getList(1, 6, {
        filter: `display_name ~ "${safe}" || id ~ "${safe}"`,
        fields: 'id,display_name,published',
      }),
    ])

    return NextResponse.json({
      docs: docsRes.items,
      pets: petsRes.items,
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
