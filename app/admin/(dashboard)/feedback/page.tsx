import { FeedbackManager } from '@/components/admin/FeedbackManager'

export default async function AdminFeedbackPage() {
  return (
    <div className="space-y-6">
      <FeedbackManager initialData={[]} />
    </div>
  )
}
