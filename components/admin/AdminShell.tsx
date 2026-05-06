'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'
import { LogoutButton } from '@/components/admin/LogoutButton'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { AdminNavLinks } from '@/components/admin/AdminNavLinks'
import { AdminGlobalSearch } from '@/components/admin/AdminGlobalSearch'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex h-[57px] items-center gap-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/kernel-logo.svg" alt="Kernel" width={20} height={20} />
            <span className="text-sm font-semibold">Kernel</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Suspense fallback={<div className="h-4 w-32 animate-pulse rounded bg-muted" />}>
            <AdminNavLinks />
          </Suspense>
          <div className="ml-auto flex items-center gap-2">
            <AdminGlobalSearch />
            <ThemeToggle />
            <Link
              href="/admin/product-templates/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              New template
            </Link>
            <Link
              href="/admin/pets/bulk"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Bulk import
            </Link>
            <Link
              href="/admin/pets/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              New pet
            </Link>
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              New doc
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  )
}
