"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Admin portal is not yet available
    setTimeout(() => {
      setIsLoading(false)
      setError("Admin portal is coming soon. Please use the demo to preview admin features.")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <p className="text-muted-foreground mt-2">Admin Portal</p>
        </div>

        <div className="glass-card p-6 rounded-lg border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter admin email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary-gradient py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Admin Sign In"}
            </button>
          </form>

          <div className="mt-4">
            <Link
              href="/admin/demo"
              className="w-full block text-center py-3 border border-border rounded-lg font-medium text-foreground hover:bg-muted/50 transition-all duration-300"
            >
              Try Demo
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-muted-foreground/80 transition-colors"
            >
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
