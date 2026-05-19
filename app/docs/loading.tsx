export default function DocsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar placeholder */}
      <div className="sticky top-0 z-50 h-[57px] border-b bg-background/95" />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-0 pt-6 pb-12">
        {/* DeveloperSubnav placeholder */}
        <div className="mb-4 flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-7 w-14 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Article count */}
        <div className="flex min-h-5 items-center gap-2 mb-3">
          <div className="h-3.5 w-40 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[117px] space-y-1 rounded-md border border-border bg-background p-3">
              <div className="px-2 pb-2">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded-md bg-muted" style={{ width: `${60 + (i % 3) * 15}%` }} />
              ))}
              <div className="mt-2 h-8 animate-pulse rounded-md border border-border bg-muted" />
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 space-y-10">
            {Array.from({ length: 3 }).map((_, gi) => (
              <section key={gi}>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                </div>
                <div className="divide-y divide-border rounded-md border border-border">
                  {Array.from({ length: 3 + (gi % 2) }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="h-4 animate-pulse rounded bg-muted" style={{ width: `${50 + (i % 3) * 15}%` }} />
                        <div className="flex gap-1">
                          {Array.from({ length: 2 + (i % 2) }).map((_, j) => (
                            <div key={j} className="h-4 w-12 animate-pulse rounded bg-muted" />
                          ))}
                        </div>
                      </div>
                      <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}
