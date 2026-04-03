"use client"

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
          </nav>
        </div>
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
