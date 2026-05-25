import { Suspense } from 'react'
import Link from 'next/link'
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminPB } from '@/lib/pocketbase'
import { FileText, PawPrint, FileX } from 'lucide-react'

interface DashboardData {
  stats: { totalDocs: number; totalPets: number; draftDocs: number; draftPets: number }
  recent: {
    docs: { id: string; title: string; category: string; published: boolean; created: string }[]
  }
}

async function getDashboardData(): Promise<DashboardData> {
  'use cache'
  cacheTag('docs', 'pets')
  cacheLife('minutes')

  const pb = await createAdminPB()

  const [allDocs, allPets, recentDocsRes] = await Promise.all([
    pb.collection('docs').getFullList({ fields: 'published' }),
    pb.collection('pets').getFullList({ fields: 'published' }),
    pb.collection('docs').getList(1, 5, { sort: '-created', fields: 'id,title,category,published,created' }),
  ])

  const stats = {
    totalDocs: allDocs.length,
    totalPets: allPets.length,
    draftDocs: allDocs.filter((d) => !d.published).length,
    draftPets: allPets.filter((p) => !p.published).length,
  }

  const recent = {
    docs: recentDocsRes.items as unknown as DashboardData['recent']['docs'],
  }

  return { stats, recent }
}

function StatCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: number; href?: string }) {
  const inner = (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-2xl font-semibold tabular-nums">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>
}

async function Dashboard() {
  const { stats, recent } = await getDashboardData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold mb-4">Overview</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard icon={<FileText className="w-4 h-4" />} label="Total posts" value={stats.totalDocs} href="/admin/docs" />
          <StatCard icon={<PawPrint className="w-4 h-4" />} label="Total pets" value={stats.totalPets} href="/admin/pets" />
          <StatCard icon={<FileX className="w-4 h-4" />} label="Drafts" value={stats.draftDocs + stats.draftPets} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Recent posts</h2>
          <Link href="/admin/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</Link>
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          {recent.docs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.docs.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/admin/edit/${doc.id}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.category}</p>
                    </div>
                    <span className={`shrink-0 ml-3 text-xs px-1.5 py-0.5 rounded-full ${doc.published ? 'bg-foreground/10 text-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {doc.published ? 'Published' : 'Draft'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
        </div>
      </div>
    }>
      <Dashboard />
    </Suspense>
  )
}
