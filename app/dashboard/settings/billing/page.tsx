"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { getPlan, formatPrice, TRIAL_DAYS } from "@/lib/pricing-data"
import type { PropertyType } from "@/lib/pricing-data"
import Link from "next/link"

interface SubscriptionInfo {
  subscriptionStatus: string
  trialEndsAt: string | null
  propertyType: PropertyType | null
  partnerName: string
}

export default function BillingPage() {
  const [info, setInfo] = useState<SubscriptionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBilling() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: membership } = await supabase
        .from("partner_memberships")
        .select("partner_id, role, partners(name, property_type, subscription_status, trial_ends_at)")
        .eq("user_id", user.id)
        .is("removed_at", null)
        .single()

      if (membership?.partners) {
        const partner = membership.partners as unknown as {
          name: string
          property_type: string | null
          subscription_status: string | null
          trial_ends_at: string | null
        }
        setInfo({
          subscriptionStatus: partner.subscription_status || "trialing",
          trialEndsAt: partner.trial_ends_at,
          propertyType: (partner.property_type as PropertyType) || null,
          partnerName: partner.name,
        })
      }
      setIsLoading(false)
    }
    loadBilling()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <PageHeader title="Billing & Subscription" subtitle="Manage your plan and payment" />
        <div className="glass-card p-8 rounded-lg border border-border/50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!info) {
    return (
      <div className="space-y-6 max-w-3xl">
        <PageHeader title="Billing & Subscription" subtitle="Manage your plan and payment" />
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">Unable to load billing information.</p>
        </div>
      </div>
    )
  }

  const plan = info.propertyType ? getPlan(info.propertyType) : null
  const now = new Date()
  const trialEnd = info.trialEndsAt ? new Date(info.trialEndsAt) : null
  const daysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null
  const isExpired = info.subscriptionStatus === "expired" || (daysLeft !== null && daysLeft <= 0)
  const isTrialing = info.subscriptionStatus === "trialing" && !isExpired
  const isActive = info.subscriptionStatus === "active"
  const isPastDue = info.subscriptionStatus === "past_due"

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Billing & Subscription" subtitle="Manage your plan and payment" />

      {/* Current Plan */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold">Current Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">{info.partnerName}</p>
          </div>
          <StatusBadge status={isExpired ? "expired" : info.subscriptionStatus} />
        </div>

        {plan && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{plan.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{plan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatPrice(plan.monthlyPrice)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">or {formatPrice(plan.annualPrice)}/year</p>
              </div>
            </div>
          </div>
        )}

        {/* Trial info */}
        {isTrialing && daysLeft !== null && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining in your free trial
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your {TRIAL_DAYS}-day trial {trialEnd ? `ends on ${trialEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : "is active"}.
                  Subscribe anytime to keep full access.
                </p>
              </div>
            </div>

            {/* Trial progress bar */}
            <div className="mt-3">
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, ((TRIAL_DAYS - daysLeft) / TRIAL_DAYS) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Day {TRIAL_DAYS - daysLeft} of {TRIAL_DAYS}</span>
                <span className="text-xs text-muted-foreground">{daysLeft} days left</span>
              </div>
            </div>
          </div>
        )}

        {/* Expired notice */}
        {isExpired && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Your free trial has ended</p>
                <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5">
                  Subscribe to restore full access to your dashboard. Your data and certification progress are preserved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Past due notice */}
        {isPastDue && (
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Payment past due</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400/80 mt-0.5">
                  Please update your payment method to keep your subscription active.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscribe / Manage */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
        <h2 className="font-semibold">Payment</h2>

        {isActive ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Your subscription is active
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your subscription, update payment method, or download invoices through the customer portal.
            </p>
            <button
              disabled
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium opacity-50 cursor-not-allowed"
            >
              Manage Subscription (Coming Soon)
            </button>
            <p className="text-xs text-muted-foreground">
              Stripe integration will be connected shortly. Contact <a href="mailto:support@tourist-sos.com" className="text-primary hover:underline">support@tourist-sos.com</a> for billing questions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {isExpired
                ? "Subscribe now to restore full access to your dashboard and keep your certification active."
                : "Subscribe to ensure uninterrupted access when your trial ends. No commitment — cancel anytime."}
            </p>

            {plan && (
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                  <p className="text-lg font-bold">{formatPrice(plan.monthlyPrice)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                </div>
                <div className="flex-1 p-3 rounded-lg border border-primary/50 bg-primary/5 text-center relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full">
                    Save ~17%
                  </span>
                  <p className="text-xs text-muted-foreground mb-1">Annual</p>
                  <p className="text-lg font-bold">{formatPrice(plan.annualPrice)}<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
                </div>
              </div>
            )}

            <button
              disabled
              className="w-full px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium opacity-50 cursor-not-allowed"
            >
              Subscribe (Coming Soon)
            </button>
            <p className="text-xs text-muted-foreground">
              Stripe checkout will be connected shortly. Contact <a href="mailto:support@tourist-sos.com" className="text-primary hover:underline">support@tourist-sos.com</a> for billing questions.
            </p>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-3">
        <h2 className="font-semibold">Billing FAQ</h2>
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-medium">What happens when my trial ends?</p>
            <p className="text-muted-foreground mt-0.5">Your dashboard becomes read-only. All your data, certification progress, and team setup are preserved. Subscribe anytime to restore full access.</p>
          </div>
          <div>
            <p className="font-medium">Can I change my plan?</p>
            <p className="text-muted-foreground mt-0.5">Plans are based on business type. Contact support if your business classification needs updating.</p>
          </div>
          <div>
            <p className="font-medium">How do I cancel?</p>
            <p className="text-muted-foreground mt-0.5">Cancel anytime — no commitment. Annual plans receive a prorated refund for unused months. See our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> for details.</p>
          </div>
        </div>
      </div>

      <Link href="/dashboard/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Settings
      </Link>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    trialing: { label: "Free Trial", className: "bg-primary/10 text-primary" },
    past_due: { label: "Past Due", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    expired: { label: "Expired", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
  }

  const { label, className } = config[status] || config.trialing!

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
