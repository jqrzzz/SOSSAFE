"use client"

import { useState, useEffect } from "react"
import { VideoIcon, MicIcon, MicOffIcon, VideoOffIcon, XIcon } from "@/components/icons"
import { formatDuration } from "@/lib/shared-utils"

interface ActiveCallOverlayProps {
  isOpen: boolean
  participants: string[]
  callType: "voice" | "video"
  onEndCall: () => void
}

export const ActiveCallOverlay = ({ isOpen, participants, callType, onEndCall }: ActiveCallOverlayProps) => {
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setDuration(0)
      return
    }

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[var(--overlay-dark)] backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Call Info Header */}
        <div className="p-6 text-center text-white">
          <h3 className="text-xl font-semibold mb-2">{callType === "voice" ? "Voice Call" : "Video Call"}</h3>
          <p className="text-white/80 mb-2">{participants.join(", ")}</p>
          <p className="text-white/60 text-sm">{formatDuration(duration)}</p>
        </div>

        {/* Video Area (for video calls) */}
        {callType === "video" && (
          <div className="flex-1 bg-muted rounded-lg mx-4 mb-4 flex items-center justify-center">
            <div className="text-white/60 text-center">
              <VideoIcon className="w-16 h-16 mx-auto mb-4" />
              <p>Video preview would appear here</p>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="p-6">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all duration-300 min-w-[64px] min-h-[64px] flex items-center justify-center group premium-hover shadow-lg ${
                isMuted
                  ? "bg-[var(--call-button-muted)] hover:bg-[var(--call-button-muted)]/80"
                  : "bg-[var(--call-button-normal)] hover:bg-[var(--call-button-normal)]/50"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOffIcon className="w-6 h-6 text-white" /> : <MicIcon className="w-6 h-6 text-white" />}
            </button>

            {callType === "video" && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full transition-all duration-300 min-w-[64px] min-h-[64px] flex items-center justify-center group premium-hover shadow-lg ${
                  isVideoOff
                    ? "bg-[var(--call-button-muted)] hover:bg-[var(--call-button-muted)]/80"
                    : "bg-[var(--call-button-normal)] hover:bg-[var(--call-button-normal)]/50"
                }`}
                title={isVideoOff ? "Turn on video" : "Turn off video"}
              >
                {isVideoOff ? (
                  <VideoOffIcon className="w-6 h-6 text-white" />
                ) : (
                  <VideoIcon className="w-6 h-6 text-white" />
                )}
              </button>
            )}

            <button
              onClick={onEndCall}
              className="p-4 rounded-full bg-[var(--call-button-muted)] hover:bg-[var(--call-button-muted)]/80 transition-all duration-300 min-w-[64px] min-h-[64px] flex items-center justify-center group premium-hover shadow-lg"
              title="End call"
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
