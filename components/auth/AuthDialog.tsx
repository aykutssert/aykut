'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type AuthMode = 'signin' | 'signup' | 'forgot'

type AuthUser = {
  id: string
  email: string | null
  username: string | null
}

type AuthDialogProps = {
  open: boolean
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onOpenChange: (open: boolean) => void
  onAuthenticated: (user: AuthUser) => void
}

function Field({
  label,
  id,
  name,
  type = 'text',
  value,
  autoComplete,
  minLength,
  onChange,
}: {
  label: string
  id: string
  name: string
  type?: string
  value: string
  autoComplete?: string
  minLength?: number
  onChange: (value: string) => void
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-medium text-foreground">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        minLength={minLength}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/40"
        required
      />
    </label>
  )
}

async function readError(response: Response) {
  const payload = await response.json().catch(() => null) as { error?: string } | null
  return payload?.error ?? 'Something went wrong.'
}

export function AuthDialog({
  open,
  mode,
  onModeChange,
  onOpenChange,
  onAuthenticated,
}: AuthDialogProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onOpenChange(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const isSignin = mode === 'signin'
  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'

  const title = isSignup ? 'Create account' : isForgot ? 'Reset password' : 'Sign in'
  const description = isSignup
    ? 'Save your account and keep Kernel features tied to your profile.'
    : isForgot
      ? 'Enter your email and we will send a reset link.'
      : 'Continue with your Kernel account.'

  function handleModeChange(nextMode: AuthMode) {
    setError('')
    setSuccess('')
    setLoading(false)
    onModeChange(nextMode)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const endpoint = isSignup
      ? '/api/auth/signup'
      : isForgot
        ? '/api/auth/reset-password'
        : '/api/auth/signin'

    const body = isSignup
      ? { username, email, password }
      : isForgot
        ? { email }
        : { email, password }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      setError(await readError(response))
      setLoading(false)
      return
    }

    if (isSignup) {
      setSuccess('Account created. Check your email to confirm your address.')
      setPassword('')
      setLoading(false)
      return
    }

    if (isForgot) {
      setSuccess('Password reset link sent. Check your email.')
      setLoading(false)
      return
    }

    const meResponse = await fetch('/api/auth/me', { cache: 'no-store' })
    const payload = await meResponse.json().catch(() => null) as { user?: AuthUser | null } | null

    if (payload?.user) {
      onAuthenticated(payload.user)
      onOpenChange(false)
    } else {
      setError('Signed in, but user data could not be loaded.')
    }

    setLoading(false)
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/35 p-4 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === backdropRef.current) onOpenChange(false)
      }}
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="ml-4 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close auth modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="mb-4 grid grid-cols-2 rounded-lg border border-border p-0.5 text-xs">
            <button
              type="button"
              onClick={() => handleModeChange('signin')}
              className={cn(
                'rounded-md px-3 py-2 font-medium transition-colors',
                isSignin ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('signup')}
              className={cn(
                'rounded-md px-3 py-2 font-medium transition-colors',
                isSignup ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <Field
                id="auth-username"
                name="username"
                label="Username"
                value={username}
                autoComplete="username"
                onChange={setUsername}
              />
            )}

            <Field
              id="auth-email"
              name="email"
              label="Email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={setEmail}
            />

            {!isForgot && (
              <Field
                id="auth-password"
                name={isSignup ? 'new-password' : 'current-password'}
                label="Password"
                type="password"
                value={password}
                minLength={8}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                onChange={setPassword}
              />
            )}

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
              {isSignup ? 'Create account' : isForgot ? 'Send reset link' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => handleModeChange(isForgot ? 'signin' : 'forgot')}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {isForgot ? 'Back to sign in' : 'Forgot password?'}
            </button>

            {!isForgot && (
              <button
                type="button"
                onClick={() => handleModeChange(isSignin ? 'signup' : 'signin')}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {isSignin ? 'Create account' : 'Have an account?'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
