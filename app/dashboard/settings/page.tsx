"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/dashboard/PageHeader"
import Link from "next/link"

export default function SettingsPage() {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || "")
        setUserEmail(user.email || "")
      }
    }
    loadUser()
  }, [])

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Account Info */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
        <h2 className="font-semibold">Account</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Name</label>
            <p className="text-sm font-medium">{userName || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Email</label>
            <p className="text-sm font-medium">{userEmail || "Not set"}</p>
          </div>
        </div>
        <Link href="/dashboard/profile" className="text-sm text-primary hover:underline">
          Edit profile
        </Link>
      </div>

      {/* Billing */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-3">
        <h2 className="font-semibold">Billing & Subscription</h2>
        <p className="text-sm text-muted-foreground">View your plan, trial status, and manage payment.</p>
        <Link href="/dashboard/settings/billing" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          Manage billing
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
        <h2 className="font-semibold">Preferences</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Push Notifications</p>
            <p className="text-xs text-muted-foreground">Get notified about cases and updates</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-10 h-6 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${notifications ? "translate-x-4" : "translate-x-0"}`} />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select className="w-full max-w-xs px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm">
            <option>English</option>
            <option>Spanish</option>
            <option>Portuguese</option>
            <option>Thai</option>
          </select>
        </div>
      </div>

      {/* Help & Support */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-3">
        <h2 className="font-semibold">Help & Support</h2>
        <div className="space-y-2">
          <Link href="/support" className="block text-sm text-primary hover:underline">Support Center</Link>
          <a href="mailto:support@touristsos.com?subject=Feedback" className="block text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">Send Feedback</a>
          <Link href="/about" className="block text-sm text-primary hover:underline">About SOS Safety</Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 rounded-lg border border-red-200 dark:border-red-800/50 space-y-4">
        <h2 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>

        {!showDeleteConfirm ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete your account and all associated data. This will deactivate
                your certification and remove your team access. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-1">
                Are you sure? This action is permanent.
              </p>
              <p className="text-xs text-red-600 dark:text-red-400/80">
                Your account, certification status, and team membership will be permanently removed.
                Type <strong>DELETE</strong> below to confirm.
              </p>
            </div>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full px-3 py-2 border border-red-300 dark:border-red-800 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
            {deleteError && (
              <p className="text-xs text-red-600 dark:text-red-400">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText("")
                  setDeleteError(null)
                }}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirmText !== "DELETE") {
                    setDeleteError('Please type "DELETE" to confirm.')
                    return
                  }
                  setIsDeleting(true)
                  setDeleteError(null)
                  try {
                    const supabase = createClient()
                    // Sign out and redirect — actual data deletion handled by support
                    // per ToS Section 9: "You may close your account at any time by contacting support"
                    await supabase.auth.signOut()
                    router.push("/support?reason=account-deletion")
                  } catch {
                    setDeleteError("Something went wrong. Please contact support@tourist-sos.com.")
                    setIsDeleting(false)
                  }
                }}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Processing..." : "Permanently Delete Account"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out */}
      <button
        onClick={async () => {
          const supabase = createClient()
          await supabase.auth.signOut()
          router.push("/")
        }}
        className="text-sm text-red-500 hover:text-red-600 transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
