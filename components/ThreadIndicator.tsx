"use client"

interface ThreadIndicatorProps {
  depth: number
  hasReplies: boolean
  isCollapsed?: boolean
  onToggle?: () => void
}

export function ThreadIndicator({ depth, hasReplies, isCollapsed, onToggle }: ThreadIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Thread depth indicators */}
      {depth > 0 && (
        <div className="flex items-center">
          {Array.from({ length: depth }).map((_, i) => (
            <div key={i} className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-secondary/30 mr-2" />
          ))}
        </div>
      )}

      {/* Thread toggle button */}
      {hasReplies && (
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <div
            className={`w-3 h-3 border border-primary/50 rounded-sm flex items-center justify-center transition-transform ${isCollapsed ? "rotate-0" : "rotate-90"}`}
          >
            <div className="w-1 h-1 bg-primary rounded-full" />
          </div>
          <span>{isCollapsed ? "Show" : "Hide"} replies</span>
        </button>
      )}
    </div>
  )
}
