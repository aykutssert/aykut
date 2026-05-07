export function ProductResultsSkeleton() {
  return (
    <div>
      {/* Usage bar */}
      <div className="mb-4 rounded-md border border-border bg-background p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-1.5 animate-pulse rounded-full bg-muted" />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="h-3 w-10 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
      {/* Sort/filter row */}
      <div className="mb-4 flex gap-2">
        {[40, 60, 72, 56].map((w, i) => (
          <div key={i} className="h-7 animate-pulse rounded-full bg-muted" style={{ width: `${w}px` }} />
        ))}
        <div className="ml-auto h-7 w-24 animate-pulse rounded-full bg-muted" />
      </div>
      {/* Cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-md border border-border bg-background md:flex-row">
            <div className="w-full animate-pulse bg-muted md:h-auto md:w-64" style={{ minHeight: '160px' }} />
            <div className="flex flex-1 flex-col">
              <div className="flex border-b border-border">
                <div className="flex flex-1 items-center gap-2.5 border-r border-border p-3">
                  <div className="h-12 w-12 shrink-0 animate-pulse rounded-sm bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                    <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-2.5 p-3">
                  <div className="h-12 w-12 shrink-0 animate-pulse rounded-sm bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                    <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col space-y-3 p-3">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
                  <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
                </div>
                <div className="mt-auto flex justify-end gap-1 border-t border-border pt-3">
                  <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
                  <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
