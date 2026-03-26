"use client"
import { PhoneIcon, VideoIcon } from "@/components/icons"
import { useClickOutside } from "@/hooks/use-click-outside"

interface CallMenuProps {
  participants: Array<{ id: string; name: string; role?: string }>
  onVoiceCall: (participantId?: string) => void
  onVideoCall: (participantId?: string) => void
  onClose: () => void
  isOpen: boolean
}

export function CallMenu({ participants, onVoiceCall, onVideoCall, onClose, isOpen }: CallMenuProps) {
  const menuRef = useClickOutside<HTMLDivElement>(onClose)

  if (!isOpen) return null

  const handleCallAll = (isVideo: boolean) => {
    if (isVideo) {
      onVideoCall()
    } else {
      onVoiceCall()
    }
    onClose()
  }

  const handleCallIndividual = (participantId: string, isVideo: boolean) => {
    if (isVideo) {
      onVideoCall(participantId)
    } else {
      onVoiceCall(participantId)
    }
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden"
    >
      <div className="p-2">
        {/* Call All Options */}
        <div className="mb-2">
          <button
            onClick={() => handleCallAll(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/30 transition-colors text-left"
          >
            <div className="p-1.5 rounded-md gradient-secondary-primary">
              <PhoneIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-sm">Call All Participants</div>
              <div className="text-xs text-muted-foreground">{participants.length} people</div>
            </div>
          </button>

          <button
            onClick={() => handleCallAll(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/30 transition-colors text-left"
          >
            <div className="p-1.5 rounded-md gradient-primary-tourist">
              <VideoIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-sm">Video Call All</div>
              <div className="text-xs text-muted-foreground">Start group video call</div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 my-2"></div>

        {/* Individual Participants */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Call Individual
          </div>
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/20"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full gradient-secondary-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{participant.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{participant.name}</div>
                  {participant.role && <div className="text-xs text-muted-foreground">{participant.role}</div>}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleCallIndividual(participant.id, false)}
                  className="p-1.5 rounded-md hover:bg-muted/30 transition-colors"
                  title={`Call ${participant.name}`}
                >
                  <PhoneIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  onClick={() => handleCallIndividual(participant.id, true)}
                  className="p-1.5 rounded-md hover:bg-muted/30 transition-colors"
                  title={`Video call ${participant.name}`}
                >
                  <VideoIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
