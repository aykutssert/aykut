import { NextResponse } from 'next/server'
import { createAdminPB } from '@/lib/pocketbase'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const petId = formData.get('petId') as string | null
  if (!file || !petId) return NextResponse.json({ error: 'Missing file or petId' }, { status: 400 })

  try {
    const pb = await createAdminPB()

    // Check if pet exists, create with petId if not
    let recordId: string
    try {
      const existing = await pb.collection('pets').getOne(petId)
      recordId = existing.id
    } catch {
      const created = await pb.collection('pets').create({
        id: petId,
        display_name: petId,
        published: false,
        is_nsfw: false,
      })
      recordId = created.id
    }

    const uploadFormData = new FormData()
    uploadFormData.append('spritesheet', file)

    const updated = await pb.collection('pets').update(recordId, uploadFormData)
    const url = pb.files.getURL(updated, updated.spritesheet as string)

    return NextResponse.json({ url })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
