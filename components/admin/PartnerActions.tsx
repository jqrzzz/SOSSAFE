"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface PartnerActionsProps {
  partnerId: string
  subscriptionStatus: string
  trialEndsAt: string | null
}

export function PartnerActions({ partnerId, subscriptionStatus, trialEndsAt }: PartnerActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  async function doAction(action: string, value?: string | number) {
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/partner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, action, value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      setMessage({ type: "success", text: `Done — ${action.replace("_", " ")} applied.` })
      router.refresh()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card p-5 rounded-lg border border-orange-200 dark:border-orange-800/50 space-y-4">
      <h2 className="font-semibold text-orange-600 dark:text-orange-400 text-sm flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Actions
      </h2>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === "success"
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Extend Trial */}
        <button
          onClick={() => doAction("extend_trial", 30)}
          disabled={isLoading}
          className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          {isLoading ? "..." : "+30 Days Trial"}
        </button>
        <button
          onClick={() => doAction("extend_trial", 14)}
          disabled={isLoading}
          className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          {isLoading ? "..." : "+14 Days Trial"}
        </button>

        {/* Set Status */}
        {subscriptionStatus !== "active" && (
          <button
            onClick={() => doAction("set_status", "active")}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "..." : "Mark Active"}
          </button>
        )}
        {subscriptionStatus !== "trialing" && (
          <button
            onClick={() => doAction("set_status", "trialing")}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "..." : "Reset to Trialing"}
          </button>
        )}
        {subscriptionStatus !== "expired" && (
          <button
            onClick={() => doAction("set_status", "expired")}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            {isLoading ? "..." : "Mark Expired"}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        These actions take effect immediately. Use &quot;Mark Active&quot; for early adopters or manual deals before Stripe is connected.
      </p>
    </div>
  )
}
