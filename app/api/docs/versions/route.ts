import { NextResponse } from 'next/server'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'

export async function GET(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const docId = searchParams.get('docId')
  if (!docId) return NextResponse.json({ error: 'Missing docId' }, { status: 400 })

  try {
    const pb = await createAdminPB()
    const records = await pb.collection('doc_versions').getFullList({
      filter: `doc_id = "${docId}"`,
      sort: '-version_number',
    })
    return NextResponse.json(records.map((r) => ({
      id: r.id,
      version_number: r.version_number,
      content: r.content,
      change_summary: r.change_summary ?? null,
      author_handle: r.author_handle ?? null,
      created_at: r.created,
    })))
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
