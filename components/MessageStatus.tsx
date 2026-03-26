"use client"
import { CheckIcon } from "@/components/icons"
import { Button } from "./ui/button"
import { formatTimestamp } from "@/lib/shared-utils"

interface MessageStatusProps {
  status: "sending" | "sent" | "delivered" | "read" | "failed"
  onRetry?: () => void
  timestamp?: string
}

export function MessageStatus({ status, onRetry, timestamp }: MessageStatusProps) {
  const ClockIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  const CheckCheckIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12c0 1.2-.4 2.3-1.1 3.2" />
    </svg>
  )

  const AlertCircleIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  )

  const RotateCcwIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 4v6h6m16 10v-6h-6M7.05 9.05l-3.54 3.54m0 0l3.54 3.54M7.05 9.05L10.6 5.5M16.95 14.95l3.54-3.54m0 0l-3.54-3.54m3.54 3.54L13.4 18.5"
      />
    </svg>
  )

  return (
    <div className="flex items-center gap-1 mt-1">
      {status === "sending" && (
        <>
          <ClockIcon className="text-muted-foreground animate-pulse" />
          <span className="text-xs text-muted-foreground">Sending...</span>
        </>
      )}
      {status === "sent" && (
        <>
          <CheckIcon className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{timestamp ? formatTimestamp(timestamp) : "Sent"}</span>
        </>
      )}
      {status === "delivered" && (
        <>
          <CheckCheckIcon className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{timestamp ? formatTimestamp(timestamp) : "Delivered"}</span>
        </>
      )}
      {status === "read" && (
        <>
          <CheckCheckIcon className="text-primary" />
          <span className="text-xs text-primary">{timestamp ? formatTimestamp(timestamp) : "Read"}</span>
        </>
      )}
      {status === "failed" && (
        <>
          <AlertCircleIcon className="text-destructive" />
          <span className="text-xs text-destructive">Failed</span>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 ml-1"
              onClick={onRetry}
            >
              <RotateCcwIcon className="mr-1" />
              Retry
            </Button>
          )}
        </>
      )}
    </div>
  )
}
