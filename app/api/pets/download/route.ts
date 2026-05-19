import { NextResponse } from 'next/server'
import { createPB } from '@/lib/pocketbase'
import JSZip from 'jszip'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const pb = createPB()
    const record = await pb.collection('pets').getOne(id)

    const spritesheetRes = await fetch(record.spritesheet_url as string)
    if (!spritesheetRes.ok) return NextResponse.json({ error: 'Failed to fetch spritesheet' }, { status: 500 })
    const spritesheetBuffer = await spritesheetRes.arrayBuffer()

    const petJson = JSON.stringify({
      id: record.id,
      displayName: record.display_name,
      description: (record.description as string) ?? '',
      spritesheetPath: 'spritesheet.webp',
    }, null, 2)

    const zip = new JSZip()
    zip.file('pet.json', petJson)
    zip.file('spritesheet.webp', spritesheetBuffer)

    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' })

    return new Response(zipBuffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${record.id}.codex-pet.zip"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
