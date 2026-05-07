import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

function storagePathFromPublicUrl(url: string) {
  try {
    const path = new URL(url).pathname
    const marker = '/object/public/product-results/'
    const index = path.indexOf(marker)
    return index >= 0 ? path.slice(index + marker.length) : null
  } catch {
    return null
  }
}

export async function DELETE(req: Request) {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const { id } = await req.json().catch(() => ({})) as { id?: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const service = createServiceClient()
  const { data: result } = await service
    .from('product_results')
    .select('image_url')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 })

  if (result.image_url) {
    const path = storagePathFromPublicUrl(result.image_url)
    if (path) {
      const { error: removeError } = await service.storage.from('product-results').remove([path])
      if (removeError) return NextResponse.json({ error: removeError.message }, { status: 500 })
    }
  }

  const { error } = await service
    .from('product_results')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
