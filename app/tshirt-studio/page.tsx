import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getDocs } from '@/lib/docs'
import { TshirtStudioClient } from './TshirtStudioClient'

export default async function TshirtStudioPage() {
  const docs = await getDocs()
  return (
    <div className="flex flex-col">
      <Navbar docs={docs} />
      <TshirtStudioClient />
    </div>
  )
}
