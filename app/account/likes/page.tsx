import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getDocs } from '@/lib/docs'
import { LikesLoader } from '@/components/account/LikesLoader'

export const metadata: Metadata = {
  title: 'Beğendiklerim',
}

export default async function AccountLikesPage() {
  const docs = await getDocs()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-12 pt-6 md:px-0">
        <LikesLoader />
      </main>
      <Footer />
    </div>
  )
}
