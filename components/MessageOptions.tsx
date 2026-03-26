"use client"

interface MessageOptionsProps {
  message: any
  onCopyText: (text: string) => void
  onForwardMessage: (message: any) => void
  onClose: () => void
}

export function MessageOptions({ message, onCopyText, onForwardMessage, onClose }: MessageOptionsProps) {
  const handleCopy = () => {
    if (message.content) {
      onCopyText(message.content)
      onClose()
    }
  }

  const handleForward = () => {
    onForwardMessage(message)
    onClose()
  }

  const CopyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )

  const ForwardIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-background border rounded-lg shadow-lg p-1 z-20 min-w-[160px]">
      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
        disabled={!message.content}
      >
        <CopyIcon />
        Copy text
      </button>
      <button
        onClick={handleForward}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
      >
        <ForwardIcon />
        Forward message
      </button>
    </div>
  )
}
