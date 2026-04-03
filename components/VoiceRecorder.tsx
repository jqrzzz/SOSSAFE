"use client"

import { useState, useRef } from "react"
import { MicIcon, PlayIcon, PauseIcon, XIcon, CheckIcon } from "@/components/icons"
import { formatDuration } from "@/lib/shared-utils"

interface VoiceRecorderProps {
  isOpen: boolean
  onClose: () => void
  onSend: (duration: number) => void
}

export const VoiceRecorder = ({ isOpen, onClose, onSend }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [hasRecording, setHasRecording] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = () => {
    setIsRecording(true)
    setDuration(0)
    // Mock recording timer
    const interval = setInterval(() => {
      setDuration((prev) => {
        if (prev >= 60) {
          // Max 60 seconds
          stopRecording()
          return prev
        }
        return prev + 1
      })
    }, 1000)

    intervalRef.current = interval
  }

  const stopRecording = () => {
    setIsRecording(false)
    setHasRecording(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // Mock playback - in real implementation, this would control audio playback
  }

  const handleSend = () => {
    onSend(duration)
    handleClose()
  }

  const handleClose = () => {
    setIsRecording(false)
    setIsPlaying(false)
    setDuration(0)
    setHasRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card p-6 rounded-t-2xl w-full max-w-md mx-4 mb-0">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gradient mb-2">Voice Message</h3>
          <p className="text-muted-foreground text-sm">
            {isRecording ? "Recording..." : hasRecording ? "Recorded" : "Tap to record"}
          </p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            {!hasRecording ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-6 rounded-full transition-all duration-300 min-w-[80px] min-h-[80px] flex items-center justify-center group premium-hover shadow-lg ${
                  isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "btn-primary-gradient"
                }`}
              >
                <MicIcon className="w-8 h-8 text-white" />
              </button>
            ) : (
              <button
                onClick={togglePlayback}
                className="p-6 rounded-full btn-primary-gradient transition-all duration-300 min-w-[80px] min-h-[80px] flex items-center justify-center group premium-hover shadow-lg"
              >
                {isPlaying ? <PauseIcon className="w-8 h-8 text-white" /> : <PlayIcon className="w-8 h-8 text-white" />}
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-2xl font-mono text-gradient">{formatDuration(duration)}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 p-3 rounded-full bg-muted hover:bg-muted/80 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <XIcon className="w-5 h-5" />
            Cancel
          </button>

          {hasRecording && (
            <button
              onClick={handleSend}
              className="flex-1 p-3 rounded-full btn-primary-gradient transition-all duration-300 flex items-center justify-center gap-2 text-white"
            >
              <CheckIcon className="w-5 h-5" />
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
