export function ProductTemplatesSkeleton() {
  return (
    <div className="flex gap-6">
      <aside className="hidden w-48 shrink-0 md:block">
        <div className="rounded-xl border border-border p-3">
          <div className="mb-2 h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-full animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {[220, 280, 180, 260, 200, 300, 240, 180, 270, 210, 250, 190].map((h, i) => (
            <div
              key={i}
              className="mb-4 break-inside-avoid animate-pulse rounded-xl bg-muted"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
