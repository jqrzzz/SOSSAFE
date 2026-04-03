"use client"
import { useState } from "react"
import type React from "react"
import { BellIcon, TrashIcon, XIcon } from "@/components/icons"

interface NotificationsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all")
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: "New Case Assigned",
      message: "Emergency case #2024-001 requires immediate attention.",
      time: "5 min ago",
      type: "urgent",
      unread: true,
      caseId: "2024-001",
    },
    {
      id: 2,
      title: "Message from Dr. Smith",
      message: "Patient update: Vitals are stable, continuing treatment.",
      time: "1 hour ago",
      type: "message",
      unread: true,
      caseId: "2024-002",
    },
    {
      id: 3,
      title: "Location Update",
      message: "Tourist location shared: Hotel Marriott, Room 205.",
      time: "2 hours ago",
      type: "location",
      unread: false,
      caseId: "2024-003",
    },
    {
      id: 4,
      title: "Case Completed",
      message: "Emergency case #2024-002 has been successfully resolved.",
      time: "1 day ago",
      type: "success",
      unread: false,
      caseId: "2024-002",
    },
    {
      id: 5,
      title: "System Update",
      message: "Tourist SOS has been updated with new features.",
      time: "2 days ago",
      type: "info",
      unread: false,
    },
  ])

  const filteredNotifications = notificationsList.filter((notification) => {
    if (filter === "unread") return notification.unread
    if (filter === "urgent") return notification.type === "urgent"
    return true
  })

  const handleNotificationClick = (notification: (typeof notificationsList)[0]) => {
    // Mark as read when clicked
    setNotificationsList((prev) => prev.map((n) => (n.id === notification.id ? { ...n, unread: false } : n)))

    // Close drawer and navigate
    onClose()

    // Navigate based on notification type
    switch (notification.type) {
      case "urgent":
      case "message":
      case "location":
        if (notification.caseId) {
          window.location.href = `/?case=${notification.caseId}`
        }
        break
      case "success":
        window.location.href = "/dashboard/cases"
        break
      case "info":
        window.location.href = "/dashboard/settings"
        break
      default:
        window.location.href = "/dashboard"
    }
  }

  const deleteNotification = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotificationsList((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background border-l border-border/50 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold gradient-text">Notifications</h2>
            {notificationsList.filter((n) => n.unread).length > 0 && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                {notificationsList.filter((n) => n.unread).length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted/50 transition-colors"
            aria-label="Close notifications"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex gap-2">
            {(["all", "unread", "urgent"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === filterType
                    ? "bg-notification-filter-active text-white border border-notification-filter-active"
                    : "bg-muted/30 hover:bg-muted/50 text-foreground"
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === "unread" && notificationsList.filter((n) => n.unread).length > 0 && (
                  <span className="ml-1.5 px-1 py-0.5 rounded-full text-xs font-medium bg-notification-filter-active-dark text-white">
                    {notificationsList.filter((n) => n.unread).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          {notificationsList.some((n) => n.unread) && (
            <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary/80 transition-colors">
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`glass-card p-3 rounded-lg transition-all hover:bg-muted/20 cursor-pointer group ${
                  notification.unread ? "border-l-2 border-l-primary" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.type === "urgent"
                        ? "bg-notification-urgent"
                        : notification.type === "message"
                          ? "bg-notification-message"
                          : notification.type === "location"
                            ? "bg-notification-location"
                            : notification.type === "success"
                              ? "bg-notification-success"
                              : "bg-notification-info"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        {notification.unread && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                        >
                          <TrashIcon className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <BellIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                {filter === "unread" ? "All caught up!" : "You're all set."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
