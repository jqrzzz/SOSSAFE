"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SubscriptionGateProps {
  subscriptionStatus: string
  trialEndsAt: string | null
  children: React.ReactNode
}

// Pages that must remain interactive even when subscription is expired
const UNGATED_PATHS = ["/dashboard/settings/billing", "/dashboard/settings"]

export function SubscriptionGate({ subscriptionStatus, trialEndsAt, children }: SubscriptionGateProps) {
  const pathname = usePathname()
  const isActive = subscriptionStatus === "active"
  const isTrialing = subscriptionStatus === "trialing"
  const trialEnd = trialEndsAt ? new Date(trialEndsAt) : null
  const trialExpired = trialEnd ? trialEnd.getTime() < Date.now() : false
  const isExpired = subscriptionStatus === "expired" || (isTrialing && trialExpired)

  // Active or valid trial — render normally
  if (isActive || (isTrialing && !trialExpired)) {
    return <>{children}</>
  }

  // Billing and settings pages must stay interactive so users can subscribe
  const isUngated = UNGATED_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))

  // Expired trial or cancelled — soft gate with read-only overlay
  if (isExpired || subscriptionStatus === "cancelled") {
    return (
      <div className="relative">
        {/* Persistent subscribe prompt */}
        <div className="mb-6 p-5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Dashboard is in read-only mode</p>
                <p className="text-sm text-red-600/80 dark:text-red-400/70 mt-0.5">
                  Your free trial has ended. Subscribe to restore full access — your data and certification progress are preserved.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/settings/billing"
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex-shrink-0"
            >
              Subscribe Now
            </Link>
          </div>
        </div>

        {isUngated ? (
          children
        ) : (
          /* Read-only content — disable interactions */
          <div className="pointer-events-none opacity-60 select-none" aria-disabled="true">
            {children}
          </div>
        )}
      </div>
    )
  }

  // Past due — show content with a warning but don't gate
  return <>{children}</>
}
