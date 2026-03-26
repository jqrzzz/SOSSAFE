"use client"
import { useState, useEffect } from "react"
import { BellIcon, XIcon } from "@/components/icons"

interface PushNotificationPermissionProps {
  onPermissionGranted?: () => void
  onPermissionDenied?: () => void
}

export function PushNotificationPermission({
  onPermissionGranted,
  onPermissionDenied,
}: PushNotificationPermissionProps) {
  const [showModal, setShowModal] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Check current permission status
    if ("Notification" in window) {
      setPermission(Notification.permission)

      // Show modal if permission is default and user hasn't been asked recently
      const lastAsked = localStorage.getItem("notification-permission-asked")
      const now = Date.now()
      const oneWeek = 7 * 24 * 60 * 60 * 1000

      if (Notification.permission === "default" && (!lastAsked || now - Number.parseInt(lastAsked) > oneWeek)) {
        setShowModal(true)
      }
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setPermission(permission)
        localStorage.setItem("notification-permission-asked", Date.now().toString())

        if (permission === "granted") {
          onPermissionGranted?.()
          setShowModal(false)
        } else {
          onPermissionDenied?.()
          setShowModal(false)
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error)
        setShowModal(false)
      }
    }
  }

  const dismissModal = () => {
    setShowModal(false)
    localStorage.setItem("notification-permission-asked", Date.now().toString())
    onPermissionDenied?.()
  }

  if (!showModal || permission !== "default") {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <BellIcon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Stay Updated</h3>
          </div>
          <button onClick={dismissModal} className="p-1 hover:bg-muted rounded-full transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Get instant notifications for urgent cases, new messages, and important updates to provide the best emergency
          response.
        </p>

        <div className="flex gap-3">
          <button
            onClick={dismissModal}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={requestPermission}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  )
}
