import { NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { requireAdmin } from '@/lib/auth/admin'
import sharp from 'sharp'

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const payload = JSON.parse(formData.get('payload') as string)
  const id = (formData.get('id') as string) || null
  const versionSummary = (formData.get('versionSummary') as string) || ''
  const rawImage = formData.get('image') as File | null
  const clearImage = formData.get('clearImage') === 'true'

  try {
    const pb = await createAdminPB()
    let docId = id

    // Convert image to WebP if provided
    let imageFile: File | null = null
    if (rawImage && rawImage.size > 0) {
      const buffer = Buffer.from(await rawImage.arrayBuffer())
      const webp = await sharp(buffer).webp({ quality: 85 }).toBuffer()
      const slug = (payload.slug as string) || `img-${Date.now()}`
      imageFile = new File([new Uint8Array(webp)], `${slug}.webp`, { type: 'image/webp' })
    }

    // Build PocketBase data object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = { ...payload }

    if (imageFile) {
      data.image = imageFile
      data.image_url = null // clear old text URL
    } else if (clearImage) {
      data.image = null
      data.image_url = null
    }
    // else: leave image and image_url untouched

    if (id) {
      const existing = await pb.collection('docs').getOne(id)
      await pb.collection('docs').update(id, data)

      if (payload.category === 'prompts' && existing.content !== payload.content) {
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
        revalidateTag(`versions-${id}`, 'max')
      }
    } else {
      const newDoc = await pb.collection('docs').create(data)
      docId = newDoc.id
      if (payload.category === 'prompts') {
        await pb.collection('doc_versions').create({
          doc_id: docId,
          version_number: 1,
          content: payload.content,
          change_summary: versionSummary || 'Initial version',
          author_handle: '@admin',
        })
      }
    }

    revalidateTag('docs', 'max')
    revalidatePath(`/docs/${payload.category}/${payload.slug}`)
    revalidatePath('/docs', 'layout')
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true, id: docId })
  } catch (e: unknown) {
    console.error('[/api/docs/save] Error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
