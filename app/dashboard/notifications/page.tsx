"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatusBadge } from "@/components/dashboard/StatusBadge"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    async function loadNotifications() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Try to load from notifications table if it exists
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (!error && data) {
        setNotifications(data.map(n => ({
          id: n.id,
          title: n.title || "Notification",
          message: n.message || n.body || "",
          type: n.type || "info",
          read: n.read_at !== null,
          created_at: n.created_at,
        })))
      }
      setIsLoading(false)
    }
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const filtered = filter === "unread" ? notifications.filter(n => !n.read) : notifications

  const markAllRead = async () => {
    const supabase = createClient()
    const ids = notifications.filter(n => !n.read).map(n => n.id)
    if (ids.length > 0) {
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", ids)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      >
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary hover:underline">
            Mark all read
          </button>
        )}
      </PageHeader>

      <div className="flex gap-2">
        {(["all", "unread"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 hover:bg-muted/50 text-foreground"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-primary-foreground/20">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 rounded-lg border border-border/50 text-center">
          <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-muted-foreground">
            {filter === "unread" ? "All caught up!" : "No notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <div
              key={n.id}
              className={`glass-card p-4 rounded-lg border border-border/50 transition-colors ${
                !n.read ? "border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">{n.title}</h3>
                    <StatusBadge status={n.type} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(n.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
