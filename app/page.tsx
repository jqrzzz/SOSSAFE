"use client"

import { useState } from "react"
import { SosaChat } from "@/components/SosaChat"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
]

export default function HomePage() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header — matches SOSWEBSITE pattern */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Go to homepage">
            <Logo size="default" />
          </Link>

          <nav className="flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-light tracking-wide transition-colors duration-200 hidden sm:inline-block",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/auth/login"
              className="text-sm font-light tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200 hidden sm:inline-block"
            >
              Login
            </Link>

            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Certified
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="container py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* SOSA Chat */}
      <main className="flex-1">
        <SosaChat />
      </main>

      {/* Footer — minimal, matches SOSWEBSITE style */}
      <footer className="bg-background border-t border-border" role="contentinfo">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex justify-center mb-6">
            <Link href="/" aria-label="Go to homepage">
              <Logo size="sm" />
            </Link>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-6" aria-label="Footer navigation">
            <Link href="/about" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/support" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Support</Link>
            <Link href="/auth/sign-up" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Get Certified</Link>
          </nav>

          <p className="text-[11px] text-muted-foreground/50 leading-relaxed text-center max-w-3xl mx-auto mb-5">
            SOS Safety is the certification portal of Tourist SOS, Inc. We help accommodation providers
            and tour operators meet verified safety standards for guest emergency preparedness. This
            website is for informational purposes only and does not function as an emergency call center.
            In the event of a medical emergency, contact local emergency services immediately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground/50">
            <span>&copy; {new Date().getFullYear()} Tourist SOS, Inc.</span>
            <nav className="flex items-center gap-1" aria-label="Legal">
              <Link href="/privacy" className="hover:text-foreground transition-colors px-1">Privacy</Link>
              <span className="text-muted-foreground/30" aria-hidden="true">&middot;</span>
              <Link href="/terms" className="hover:text-foreground transition-colors px-1">Terms</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
