import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">404</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Page not found</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Back to docs
      </Link>
    </div>
  )
}
