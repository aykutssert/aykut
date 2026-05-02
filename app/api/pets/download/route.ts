import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/server'
import JSZip from 'jszip'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createPublicClient()
  const { data: pet } = await supabase
    .from('pets')
    .select('id, display_name, description, spritesheet_url')
    .eq('id', id)
    .single()

  if (!pet) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const spritesheetRes = await fetch(pet.spritesheet_url)
  if (!spritesheetRes.ok) return NextResponse.json({ error: 'Failed to fetch spritesheet' }, { status: 500 })
  const spritesheetBuffer = await spritesheetRes.arrayBuffer()

  const petJson = JSON.stringify({
    id: pet.id,
    displayName: pet.display_name,
    description: pet.description ?? '',
    spritesheetPath: 'spritesheet.webp',
  }, null, 2)

  const zip = new JSZip()
  zip.file('pet.json', petJson)
  zip.file('spritesheet.webp', spritesheetBuffer)

  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' })

  return new Response(zipBuffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${pet.id}.codex-pet.zip"`,
    },
  })
}
