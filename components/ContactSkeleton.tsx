export function ContactSkeleton() {
  return (
    <div className="p-4 rounded-lg glass-card border border-border/50 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 rounded-full bg-muted/50" />
          <div>
            {/* Name and role skeleton */}
            <div className="h-4 w-24 bg-muted/50 rounded mb-1" />
            <div className="h-3 w-20 bg-muted/50 rounded mb-1" />
            <div className="h-3 w-16 bg-muted/50 rounded" />
          </div>
        </div>
        {/* Favorite star skeleton */}
        <div className="w-4 h-4 bg-muted/50 rounded" />
      </div>

      {/* Contact info skeleton */}
      <div className="space-y-1 mb-3">
        <div className="h-3 w-32 bg-muted/50 rounded" />
        <div className="h-3 w-28 bg-muted/50 rounded" />
        <div className="h-3 w-20 bg-muted/50 rounded" />
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-6 bg-muted/50 rounded" />
        <div className="flex-1 h-6 bg-muted/50 rounded" />
        <div className="flex-1 h-6 bg-muted/50 rounded" />
      </div>
    </div>
  )
}
