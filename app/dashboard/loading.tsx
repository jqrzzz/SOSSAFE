export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div>
        <div className="h-8 w-48 bg-muted rounded-lg mb-2" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5 rounded-lg border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-muted mb-3" />
            <div className="h-3 w-20 bg-muted rounded mb-2" />
            <div className="h-6 w-24 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="h-5 w-40 bg-muted rounded mb-2" />
          <div className="h-3 w-56 bg-muted rounded mb-6" />
          <div className="h-[200px] bg-muted/50 rounded-lg" />
        </div>
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="h-5 w-40 bg-muted rounded mb-2" />
          <div className="h-3 w-56 bg-muted rounded mb-6" />
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-12 bg-muted rounded" />
                </div>
                <div className="h-2.5 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div>
        <div className="h-5 w-28 bg-muted rounded mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-4 rounded-lg border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-28 bg-muted rounded mb-1.5" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
