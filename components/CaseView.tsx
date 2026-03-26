"use client"

import { StandardInput } from "@/components/StandardInput"
import { EmptyState } from "@/components/EmptyState"
import { CaseCardSkeleton } from "@/components/SkeletonLoader"
import type { Case } from "../lib/types"

interface CaseViewProps {
  cases: Case[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectCase: (caseId: string) => void
  isLoading?: boolean
  status: "active" | "completed"
}

export function CaseView({ cases, searchQuery, setSearchQuery, selectCase, isLoading = false, status }: CaseViewProps) {
  const filteredCases = cases
    .filter((c) => c.status === status)
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const statusConfig = {
    active: {
      title: "Active Cases",
      emptyIcon: "📋",
      emptyTitle: "No active cases",
      emptyDescription:
        "You don't have any active emergency cases at the moment. Start a new case when assistance is needed.",
      actionLabel: "Start New Case",
      hoverClass: "hover:bg-primary/5",
      cardOpacity: "",
    },
    completed: {
      title: "Completed Cases",
      emptyIcon: "✅",
      emptyTitle: "No completed cases",
      emptyDescription:
        "You haven't completed any emergency cases yet. Completed cases will appear here for reference.",
      actionLabel: undefined,
      hoverClass: "hover:bg-muted/5",
      cardOpacity: "opacity-75",
    },
  }

  const config = statusConfig[status]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold gradient-text mb-4">{config.title}</h1>
        <div className="relative">
          <StandardInput
            variant="search"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            showIcons={false}
            className="bg-background/80 border-2 border-border/30 focus:border-primary/50 placeholder:text-foreground/60 text-foreground shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CaseCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCases.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon="🔍"
            title="No cases found"
            description={`No ${status} cases match "${searchQuery}". Try adjusting your search terms.`}
          />
        ) : (
          <EmptyState
            icon={config.emptyIcon}
            title={config.emptyTitle}
            description={config.emptyDescription}
            actionLabel={config.actionLabel}
            onAction={config.actionLabel ? () => (window.location.href = "/") : undefined}
          />
        )
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((case_) => (
            <div
              key={case_.id}
              onClick={() => selectCase(case_.id)}
              className={`p-4 rounded-lg glass-card ${config.hoverClass} cursor-pointer transition-all duration-300 premium-hover ${config.cardOpacity}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">{case_.title}</h3>
                <span className={`text-sm ${status === "completed" ? "text-muted-foreground" : "text-foreground/70"}`}>
                  {case_.timestamp}
                </span>
              </div>
              <p className={`text-sm mb-2 ${status === "completed" ? "text-muted-foreground" : "text-foreground/70"}`}>
                Case ID: {case_.id}
              </p>
              {status === "active" && case_.unreadCount > 0 && (
                <span className="inline-block px-2 py-1 btn-primary-gradient text-sm rounded-full">
                  {case_.unreadCount} new
                </span>
              )}
              {status === "completed" && (
                <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  Completed
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
