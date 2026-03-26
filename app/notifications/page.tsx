"use client"
import { useState, useRef } from "react"
import type React from "react"
import { PushNotificationPermission } from "@/components/PushNotificationPermission"

import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BellIcon, TrashIcon } from "@/components/icons"

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
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
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [showPushPermission, setShowPushPermission] = useState(false)

  const filteredNotifications = notificationsList.filter((notification) => {
    if (filter === "unread") return notification.unread
    if (filter === "urgent") return notification.type === "urgent"
    return true
  })

  const navigateToHome = () => {
    window.location.href = "/"
  }

  const navigateToSettings = () => {
    window.location.href = "/settings"
  }

  const navigateToActiveCases = () => {
    window.location.href = "/"
  }

  const navigateToCompletedCases = () => {
    window.location.href = "/"
  }

  const navigateToContacts = () => {
    window.location.href = "/contacts"
  }

  const selectCase = (caseId: string) => {
    window.location.href = `/?case=${caseId}`
  }

  const setViewState = (view: string) => {
    // Not needed for notifications page
  }

  const handleNotificationClick = (notification: (typeof notificationsList)[0]) => {
    // Mark as read when clicked
    setNotificationsList((prev) => prev.map((n) => (n.id === notification.id ? { ...n, unread: false } : n)))

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
        window.location.href = "/cases/completed"
        break
      case "info":
        window.location.href = "/settings"
        break
      default:
        window.location.href = "/"
    }
  }

  const deleteNotification = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotificationsList((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const handlePushPermissionGranted = () => {
    console.log("[v0] Push notifications enabled")
    // Here you would typically register the service worker and send the token to your backend
  }

  const handlePushPermissionDenied = () => {
    console.log("[v0] Push notifications denied")
  }

  return (
    <div className="flex h-screen bg-background">
      <PushNotificationPermission
        onPermissionGranted={handlePushPermissionGranted}
        onPermissionDenied={handlePushPermissionDenied}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        sidebarRef={sidebarRef}
        viewState="notifications"
        cases={[]}
        searchQuery=""
        navigateToActiveCases={navigateToActiveCases}
        navigateToCompletedCases={navigateToCompletedCases}
        navigateToContacts={navigateToContacts}
        setSidebarOpen={setSidebarOpen}
        selectCase={selectCase}
        setViewState={setViewState}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          setSidebarOpen={setSidebarOpen}
          navigateToHome={navigateToHome}
          setShowProfilePopout={() => {}}
          currentCase={undefined}
          setShowAddPeople={() => {}}
        />

        <div className="flex-1 overflow-auto p-3 sm:p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h1 className="text-lg sm:text-xl font-bold gradient-text">Notifications</h1>
                {notificationsList.filter((n) => n.unread).length > 0 && (
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                    {notificationsList.filter((n) => n.unread).length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowPushPermission(true)}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  title="Notification Settings"
                >
                  Settings
                </button>

                {notificationsList.some((n) => n.unread) && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {(["all", "unread", "urgent"] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filter === filterType
                      ? "bg-notification-filter-active text-white border border-notification-filter-active"
                      : "bg-muted/30 hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === "unread" && (
                    <span className="ml-1.5 px-1 py-0.5 rounded-full text-xs font-medium bg-notification-filter-active-dark text-white">
                      {notificationsList.filter((n) => n.unread).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`glass-card p-2.5 sm:p-3 rounded-lg transition-all hover:bg-muted/20 cursor-pointer group ${
                    notification.unread ? "border-l-2 border-l-primary" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${
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
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                        <h3 className="font-medium text-xs sm:text-sm truncate">{notification.title}</h3>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {notification.unread && (
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></div>
                          )}
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 sm:p-1 hover:bg-red-500/20 rounded transition-all"
                          >
                            <TrashIcon className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
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
      </div>
    </div>
  )
}
