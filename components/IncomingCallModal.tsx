"use client"

import { PhoneIcon, VideoIcon, XIcon } from "@/components/icons"

interface IncomingCallModalProps {
  isOpen: boolean
  callerName: string
  callType: "voice" | "video"
  onAccept: () => void
  onDecline: () => void
}

export const IncomingCallModal = ({ isOpen, callerName, callType, onAccept, onDecline }: IncomingCallModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card p-8 rounded-2xl max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
            {callType === "voice" ? (
              <PhoneIcon className="w-8 h-8 text-white" />
            ) : (
              <VideoIcon className="w-8 h-8 text-white" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gradient mb-2">Incoming {callType} call</h3>
          <p className="text-muted-foreground">{callerName}</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onDecline}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 min-w-[64px] min-h-[64px] flex items-center justify-center group premium-hover shadow-lg"
            title="Decline call"
          >
            <XIcon className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={onAccept}
            className="p-4 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 min-w-[64px] min-h-[64px] flex items-center justify-center group premium-hover shadow-lg"
            title="Accept call"
          >
            {callType === "voice" ? (
              <PhoneIcon className="w-6 h-6 text-white" />
            ) : (
              <VideoIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
