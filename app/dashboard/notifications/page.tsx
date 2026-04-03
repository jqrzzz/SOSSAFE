"use client"

import { useState } from "react"

const initialNotifications = [
  { id: 1, title: "New Case Assigned", message: "Emergency case #2024-001 requires immediate attention.", time: "5 min ago", type: "urgent", unread: true },
  { id: 2, title: "Message from Dr. Smith", message: "Patient update: Vitals are stable, continuing treatment.", time: "1 hour ago", type: "message", unread: true },
  { id: 3, title: "Location Update", message: "Tourist location shared: Hotel Marriott, Room 205.", time: "2 hours ago", type: "location", unread: false },
  { id: 4, title: "Case Completed", message: "Emergency case #2024-002 has been successfully resolved.", time: "1 day ago", type: "success", unread: false },
  { id: 5, title: "System Update", message: "SOS Safety has been updated with new features.", time: "2 days ago", type: "info", unread: false },
]

const typeDotColor: Record<string, string> = {
  urgent: "bg-red-500",
  message: "bg-blue-500",
  location: "bg-yellow-500",
  success: "bg-green-500",
  info: "bg-gray-400",
}

export default function DashboardNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all")
  const [notifications, setNotifications] = useState(initialNotifications)

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return n.unread
    if (filter === "urgent") return n.type === "urgent"
    return true
  })

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary hover:underline">
            Mark all read
          </button>
        )}
      </div>

      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-sm">
        Preview mode — notifications will be connected in a future update.
      </div>

      <div className="flex gap-2">
        {(["all", "unread", "urgent"] as const).map((f) => (
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

      <div className="space-y-2">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`glass-card p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/20 transition-colors group ${
              n.unread ? "border-l-2 border-l-primary" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${typeDotColor[n.type] || "bg-gray-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-medium text-sm">{n.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(n.id) }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-muted-foreground">
            {filter === "unread" ? "All caught up!" : "No notifications."}
          </p>
        </div>
      )}
    </div>
  )
}
