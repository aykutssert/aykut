export function ProductProductsSkeleton() {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="mb-4 break-inside-avoid overflow-hidden rounded-md border border-border bg-background">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="border-t border-border p-3">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-full animate-pulse rounded bg-muted" />
            <div className="mt-1.5 h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex justify-end gap-1 border-t border-border px-2 py-2">
            <div className="h-7 w-14 animate-pulse rounded-md bg-muted" />
            <div className="h-7 w-14 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
