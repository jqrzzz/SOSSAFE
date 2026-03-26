"use client"

interface ThreadSummaryProps {
  replyCount: number
  lastReplyTime?: string
  onClick: () => void
}

export function ThreadSummary({ replyCount, lastReplyTime, onClick }: ThreadSummaryProps) {
  if (replyCount === 0) return null

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-xs text-muted-foreground"
    >
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-medium">
        {replyCount}
      </div>
      <span>
        {replyCount} {replyCount === 1 ? "reply" : "replies"}
        {lastReplyTime && ` • Last reply ${lastReplyTime}`}
      </span>
    </button>
  )
}
