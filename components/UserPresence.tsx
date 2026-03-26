"use client"
import { Circle } from "lucide-react"

interface UserPresenceProps {
  status: "online" | "offline" | "away" | "busy"
  lastSeen?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function UserPresence({ status, lastSeen, size = "sm", showText = false }: UserPresenceProps) {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "away":
        return "text-yellow-500"
      case "busy":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      case "busy":
        return "Busy"
      case "offline":
        return lastSeen ? `Last seen ${lastSeen}` : "Offline"
      default:
        return "Unknown"
    }
  }

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <div className="flex items-center gap-1">
      <Circle className={`${sizeClasses[size]} ${getStatusColor()} fill-current`} />
      {showText && <span className="text-xs text-muted-foreground">{getStatusText()}</span>}
    </div>
  )
}
