"use client"

import Link from "next/link"

interface TrialBannerProps {
  subscriptionStatus: string
  trialEndsAt: string | null
}

export function TrialBanner({ subscriptionStatus, trialEndsAt }: TrialBannerProps) {
  if (subscriptionStatus === "active") return null

  const now = new Date()
  const trialEnd = trialEndsAt ? new Date(trialEndsAt) : null
  const daysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null

  const isExpired = subscriptionStatus === "expired" || (daysLeft !== null && daysLeft <= 0)
  const isUrgent = daysLeft !== null && daysLeft <= 5 && !isExpired

  if (isExpired) {
    return (
      <div className="bg-red-600 text-white px-4 py-3 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-medium text-center sm:text-left">
            Your free trial has ended. Subscribe to restore full access to your dashboard and keep your certification active.
          </p>
          <Link
            href="/dashboard/settings/billing"
            className="px-4 py-1.5 rounded-lg bg-white text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex-shrink-0"
          >
            Subscribe Now
          </Link>
        </div>
      </div>
    )
  }

  if (subscriptionStatus === "past_due") {
    return (
      <div className="bg-yellow-600 text-white px-4 py-3 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-medium text-center sm:text-left">
            Your payment is past due. Please update your billing information to keep your subscription active.
          </p>
          <Link
            href="/dashboard/settings/billing"
            className="px-4 py-1.5 rounded-lg bg-white text-yellow-600 text-sm font-medium hover:bg-yellow-50 transition-colors flex-shrink-0"
          >
            Update Billing
          </Link>
        </div>
      </div>
    )
  }

  if (subscriptionStatus === "trialing" && daysLeft !== null) {
    return (
      <div className={`${isUrgent ? "bg-yellow-600" : "bg-primary"} text-white px-4 py-2.5 print:hidden`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-center sm:text-left">
            {isUrgent ? (
              <span className="font-medium">
                Your free trial ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}. Subscribe to keep your certification active.
              </span>
            ) : (
              <span>
                Free trial — <span className="font-medium">{daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining</span>.
                Full access to all features.
              </span>
            )}
          </p>
          <Link
            href="/dashboard/settings/billing"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
              isUrgent
                ? "bg-white text-yellow-600 hover:bg-yellow-50"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {isUrgent ? "Subscribe Now" : "View Plans"}
          </Link>
        </div>
      </div>
    )
  }

  return null
}
