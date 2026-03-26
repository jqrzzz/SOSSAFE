"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { AttachmentMenu } from "./AttachmentMenu"

interface StandardInputProps extends React.ComponentProps<"input"> {
  variant?: "chat" | "search"
  showIcons?: boolean
  showLocationSharing?: boolean
  onMicrophoneClick?: () => void
  onPictureClick?: () => void
  onFileClick?: () => void
  onLocationClick?: () => void
  onSendClick?: () => void
}

const StandardInput = forwardRef<HTMLInputElement, StandardInputProps>(
  (
    {
      className,
      variant = "search",
      showIcons = true,
      showLocationSharing = false,
      onMicrophoneClick,
      onPictureClick,
      onFileClick,
      onLocationClick,
      onSendClick,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "w-full rounded-full premium-input focus:outline-none transition-all duration-300 text-sm sm:text-base touch-manipulation font-medium resize-none px-4 py-3.5 sm:px-5 sm:py-4"

    const variantClasses = {
      chat: "ai-input-glow pl-5 pr-16 sm:pl-6 sm:pr-20 min-h-[48px] sm:min-h-[52px] shadow-lg",
      search: "search-glow pl-12 pr-4 sm:pl-14 sm:pr-5 min-h-[44px] sm:min-h-[48px] shadow-md",
    }

    const hasText = props.value && typeof props.value === "string" && props.value.trim().length > 0

    return (
      <div className="relative">
        {/* Search Icon for search variant */}
        {variant === "search" && (
          <svg
            className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-5 sm:h-5 text-primary/70 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}

        <input
          ref={ref}
          className={cn(baseClasses, variantClasses[variant], className)}
          placeholder={props.placeholder || "Type message..."}
          autoComplete="off"
          autoCapitalize="sentences"
          autoCorrect="on"
          spellCheck="true"
          {...props}
        />

        {/* Icons for chat variant */}
        {variant === "chat" && showIcons && (
          <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <AttachmentMenu
              onCameraClick={onPictureClick}
              onPhotoClick={onPictureClick}
              onFileClick={onFileClick}
              onLocationClick={onLocationClick}
              showLocationSharing={showLocationSharing}
              hasText={hasText}
            />

            {hasText ? (
              <button
                type="button"
                onClick={onSendClick}
                className="p-2.5 sm:p-3 rounded-full btn-primary-gradient transition-all duration-300 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center group premium-hover shadow-lg touch-manipulation"
                title="Send message"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                type="button"
                onClick={onMicrophoneClick}
                className="p-2.5 sm:p-3 rounded-full hover:bg-secondary/10 active:bg-secondary/20 transition-all duration-300 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center group premium-hover touch-manipulation"
                title="Voice message"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-secondary transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
        )}
      </div>
    )
  },
)

StandardInput.displayName = "StandardInput"

export { StandardInput }
