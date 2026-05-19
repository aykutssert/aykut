import { AdminShell } from '@/components/admin/AdminShell'
import { requireAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { Suspense } from 'react'

async function AdminGuard({ children }: { children: React.ReactNode }) {
  await connection()
  const isAdmin = await requireAdmin()
  if (!isAdmin) redirect('/admin/login')
  return <>{children}</>
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/20" />}>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </Suspense>
  )
}
