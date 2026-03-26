interface SkeletonLoaderProps {
  className?: string
  count?: number
}

export function SkeletonLoader({ className = "", count = 1 }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse bg-muted/50 rounded ${className}`} />
      ))}
    </>
  )
}

export function CaseCardSkeleton() {
  return (
    <div className="p-4 rounded-lg glass-card">
      <div className="flex items-start justify-between mb-2">
        <SkeletonLoader className="h-4 w-32" />
        <SkeletonLoader className="h-3 w-16" />
      </div>
      <SkeletonLoader className="h-3 w-24 mb-2" />
      <SkeletonLoader className="h-6 w-16" />
    </div>
  )
}
