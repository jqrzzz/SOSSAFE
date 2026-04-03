const variants: Record<string, string> = {
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  certified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  in_review: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  medical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  hospitality: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  tour: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  online: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  offline: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
}

const fallback = "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400"

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/[\s-]+/g, "_")
  const colors = variants[key] || fallback
  const displayLabel = label || status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors} ${className}`}>
      {displayLabel}
    </span>
  )
}
