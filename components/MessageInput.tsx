"use client"

import type React from "react"

interface MessageInputProps {
  message: string
  setMessage: (message: string) => void
  onSend: () => void
  onFileClick: () => void
  onMicClick: () => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({
  message,
  setMessage,
  onSend,
  onFileClick,
  onMicClick,
  disabled = false,
  placeholder = "Type your message here...",
}: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim()) {
      e.preventDefault()
      onSend()
    }
  }

  const hasText = message.trim().length > 0

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 safe-area-bottom z-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 bg-card rounded-full border border-border/50 px-4 py-3 shadow-lg">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60"
          />

          <button
            onClick={onFileClick}
            disabled={disabled}
            className="p-2 hover:bg-muted/50 rounded-full transition-colors disabled:opacity-50"
            aria-label="Attach file"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          {hasText ? (
            <button
              onClick={onSend}
              disabled={disabled}
              className="flex items-center justify-center p-2 hover:bg-primary/90 bg-primary rounded-full transition-colors disabled:opacity-50"
              aria-label="Send message"
            >
              <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={onMicClick}
              disabled={disabled}
              className="p-2 hover:bg-muted/50 rounded-full transition-colors disabled:opacity-50"
              aria-label="Record voice message"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
