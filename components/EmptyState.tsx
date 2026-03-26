"use client"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 premium-hover"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
