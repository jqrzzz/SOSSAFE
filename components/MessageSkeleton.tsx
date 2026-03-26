export function MessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex gap-3 animate-pulse ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar skeleton */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50" />

      <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Header skeleton */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <div className="h-3 w-16 bg-muted/50 rounded" />
          <div className="h-3 w-12 bg-muted/50 rounded" />
        </div>

        {/* Message bubble skeleton */}
        <div className={`rounded-2xl p-3 bg-muted/30 ${isUser ? "rounded-br-md" : "rounded-bl-md"}`}>
          <div className="space-y-2">
            <div className="h-4 bg-muted/50 rounded w-full" />
            <div className="h-4 bg-muted/50 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
