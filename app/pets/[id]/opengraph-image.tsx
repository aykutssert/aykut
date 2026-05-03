import { ImageResponse } from 'next/og'
import { createPublicClient } from '@/lib/supabase/server'

export const alt = 'Codex Pet'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CELL_W = 192
const CELL_H = 208
const ATLAS_COLS = 8
const ATLAS_ROWS = 9
const SCALE = 2.5

const SITE = 'kernel-indol.vercel.app'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createPublicClient()
  const { data: pet } = await supabase
    .from('pets')
    .select('display_name, description, spritesheet_url')
    .eq('id', id)
    .eq('published', true)
    .single()

  const spriteW = Math.round(CELL_W * SCALE)
  const spriteH = Math.round(CELL_H * SCALE)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          padding: '72px 80px',
          alignItems: 'center',
          gap: '64px',
        }}
      >
        {/* Sprite — first frame via background-image crop */}
        {pet?.spritesheet_url && (
          <div
            style={{
              flexShrink: 0,
              width: spriteW,
              height: spriteH,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundImage: `url(${pet.spritesheet_url})`,
              backgroundSize: `${CELL_W * ATLAS_COLS * SCALE}px ${CELL_H * ATLAS_ROWS * SCALE}px`,
              backgroundPosition: '0 0',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: '#555',
              fontSize: 18,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 20,
              fontFamily: 'sans-serif',
            }}
          >
            Codex Pet
          </div>
          <div
            style={{
              color: '#ffffff',
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 28,
              fontFamily: 'sans-serif',
            }}
          >
            {pet?.display_name ?? id}
          </div>
          {pet?.description && (
            <div
              style={{
                color: '#888',
                fontSize: 26,
                lineHeight: 1.5,
                fontFamily: 'sans-serif',
              }}
            >
              {pet.description.length > 110
                ? pet.description.slice(0, 110) + '…'
                : pet.description}
            </div>
          )}
          <div
            style={{
              color: '#333',
              fontSize: 18,
              marginTop: 'auto',
              paddingTop: 40,
              fontFamily: 'sans-serif',
            }}
          >
            {SITE}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
