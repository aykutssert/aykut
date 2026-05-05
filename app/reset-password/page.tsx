'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const response = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { error?: string } | null
      setError(payload?.error ?? 'Password could not be updated.')
      setLoading(false)
      return
    }

    setSuccess('Password updated. Redirecting...')
    setPassword('')
    setConfirmPassword('')
    setTimeout(() => {
      router.push('/prompts?auth=password-updated')
      router.refresh()
    }, 900)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm dark:bg-black/25" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="border-b border-border px-5 py-4">
            <Link href="/prompts" className="mb-5 flex w-fit items-center gap-2">
              <Image src="/kernel-logo.svg" alt="Kernel" width={24} height={24} priority />
              <span className="text-sm font-semibold">Kernel</span>
            </Link>
            <h1 className="text-sm font-semibold">Reset password</h1>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Choose a new password for your Kernel account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 px-5 py-5">
            <label htmlFor="new-password" className="block">
              <span className="mb-1.5 block text-xs font-medium">New password</span>
              <input
                id="new-password"
                name="new-password"
                type="password"
                value={password}
                minLength={8}
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/40"
                required
              />
            </label>

            <label htmlFor="confirm-password" className="block">
              <span className="mb-1.5 block text-xs font-medium">Confirm password</span>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                minLength={8}
                autoComplete="new-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/40"
                required
              />
            </label>

            {error && (
              <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Update password
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
