"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/dashboard/PageHeader"

export default function DashboardSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userOrg, setUserOrg] = useState("")
  const [partnerType, setPartnerType] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || "")
        setUserEmail(user.email || "")
        setUserOrg(user.user_metadata?.organization_name || "")
        setPartnerType(user.user_metadata?.partner_type || "")
      }
      setIsLoading(false)
    }
    loadUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

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
            <p className="text-sm font-medium">{userEmail}</p>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Organization</label>
            <p className="text-sm font-medium">{userOrg || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Type</label>
            <p className="text-sm font-medium capitalize">{partnerType ? partnerType.replace("_", " ") : "Not set"}</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/profile")}
          className="text-sm text-primary hover:underline"
        >
          Edit profile
        </button>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
        <h2 className="font-semibold">Preferences</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Push Notifications</p>
            <p className="text-xs text-muted-foreground">Receive updates about cases and certification</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                notifications ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full max-w-xs px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="pt">Portuguese</option>
            <option value="th">Thai</option>
          </select>
        </div>
      </div>

      {/* Support */}
      <div className="glass-card p-6 rounded-lg border border-border/50 space-y-3">
        <h2 className="font-semibold">Help & Support</h2>
        <div className="space-y-2">
          <button
            onClick={() => router.push("/support")}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors text-left"
          >
            <span className="text-sm">Support Center</span>
            <span className="text-muted-foreground text-sm">&rarr;</span>
          </button>
          <button
            onClick={() => window.open("mailto:partners@tourist-sos.com?subject=Feedback", "_blank")}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors text-left"
          >
            <span className="text-sm">Send Feedback</span>
            <span className="text-muted-foreground text-sm">&rarr;</span>
          </button>
          <button
            onClick={() => router.push("/about")}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors text-left"
          >
            <span className="text-sm">About SOS Safety</span>
            <span className="text-muted-foreground text-sm">&rarr;</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">SOS Safety v1.0.0</p>
    </div>
  )
}
