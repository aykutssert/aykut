'use client'

import dynamic from 'next/dynamic'

const TshirtViewer = dynamic(
  () => import('@/components/tshirt-studio/TshirtViewer'),
  { ssr: false }
)

export function TshirtStudioClient() {
  return (
    <div style={{ height: 'calc(100dvh - var(--navbar-height))' }} className="flex flex-col">
      <TshirtViewer />
    </div>
  )
}
