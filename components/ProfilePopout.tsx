"use client"
import { CloseIcon, ShareIcon, QRCodeIcon } from "@/components/icons"

interface ProfilePopoutProps {
  showProfilePopout: boolean
  setShowProfilePopout: (show: boolean) => void
  profileTab: "my-code" | "scan-code"
  setProfileTab: (tab: "my-code" | "scan-code") => void
}

export function ProfilePopout({
  showProfilePopout,
  setShowProfilePopout,
  profileTab,
  setProfileTab,
}: ProfilePopoutProps) {
  if (!showProfilePopout) return null

  return (
    <div className="fixed inset-0 bg-[var(--overlay-dark)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 w-full max-w-md shadow-2xl">
        <div className="border-b border-border/50">
          <div className="flex items-center">
            <div className="flex flex-1">
              <button
                onClick={() => setProfileTab("my-code")}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  profileTab === "my-code"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                My code
              </button>
              <button
                onClick={() => setProfileTab("scan-code")}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  profileTab === "scan-code"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Scan code
              </button>
            </div>
            <button
              onClick={() => setShowProfilePopout(false)}
              className="p-2 m-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {profileTab === "my-code" && (
          <div className="p-6 text-center">
            <div className="mb-8">
              <div className="relative inline-block mb-4">
                <img
                  src="/placeholder.svg?height=80&width=80"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-primary/20 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--status-online)] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold gradient-text mb-1">Sarah Johnson</h3>
              <div className="flex justify-center gap-2 mb-4">
                <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full border font-medium">
                  Barcelona, Spain
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-2 bg-muted p-4 rounded-lg border">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium text-foreground">Hotel Manager</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Grand Resort</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-[var(--qr-background)] p-6 rounded-xl shadow-sm border border-[var(--qr-border)] mb-6">
              <div className="w-48 h-48 bg-muted rounded-lg mx-auto flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-2 flex items-center justify-center">
                    <QRCodeIcon />
                  </div>
                  <p className="text-xs text-muted-foreground">Tourist SOS ID</p>
                </div>
              </div>
            </div>

            {/* Share Actions */}
            <div className="space-y-3">
              <button
                className="btn-primary-gradient w-full flex items-center justify-center gap-2 p-3 rounded-lg"
                onClick={() => {
                  navigator.clipboard.writeText("https://touristsos.app/id/sarah-chen")
                  if (navigator.share) {
                    navigator.share({
                      title: "My Tourist SOS ID",
                      url: "https://touristsos.app/id/sarah-chen",
                    })
                  }
                }}
              >
                <ShareIcon />
                Share Profile
              </button>
            </div>
          </div>
        )}

        {profileTab === "scan-code" && (
          <div className="p-6">
            <div
              className="relative bg-[var(--scanner-overlay)] rounded-xl overflow-hidden mb-6"
              style={{ aspectRatio: "4/3" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <p className="text-white text-sm">Scan a Tourist SOS QR code</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
