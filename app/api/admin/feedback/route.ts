import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'

async function checkAdmin() {
  return requireAdmin()
}

export async function PATCH(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...updates } = await req.json()
    const safeUpdates: { status?: string; is_featured?: boolean } = {}

    if (['pending', 'published', 'archived'].includes(updates.status)) {
      safeUpdates.status = updates.status
    }
    if (typeof updates.is_featured === 'boolean') {
      safeUpdates.is_featured = updates.is_featured
    }
    if (!id || Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: 'Invalid update' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const { error } = await supabase
      .from('site_feedback')
      .update(safeUpdates)
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const supabase = await createClient()
    
    const { error } = await supabase
      .from('site_feedback')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
