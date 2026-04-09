import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

interface VerifyPageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Verify Certification ${code} | SOS Safety`,
    description: "Verify the authenticity of an SOS Safe hospitality safety certification.",
  }
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { code } = await params
  const supabase = await createClient()

  // Look up the certification by verification code
  const { data: cert } = await supabase
    .from("certifications")
    .select("id, certification_tier, status, issued_at, expires_at, verification_code, partner_id")
    .eq("verification_code", code)
    .single()

  if (!cert) {
    return <NotFoundState code={code} />
  }

  // Get partner info
  const { data: partner } = await supabase
    .from("partners")
    .select("name, type, country, city")
    .eq("id", cert.partner_id)
    .single()

  const now = new Date()
  const expiresAt = cert.expires_at ? new Date(cert.expires_at) : null
  const isExpired = expiresAt ? now > expiresAt : false
  const isActive = cert.status === "approved" && !isExpired

  const tierLabel =
    cert.certification_tier === "sos_safe_elite"
      ? "Elite"
      : cert.certification_tier === "sos_safe_premium"
        ? "Premium"
        : "Basic"

  const tierDescription =
    cert.certification_tier === "sos_safe_elite"
      ? "The highest level of SOS Safe certification, demonstrating excellence in destination risk management, crisis leadership, and emergency network integration."
      : cert.certification_tier === "sos_safe_premium"
        ? "Advanced certification covering first aid & CPR proficiency, guest medical emergency management, and advanced safety operations."
        : "Foundation certification covering facility safety assessment, emergency preparedness protocols, and communication procedures."

  const moduleCount =
    cert.certification_tier === "sos_safe_elite"
      ? 9
      : cert.certification_tier === "sos_safe_premium"
        ? 6
        : 3

  const tierColor = isActive
    ? cert.certification_tier === "sos_safe_elite"
      ? { gradient: "from-amber-500 via-amber-600 to-yellow-500", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-900/40" }
      : cert.certification_tier === "sos_safe_premium"
        ? { gradient: "from-blue-500 via-primary to-indigo-500", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-400", badge: "bg-blue-100 dark:bg-blue-900/40" }
        : { gradient: "from-emerald-500 via-primary to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-100 dark:bg-emerald-900/40" }
    : { gradient: "from-gray-400 to-gray-500", bg: "bg-gray-50 dark:bg-gray-900/20", border: "border-gray-200 dark:border-gray-800", text: "text-gray-600 dark:text-gray-400", badge: "bg-gray-100 dark:bg-gray-800" }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"

  const partnerType = partner?.type === "tour_operator" ? "Tour Operator" : "Accommodation Provider"

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-red-500">SOS</span>{" "}
              <span className="text-emerald-600">Safety</span>
            </span>
          </Link>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Certification Verification
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Status banner */}
        <div className={`rounded-2xl border-2 ${tierColor.border} ${tierColor.bg} p-8 mb-8`}>
          {/* Tier accent bar */}
          <div className={`h-1 bg-gradient-to-r ${tierColor.gradient} rounded-full mb-6`} />

          {/* Status indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? "bg-emerald-100 dark:bg-emerald-900/40" : isExpired ? "bg-orange-100 dark:bg-orange-900/40" : "bg-gray-100 dark:bg-gray-800"}`}>
              {isActive ? (
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ) : isExpired ? (
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              )}
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isActive ? "text-emerald-700 dark:text-emerald-400" : isExpired ? "text-orange-700 dark:text-orange-400" : "text-gray-600 dark:text-gray-400"}`}>
                {isActive ? "Verified — Active Certification" : isExpired ? "Certification Expired" : "Certification Revoked"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isActive
                  ? "This certification has been independently verified by Tourist SOS."
                  : isExpired
                    ? `This certification expired on ${formatDate(cert.expires_at)}. Contact the property for renewal status.`
                    : "This certification is no longer active."}
              </p>
            </div>
          </div>

          {/* Organization info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Certified Organization</p>
              <p className="text-xl font-semibold">{partner?.name ?? "Organization"}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span>{partnerType}</span>
                {partner?.city && partner?.country && (
                  <>
                    <span className="text-muted-foreground/30">|</span>
                    <span>{partner.city}, {partner.country}</span>
                  </>
                )}
              </div>
            </div>

            {/* Cert details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tier</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${tierColor.badge} ${tierColor.text}`}>
                  {tierLabel}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Issued</p>
                <p className="text-sm font-medium">{formatDate(cert.issued_at)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Valid Until</p>
                <p className={`text-sm font-medium ${isExpired ? "text-orange-600 dark:text-orange-400" : ""}`}>
                  {formatDate(cert.expires_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Code</p>
                <p className="text-sm font-bold font-mono tracking-wider">{cert.verification_code}</p>
              </div>
            </div>
          </div>
        </div>

        {/* What this certification means */}
        <div className="glass-card rounded-xl border border-border/50 p-6 mb-8">
          <h2 className="font-semibold mb-3">What SOS Safe {tierLabel} Means</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {tierDescription}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">{moduleCount}</p>
              <p className="text-xs text-muted-foreground">Modules Passed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">80%+</p>
              <p className="text-xs text-muted-foreground">Min. Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">
                {cert.certification_tier === "sos_safe_elite" ? "2yr" : "1yr"}
              </p>
              <p className="text-xs text-muted-foreground">Validity</p>
            </div>
          </div>
        </div>

        {/* Trust footer */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verified by Tourist SOS — the global standard for hospitality emergency preparedness
          </div>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              SOS Safety Home
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About the Program
            </Link>
            <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
              Get Certified
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ── Not Found State ─────────────────────────────────────────────── */

function NotFoundState({ code }: { code: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-red-500">SOS</span>{" "}
              <span className="text-emerald-600">Safety</span>
            </span>
          </Link>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Certification Verification
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
          <svg className="w-10 h-10 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Certification Not Found</h1>
        <p className="text-muted-foreground mb-2">
          No certification was found for code <span className="font-mono font-bold">{code}</span>.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Please check the code and try again. If you believe this is an error,
          contact the property directly or reach out to Tourist SOS support.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/auth/sign-up"
            className="btn-primary-gradient px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          >
            Get Certified
          </Link>
        </div>
      </main>
    </div>
  )
}
