'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" />
      Logout
    </button>
  )
}
