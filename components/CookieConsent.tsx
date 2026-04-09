"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const COOKIE_CONSENT_KEY = "sos-cookie-consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 print:hidden">
      <div className="max-w-2xl mx-auto glass-card rounded-xl border border-border/50 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1">
            We use essential cookies for authentication and security. Analytics cookies help us improve the platform.
            See our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
