import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const SOURCE_VALUES = new Set(['Site', 'Reddit', 'Twitter', 'Other'])
const WINDOW_MS = 60 * 60 * 1000
const MAX_FEEDBACK_PER_WINDOW = 3

function hashIp(ip: string) {
  return createHash('sha256')
    .update(`${process.env.FEEDBACK_IP_SALT ?? 'kernel'}:${ip}`)
    .digest('hex')
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(req: Request) {
  try {
    const { content: rawContent, author_name: rawAuthorName, source: rawSource, website } = await req.json()
    if (website) return NextResponse.json({ success: true })

    const content = cleanText(rawContent, 2000)
    const author_name = cleanText(rawAuthorName, 80) || 'Anonymous'
    const source = SOURCE_VALUES.has(rawSource) ? rawSource : 'Site'
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
    const fingerprint = hashIp(ip)

    if (content.length < 8) {
      return NextResponse.json({ error: 'Feedback is too short' }, { status: 400 })
    }

    const auth = await createClient()
    const { data: { user } } = await auth.auth.getUser()
    const supabase = createServiceClient()

    const { count, error: countError } = await supabase
      .from('site_feedback')
      .select('*', { count: 'exact', head: true })
      .eq('fingerprint', fingerprint)
      .gt('created_at', new Date(Date.now() - WINDOW_MS).toISOString())

    if (countError) throw countError

    if (count !== null && count >= MAX_FEEDBACK_PER_WINDOW) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { error } = await supabase.from('site_feedback').insert({
      user_id: user?.id ?? null,
      content,
      author_name,
      source,
      fingerprint,
      status: 'pending'
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Feedback API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('site_feedback')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
