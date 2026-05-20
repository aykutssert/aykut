import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getDocs } from '@/lib/docs'
import { MessageSquare } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function FeedbackPage() {
  const docs = await getDocs()
  const t = await getTranslations('feedback')

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar docs={docs} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">{t('page_title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('page_subtitle')}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-3xl">
          <MessageSquare className="h-10 w-10 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">{t('no_feedback_yet')}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
