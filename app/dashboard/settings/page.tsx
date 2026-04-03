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
