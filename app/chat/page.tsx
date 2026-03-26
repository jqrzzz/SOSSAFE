"use client"

import { SosaChat } from "@/components/SosaChat"
import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="default" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Safety</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/sign-up"
                className="btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300"
              >
                Get Certified
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* SOSA Chat full experience */}
      <main className="flex-1">
        <SosaChat />
      </main>
    </div>
  )
}
