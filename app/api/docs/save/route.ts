import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'

export async function POST(req: Request) {
  const { id, payload, versionSummary } = await req.json()

  try {
    const pb = await createAdminPB()
    let docId = id

    if (id) {
      const existing = await pb.collection('docs').getOne(id)
      await pb.collection('docs').update(id, payload)

      if (existing.content !== payload.content) {
        const versions = await pb.collection('doc_versions').getFullList({
          filter: `doc_id = "${id}"`,
          sort: '-version_number',
          fields: 'version_number',
        })
        const nextVersion = (versions[0]?.version_number ?? 0) + 1
        await pb.collection('doc_versions').create({
          doc_id: id,
          version_number: nextVersion,
          content: payload.content,
          change_summary: versionSummary || 'Content updated',
          author_handle: '@admin',
        })
      }
    } else {
      const newDoc = await pb.collection('docs').create(payload)
      docId = newDoc.id
      await pb.collection('doc_versions').create({
        doc_id: docId,
        version_number: 1,
        content: payload.content,
        change_summary: versionSummary || 'Initial version',
        author_handle: '@admin',
      })
    }

    revalidateTag('docs', 'max')
    return NextResponse.json({ ok: true, id: docId })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
