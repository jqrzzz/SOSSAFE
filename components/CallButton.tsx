"use client"

import { PhoneIcon, VideoIcon } from "@/components/icons"

interface CallButtonProps {
  type: "voice" | "video"
  onClick: () => void
  disabled?: boolean
}

export const CallButton = ({ type, onClick, disabled = false }: CallButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-3 rounded-full btn-primary-gradient transition-all duration-300 min-w-[48px] min-h-[48px] flex items-center justify-center group premium-hover shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      title={type === "voice" ? "Start voice call" : "Start video call"}
    >
      {type === "voice" ? <PhoneIcon className="w-5 h-5 text-white" /> : <VideoIcon className="w-5 h-5 text-white" />}
    </button>
  )
}
