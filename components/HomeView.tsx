"use client"

import { StandardInput } from "@/components/StandardInput"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ClipboardIcon, UsersIcon, AlertTriangleIcon } from "@/components/icons"
import { useState } from "react"

interface HomeViewProps {
  navigateToActiveCases: () => void
  navigateToContacts: () => void
  startNewCase: () => void
}

export function HomeView({ navigateToActiveCases, navigateToContacts, startNewCase }: HomeViewProps) {
  const [homeMessage, setHomeMessage] = useState("")
  const [isStartingCase, setIsStartingCase] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleHomeSend = async () => {
    if (homeMessage.trim()) {
      setIsStartingCase(true)
      setTimeout(() => {
        startNewCase()
        setHomeMessage("")
        setIsStartingCase(false)
      }, 1000)
    }
  }

  const handleLocationClick = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const locationMessage = `📍 My location: https://maps.google.com/?q=${latitude},${longitude}`
          setHomeMessage(locationMessage)
          setIsGettingLocation(false)
          // Location acquired
        },
        (error) => {
          setHomeMessage("Unable to get your location. Please check your browser settings.")
          setIsGettingLocation(false)
        },
      )
    } else {
      setHomeMessage("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-sm w-full space-y-4">
          <div className="grid gap-3">
            <button
              onClick={navigateToActiveCases}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white"
            >
              <div className="p-2 rounded-lg bg-white/20">
                <ClipboardIcon />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Active Cases</h3>
                <p className="text-sm text-white">View ongoing emergencies</p>
              </div>
            </button>

            <button
              onClick={navigateToContacts}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] bg-teal-600 hover:bg-teal-700 text-white"
            >
              <div className="p-2 rounded-lg bg-white/20">
                <UsersIcon />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">My Contacts</h3>
                <p className="text-sm text-white">View or Manage Contacts</p>
              </div>
            </button>

            <button
              onClick={startNewCase}
              disabled={isStartingCase}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white"
            >
              <div className="p-2 rounded-lg bg-white/20">
                {isStartingCase ? <LoadingSpinner size="sm" /> : <AlertTriangleIcon />}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">{isStartingCase ? "Starting Case..." : "Start New Case"}</h3>
                <p className="text-sm text-white">Launch Chat and Connect</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-border/50 bg-background/98 backdrop-blur-md">
        <div className="max-w-2xl mx-auto">
          <StandardInput
            id="home-input"
            variant="chat"
            placeholder="Type your message here..."
            autoFocus
            value={homeMessage}
            onChange={(e) => setHomeMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && homeMessage.trim() && !isStartingCase) {
                handleHomeSend()
              }
            }}
            onMicrophoneClick={() => {}}
            onPictureClick={() => {}}
            onSendClick={handleHomeSend}
            showLocationSharing={true}
            onLocationClick={handleLocationClick}
            disabled={isStartingCase}
          />
          {isGettingLocation && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <LoadingSpinner size="sm" />
              Getting your location...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
