"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { MarketingHeader } from "@/components/MarketingHeader"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset your password</h1>
            <p className="text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl border border-border/50">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold mb-2">Check your email</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  We sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                  Click the link in the email to set a new password.
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="premium-input w-full"
                    placeholder="you@company.com"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
