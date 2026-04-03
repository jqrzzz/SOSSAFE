"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

import type { Case } from "../lib/types"
import { MenuIcon, PlusIcon, BellIcon, PhoneIcon, VideoIcon } from "@/components/icons"
import { CallMenu } from "./CallMenu"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  navigateToHome: () => void
  setShowProfilePopout: (show: boolean) => void
  currentCase: Case | undefined
  setShowAddPeople: (show: boolean) => void
  showNotifications?: boolean
  showMyId?: boolean
  onVoiceCall?: (participantId?: string) => void
  onVideoCall?: (participantId?: string) => void
  showCallButtons?: boolean
  caseParticipants?: Array<{ id: string; name: string; role?: string }>
  unreadNotificationCount?: number
  setShowNotifications?: (show: boolean) => void
}

export function Header({
  setSidebarOpen,
  navigateToHome,
  setShowProfilePopout,
  currentCase,
  setShowAddPeople,
  showNotifications = false,
  showMyId = false,
  onVoiceCall = () => {},
  onVideoCall = () => {},
  showCallButtons = false,
  caseParticipants = [],
  unreadNotificationCount = 0,
  setShowNotifications,
}: HeaderProps) {
  const [showCallMenu, setShowCallMenu] = useState(false)
  const router = useRouter()

  const handleVoiceCall = (participantId?: string) => {
    onVoiceCall(participantId)
  }

  const handleVideoCall = (participantId?: string) => {
    onVideoCall(participantId)
  }

  const isGroupChat = caseParticipants.length > 1

  const handleNotificationsClick = () => {
    if (setShowNotifications) {
      setShowNotifications(true)
    } else {
      // Fallback to navigation if prop not provided
      router.push("/dashboard/notifications")
    }
  }

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border/50 bg-card/50 backdrop-blur-xl relative safe-area-top">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-muted/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <button
          onClick={navigateToHome}
          className="text-sm sm:text-base font-bold text-foreground hover:opacity-80 transition-opacity tracking-tight truncate min-h-[44px] flex items-center touch-manipulation"
        >
          <span className="gradient-text-brand">SOS SAFETY by Tourist SOS</span>
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 relative">
        {showCallButtons && currentCase && (
          <div className="relative">
            {isGroupChat ? (
              <button
                onClick={() => setShowCallMenu(!showCallMenu)}
                className="p-2 sm:p-2.5 rounded-md btn-primary-gradient transition-all duration-300 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center group premium-hover shadow-lg touch-manipulation"
                title="Call options"
                aria-label="Call options"
              >
                <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleVoiceCall()}
                  className="p-2 sm:p-2.5 rounded-md btn-primary-gradient transition-all duration-300 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center group premium-hover shadow-lg touch-manipulation"
                  title="Start voice call"
                  aria-label="Start voice call"
                >
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                <button
                  onClick={() => handleVideoCall()}
                  className="p-2 sm:p-2.5 rounded-md btn-primary-gradient transition-all duration-300 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center group premium-hover shadow-lg touch-manipulation"
                  title="Start video call"
                  aria-label="Start video call"
                >
                  <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            )}

            {isGroupChat && (
              <CallMenu
                participants={caseParticipants}
                onVoiceCall={handleVoiceCall}
                onVideoCall={handleVideoCall}
                onClose={() => setShowCallMenu(false)}
                isOpen={showCallMenu}
              />
            )}
          </div>
        )}

        {showMyId && (
          <button
            onClick={() => setShowProfilePopout(true)}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground border border-border/50 rounded-md hover:bg-muted/30 transition-colors min-h-[44px] flex items-center touch-manipulation"
            aria-label="My ID"
          >
            <span className="hidden sm:inline">My ID</span>
            <span className="sm:hidden">ID</span>
          </button>
        )}

        {showNotifications && (
          <button
            onClick={handleNotificationsClick}
            className="p-2 sm:p-2.5 rounded-md hover:bg-muted/30 transition-all duration-200 relative min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center touch-manipulation"
            aria-label="Notifications"
          >
            <span className="gradient-text-brand">
              <BellIcon className="w-5 h-5" />
            </span>
            {unreadNotificationCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold leading-none">
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                </span>
              </div>
            )}
          </button>
        )}

        {currentCase && (
          <button
            onClick={() => setShowAddPeople(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium bg-muted/30 hover:bg-muted/50 text-foreground border border-border/30 transition-colors min-h-[44px] touch-manipulation"
            aria-label="Add people to case"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add People</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </div>
  )
}
