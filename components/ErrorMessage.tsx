"use client"

import type React from "react"
import { XIcon } from "./icons"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  type?: "error" | "warning" | "info"
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, onDismiss, type = "error" }) => {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return "⚠️"
      case "info":
        return "ℹ️"
      default:
        return "❌"
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-red-50 border-red-200 text-red-800"
    }
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${getBgColor()}`}>
      <span className="text-lg">{getIcon()}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs px-2 py-1 rounded bg-white/50 hover:bg-white/80 transition-colors font-medium"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 rounded hover:bg-white/50 transition-colors">
            <XIcon />
          </button>
        )}
      </div>
    </div>
  )
}
