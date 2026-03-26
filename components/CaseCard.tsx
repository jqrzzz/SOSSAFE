"use client"

import type { Case } from "@/lib/types"

interface CaseCardProps {
  case: Case
  onSelect: (caseId: string) => void
  variant?: "active" | "completed"
}

export function CaseCard({ case: caseItem, onSelect, variant = "active" }: CaseCardProps) {
  const isActive = variant === "active"

  return (
    <div
      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(caseItem.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isActive ? "gradient-primary-secondary/20" : "bg-[var(--success-status)]/20"
            }`}
          >
            <span className="text-lg">{isActive ? "🚨" : "✅"}</span>
          </div>
          <div>
            <h3 className="font-semibold gradient-text-subtle">{caseItem.title}</h3>
            <p className="text-sm text-muted-foreground">{caseItem.id}</p>
          </div>
        </div>
        {isActive && caseItem.unreadCount > 0 && (
          <div className="bg-[var(--unread-badge)] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {caseItem.unreadCount}
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">📅</span>
          <span>{caseItem.timestamp}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">💬</span>
          <span>{caseItem.messages.length} messages</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{isActive ? "🟢" : "✅"}</span>
          <span className="text-[var(--success-status)] capitalize">{caseItem.status}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {caseItem.messages[caseItem.messages.length - 1]?.text || "No messages yet"}
        </p>
      </div>
    </div>
  )
}
