"use client"
import { PinIcon, ReplyIcon, DownloadIcon, FileTextIcon, ImageIcon, MoreHorizontalIcon } from "@/components/icons"
import { useState } from "react"
import type { Message } from "@/lib/types"
import { getRoleStyle, getReactionEmojis } from "@/lib/utils"
import { getFileIcon } from "@/lib/shared-utils"
import { useClickOutside } from "@/hooks/use-click-outside"
import { ThreadIndicator } from "./ThreadIndicator"
import { ThreadSummary } from "./ThreadSummary"
import { MessageStatus } from "./MessageStatus"
import { MessageOptions } from "./MessageOptions"

interface MessageBubbleProps {
  message: Message
  isUser: boolean
  isPinned: boolean
  messageReactions: Record<string, string[]>
  onAddReaction: (messageId: string, emoji: string) => void
  onPinMessage: (message: Message) => void
  onReplyToMessage: (message: Message) => void
  onCopyText?: (text: string) => void
  onForwardMessage?: (message: Message) => void
  isThreadCollapsed?: boolean
  onToggleThread?: (messageId: string | number) => void
  onViewThread?: (messageId: string | number) => void
  onRetryMessage?: (messageId: string | number) => void
}

export function MessageBubble({
  message,
  isUser,
  isPinned,
  messageReactions,
  onAddReaction,
  onPinMessage,
  onReplyToMessage,
  onCopyText,
  onForwardMessage,
  isThreadCollapsed = false,
  onToggleThread,
  onViewThread,
  onRetryMessage,
}: MessageBubbleProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  const messageRef = useClickOutside<HTMLDivElement>(() => setShowOptions(false))

  const getFileIconComponent = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <ImageIcon className="w-4 h-4" />
    }
    return <FileTextIcon className="w-4 h-4" />
  }

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setShowOptions(true)
      navigator.vibrate?.(50) // Haptic feedback if available
    }, 500)
    setLongPressTimer(timer)
  }

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setShowOptions(true)
    }, 500)
    setLongPressTimer(timer)
  }

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const threadDepth = message.threadDepth || 0
  const replyCount = message.replyCount || 0
  const hasReplies = replyCount > 0

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`} ref={messageRef}>
      {!isUser && threadDepth > 0 && (
        <div className="flex-shrink-0 w-8 flex justify-center">
          <ThreadIndicator depth={threadDepth} hasReplies={false} />
        </div>
      )}

      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${getRoleStyle(message.role).bgColor} flex items-center justify-center text-xs font-semibold text-white`}
      >
        {getRoleStyle(message.role).avatar}
      </div>

      <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-2 mb-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-xs font-medium text-muted-foreground">{getRoleStyle(message.role).roleLabel}</span>
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          {isPinned && <PinIcon className="w-3 h-3 text-amber-600" />}
        </div>

        {message.replyTo && (
          <div
            className={`mb-2 p-2 rounded-lg bg-muted/50 border-l-2 border-primary max-w-full ${isUser ? "self-end" : "self-start"}`}
          >
            <div className="text-xs text-muted-foreground mb-1">
              Replying to {getRoleStyle(message.replyTo.role).roleLabel}
            </div>
            <div className="text-xs text-muted-foreground truncate">{message.replyTo.content?.substring(0, 50)}...</div>
          </div>
        )}

        <div
          className={`rounded-2xl p-3 shadow-sm group relative ${
            isUser
              ? `${getRoleStyle(message.role).bgColor} ${getRoleStyle(message.role).textColor}`
              : "bg-card text-card-foreground border"
          } ${isUser ? "rounded-br-md" : "rounded-bl-md"}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <div className="relative group/reactions">
              <button className="btn-primary-gradient h-6 w-6 p-0 text-xs">😊</button>
              <div className="absolute bottom-full right-0 mb-1 opacity-0 group-hover/reactions:opacity-100 transition-opacity bg-background border rounded-lg shadow-lg p-2 flex gap-1 z-10">
                {getReactionEmojis().map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    className="h-8 w-8 p-0 hover:bg-muted rounded-lg transition-colors"
                    onClick={() => onAddReaction(message.id, emoji)}
                    title={label}
                  >
                    <span className="text-sm">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => onPinMessage(message)}
              className={`btn-primary-gradient h-6 w-6 p-0 ${isPinned ? "opacity-100" : "opacity-70"}`}
            >
              <PinIcon className="w-3 h-3" />
            </button>
            <button onClick={() => onReplyToMessage(message)} className="btn-primary-gradient h-6 w-6 p-0">
              <ReplyIcon className="w-3 h-3" />
            </button>
            <button onClick={() => setShowOptions(!showOptions)} className="btn-primary-gradient h-6 w-6 p-0">
              <MoreHorizontalIcon className="w-3 h-3" />
            </button>
          </div>

          {showOptions && (
            <MessageOptions
              message={message}
              onCopyText={onCopyText}
              onForwardMessage={onForwardMessage}
              onClose={() => setShowOptions(false)}
            />
          )}

          {message.images && message.images.length > 0 && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {message.images.map((img: string, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={img || "/placeholder.svg"}
                    alt="Attachment"
                    className="rounded-lg max-w-full h-auto max-h-40 object-cover border"
                  />
                  <div className="absolute inset-0 rounded-lg bg-black/0 hover:bg-black/10 transition-colors cursor-pointer" />
                </div>
              ))}
            </div>
          )}

          {message.files && message.files.length > 0 && (
            <div className="mb-3 space-y-2">
              {message.files.map((file: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex-shrink-0 text-primary">{getFileIcon(file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <button className="flex-shrink-0 p-1 rounded-full hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all">
                    <DownloadIcon className="w-4 h-4 text-primary" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {message.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>}

          {messageReactions && Object.keys(messageReactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border/50">
              {Object.entries(messageReactions).map(([emoji, users]) => (
                <button
                  key={emoji}
                  onClick={() => onAddReaction(message.id, emoji)}
                  className={`h-6 px-2 text-xs rounded-full border transition-all ${
                    users.includes("user")
                      ? "btn-primary-gradient border-primary/20"
                      : "bg-muted/50 border-border hover:bg-muted"
                  }`}
                >
                  <span className="mr-1">{emoji}</span>
                  <span>{users.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {hasReplies && onViewThread && (
          <ThreadSummary replyCount={replyCount} lastReplyTime="2m ago" onClick={() => onViewThread(message.id)} />
        )}

        <MessageStatus
          status={message.status || "sent"}
          timestamp={message.timestamp}
          onRetry={message.status === "failed" && onRetryMessage ? () => onRetryMessage(message.id) : undefined}
        />
      </div>
    </div>
  )
}
