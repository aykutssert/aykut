import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  const { id, payload, conflict, versionSummary } = await req.json()
  const supabase = adminClient()

  let docId = id

  if (conflict) {
    const { error: rpcError } = await supabase.rpc('shift_order_index', {
      p_category: payload.category,
      p_from_index: payload.order_index,
    })
    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 })
  }

  if (id) {
    // 1. Get existing doc data for cleanup and version comparison
    const { data: existing } = await supabase
      .from('docs')
      .select('image_url, content')
      .eq('id', id)
      .single()

    if (existing?.image_url && existing.image_url !== payload.image_url) {
      const parts = new URL(existing.image_url).pathname.split('/object/public/kernel/')
      if (parts[1]) await supabase.storage.from('kernel').remove([parts[1]])
    }

    // 2. Update the doc
    const { error } = await supabase
      .from('docs')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // 3. Create a new version record if content changed
    if (existing?.content !== payload.content) {
      const { count } = await supabase
        .from('doc_versions')
        .select('*', { count: 'exact', head: true })
        .eq('doc_id', id)
      
      const nextVersion = (count ?? 0) + 1
      await supabase.from('doc_versions').insert({
        doc_id: id,
        version_number: nextVersion,
        content: payload.content,
        change_summary: versionSummary || (nextVersion === 1 ? 'Initial version' : 'Content updated'),
        author_handle: '@admin'
      })
    }
  } else {
    // New doc creation
    const { data: newDoc, error } = await supabase.from('docs').insert(payload).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    docId = newDoc.id

    // Create v1 for new docs
    await supabase.from('doc_versions').insert({
      doc_id: docId,
      version_number: 1,
      content: payload.content,
      change_summary: versionSummary || 'Initial version',
      author_handle: '@admin'
    })
  }

  revalidateTag('docs', 'max')
  return NextResponse.json({ ok: true, id: docId })
}
