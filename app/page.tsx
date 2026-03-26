"use client"

import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col dark">
      {/* Simple header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Logo size="default" />
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
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

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-3">SOS Safe Certification Platform</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Professional safety certification for hotels and tour operators
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Train your team, complete safety assessments, and earn trusted SOS Safe certification.
              Emergency interaction remains managed through OpenClaw and WhatsApp lanes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/sign-up"
                className="btn-primary-gradient px-6 py-3 rounded-lg text-sm font-medium text-white transition-all duration-300"
              >
                Start Certification
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-lg border border-border/50">
              <h2 className="font-semibold mb-2">1. Build Readiness</h2>
              <p className="text-sm text-muted-foreground">
                Complete structured modules on facilities, preparedness, and communication protocols.
              </p>
            </div>
            <div className="glass-card p-6 rounded-lg border border-border/50">
              <h2 className="font-semibold mb-2">2. Review & Verification</h2>
              <p className="text-sm text-muted-foreground">
                Submit assessments for review and track your certification readiness in one place.
              </p>
            </div>
            <div className="glass-card p-6 rounded-lg border border-border/50">
              <h2 className="font-semibold mb-2">3. Earn Trust</h2>
              <p className="text-sm text-muted-foreground">
                Receive certification status, badge-ready outcomes, and lifecycle renewal support.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
