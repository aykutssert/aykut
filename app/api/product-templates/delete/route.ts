import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth/admin'

function storagePathFromPublicUrl(url: string) {
  try {
    const path = new URL(url).pathname
    const marker = '/object/public/product-template-images/'
    const index = path.indexOf(marker)
    return index >= 0 ? path.slice(index + marker.length) : null
  } catch {
    return null
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json().catch(() => ({})) as { id?: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: template } = await supabase
    .from('product_templates')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('product_templates').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const path = template?.image_url ? storagePathFromPublicUrl(template.image_url) : null
  if (path) {
    await supabase.storage.from('product-template-images').remove([path])
  }

  revalidateTag('product-templates', 'max')
  return NextResponse.json({ ok: true })
}
