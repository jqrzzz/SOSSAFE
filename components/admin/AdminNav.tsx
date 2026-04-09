"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/Logo"

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/partners", label: "Partners", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
]

export function AdminNav({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo size="default" />
              <span className="text-xs font-mono bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full">ADMIN</span>
            </Link>
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{adminEmail}</span>
            <Link
              href="/dashboard"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Partner View
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
