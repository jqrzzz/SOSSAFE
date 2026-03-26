"use client"

import type React from "react"

interface MessageErrorProps {
  onRetry: () => void
  onDismiss: () => void
}

export const MessageError: React.FC<MessageErrorProps> = ({ onRetry, onDismiss }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
      <span className="text-red-500">❌</span>
      <span className="flex-1">Failed to send message</span>
      <button
        onClick={onRetry}
        className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded transition-colors font-medium"
      >
        Retry
      </button>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-600 transition-colors">
        ✕
      </button>
    </div>
  )
}
