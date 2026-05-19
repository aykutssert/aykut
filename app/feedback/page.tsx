import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getDocs } from '@/lib/docs'
import { MessageSquare } from 'lucide-react'

export default async function FeedbackPage() {
  const docs = await getDocs()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Wall of Feedback</h1>
          <p className="text-lg text-muted-foreground">
            Voices from the community. Your suggestions shape the future of Kernel.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-3xl">
          <MessageSquare className="h-10 w-10 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No public feedback yet.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
