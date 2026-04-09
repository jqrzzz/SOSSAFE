import Link from "next/link"
import { Logo } from "@/components/Logo"

export function MarketingFooter() {
  return (
    <footer className="bg-background border-t border-border" role="contentinfo">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex justify-center mb-6">
          <Link href="/" aria-label="Go to homepage">
            <Logo size="sm" />
          </Link>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-6" aria-label="Footer navigation">
          <Link href="/about" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link href="/pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
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
  )
}
