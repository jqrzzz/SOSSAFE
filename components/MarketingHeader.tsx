"use client"
import Link from "next/link"
import { Logo } from "@/components/Logo"

interface MarketingHeaderProps {
  isDarkMode: boolean
  setIsDarkMode: (darkMode: boolean) => void
}

export function MarketingHeader({ isDarkMode, setIsDarkMode }: MarketingHeaderProps) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="default" />
              <span className="hidden sm:inline text-xs text-muted-foreground font-medium uppercase tracking-wide">Safety</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-background/60 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              Login
            </Link>
            <Link
              href="/auth/sign-up"
              className="btn-primary-gradient px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 premium-hover flex items-center justify-center"
            >
              Get Certified
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
