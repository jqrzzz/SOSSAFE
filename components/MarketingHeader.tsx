"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
]

export function MarketingHeader() {
  const pathname = usePathname()

  return (
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
  )
}
