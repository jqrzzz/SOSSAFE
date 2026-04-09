"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  getModuleSummariesForTier,
  PASSING_SCORE,
  CERTIFICATION_TIERS,
  TIER_MODULES,
  getPrerequisiteTier,
} from "@/lib/certification-data"
import { Certificate } from "@/components/dashboard/Certificate"

interface Certification {
  id: string
  certification_tier: string
  status: string
  issued_at: string | null
  expires_at: string | null
  verification_code: string | null
  created_at: string
}

interface Submission {
  id: string
  certification_id: string
  submission_type: string
  score: number | null
  submitted_at: string
}

export default function CertificationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [organizationName, setOrganizationName] = useState("Your Organization")
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTier, setActiveTier] = useState<string>("sos_safe_basic")
  const router = useRouter()

  useEffect(() => {
    async function loadCertificationData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setOrganizationName(user.user_metadata?.organization_name || "Your Organization")

      const { data: membership } = await supabase
        .from("partner_memberships")
        .select("partner_id")
        .eq("user_id", user.id)
        .single()

      if (!membership?.partner_id) {
        setIsLoading(false)
        return
      }

      setPartnerId(membership.partner_id)

      // Load ALL certifications for this partner
      const { data: certsData } = await supabase
        .from("certifications")
        .select("*")
        .eq("partner_id", membership.partner_id)
        .order("created_at", { ascending: false })

      const certs = certsData || []
      setCertifications(certs)

      // Load ALL submissions across all certifications
      if (certs.length > 0) {
        const certIds = certs.map((c) => c.id)
        const { data: subsData } = await supabase
          .from("certification_submissions")
          .select("*")
          .in("certification_id", certIds)

        setSubmissions(subsData || [])
      }

      // Set active tier to the highest in-progress or most recently earned
      const approvedTiers = certs.filter((c) => c.status === "approved").map((c) => c.certification_tier)
      const pendingCert = certs.find((c) => c.status === "pending")

      if (pendingCert) {
        setActiveTier(pendingCert.certification_tier)
      } else if (approvedTiers.includes("sos_safe_elite")) {
        setActiveTier("sos_safe_elite")
      } else if (approvedTiers.includes("sos_safe_premium")) {
        setActiveTier("sos_safe_premium")
      } else if (approvedTiers.includes("sos_safe_basic")) {
        // Basic done, show Premium next
        setActiveTier("sos_safe_premium")
      }

      setIsLoading(false)
    }

    loadCertificationData()
  }, [router])

  // Helpers
  const getCertForTier = (tierId: string) => certifications.find((c) => c.certification_tier === tierId)
  const isTierApproved = (tierId: string) => getCertForTier(tierId)?.status === "approved"

  const canStartTier = (tierId: string) => {
    const prereq = getPrerequisiteTier(tierId)
    if (!prereq) return true // Basic has no prereq
    return isTierApproved(prereq)
  }

  const getSubmissionsForCert = (certId: string) =>
    submissions.filter((s) => s.certification_id === certId)

  const getModuleStatus = (moduleId: string, certId: string) => {
    const submission = submissions.find(
      (s) => s.certification_id === certId && s.submission_type === moduleId,
    )
    if (submission) {
      const passed = submission.score !== null && submission.score >= PASSING_SCORE
      return { submitted: true, passed, score: submission.score }
    }
    return { submitted: false, passed: false, score: null }
  }

  const startCertification = async (tierId: string) => {
    if (!partnerId) return
    setError(null)

    const supabase = createClient()
    const { data: newCert, error: certError } = await supabase
      .from("certifications")
      .insert({
        partner_id: partnerId,
        certification_tier: tierId,
        status: "pending",
      })
      .select()
      .single()

    if (certError) {
      setError(certError.message)
      return
    }

    setCertifications((prev) => [newCert, ...prev])
    setActiveTier(tierId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!partnerId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">SOS Safe Certification</h1>
          <p className="text-muted-foreground mt-1">
            Complete your partner profile first to start the certification process
          </p>
        </div>
        <div className="glass-card p-8 rounded-lg border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Profile Required</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Please complete your partner profile before starting the certification process.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white"
          >
            Complete Profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  // Count total approved tiers for progression display
  const approvedCount = CERTIFICATION_TIERS.filter((t) => isTierApproved(t.id)).length
  const highestApproved = isTierApproved("sos_safe_elite")
    ? "Elite"
    : isTierApproved("sos_safe_premium")
    ? "Premium"
    : isTierApproved("sos_safe_basic")
    ? "Basic"
    : null

  // Active tier data
  const activeTierDef = CERTIFICATION_TIERS.find((t) => t.id === activeTier)!
  const activeCert = getCertForTier(activeTier)
  const activeModules = getModuleSummariesForTier(activeTier)
  const activeSubs = activeCert ? getSubmissionsForCert(activeCert.id) : []
  const activePassedCount = activeSubs.filter(
    (s) => s.score !== null && s.score >= PASSING_SCORE,
  ).length
  const activeProgress = activeModules.length > 0
    ? (activePassedCount / activeModules.length) * 100
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">SOS Safe Certification</h1>
        <p className="text-muted-foreground mt-1">
          {highestApproved
            ? `Currently ${highestApproved} certified — ${approvedCount} of 3 tiers complete`
            : "Complete each tier to advance your safety certification"}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tier Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CERTIFICATION_TIERS.map((tier) => {
          const approved = isTierApproved(tier.id)
          const hasCert = !!getCertForTier(tier.id)
          const canStart = canStartTier(tier.id)
          const isActive = activeTier === tier.id

          return (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-muted/50"
              }`}
            >
              {approved ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : hasCert ? (
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
              ) : canStart ? (
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              ) : (
                <svg className="w-3 h-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {tier.label}
            </button>
          )
        })}
      </div>

      {/* Active Tier Content */}
      {!activeCert && !canStartTier(activeTier) ? (
        /* Locked tier — need prerequisite */
        <div className="glass-card p-8 rounded-lg border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">{activeTierDef.name}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            {activeTierDef.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Complete{" "}
            <button onClick={() => setActiveTier(getPrerequisiteTier(activeTier)!)} className="text-primary hover:underline font-medium">
              {CERTIFICATION_TIERS.find((t) => t.id === getPrerequisiteTier(activeTier))?.name}
            </button>
            {" "}first to unlock this tier.
          </p>
        </div>
      ) : !activeCert ? (
        /* Can start this tier — show tier card + module preview */
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-lg border border-primary/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{activeTierDef.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">Valid for {activeTierDef.validity}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{activeTierDef.description}</p>
            <ul className="space-y-2 mb-6">
              {activeTierDef.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => startCertification(activeTier)}
              className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover"
            >
              Start {activeTierDef.label} Certification
            </button>
          </div>

          {/* Module preview */}
          <div className="glass-card p-6 rounded-lg border border-border/50">
            <h3 className="font-semibold mb-4">{activeTierDef.label} Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeModules.map((module) => (
                <div key={module.id} className="p-4 rounded-lg bg-muted/50 text-left">
                  <h4 className="font-medium mb-1">{module.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {module.questions} questions — {PASSING_SCORE}% to pass
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active certification — show progress + modules */
        <div className="space-y-6">
          {/* Status + Progress */}
          <div className="glass-card p-6 rounded-lg border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{activeTierDef.name} Progress</span>
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activeCert.status === "approved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}>
                  {activeCert.status === "approved" ? "Certified" : "In Progress"}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {activePassedCount} of {activeModules.length} modules passed
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${activeProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Each module requires a score of {PASSING_SCORE}% or higher to pass.
            </p>
          </div>

          {/* Certified Banner */}
          {activeCert.status === "approved" && (
            <div className="glass-card p-6 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-700 dark:text-green-400">
                    {activeTierDef.name} — Certified
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Congratulations! Valid{activeCert.expires_at ? ` until ${new Date(activeCert.expires_at).toLocaleDateString()}` : ` for ${activeTierDef.validity}`}.
                    {activeTier !== "sos_safe_elite" && (
                      <>{" "}Ready to advance? Switch to the next tier above.</>
                    )}
                  </p>
                  {activeSubs.length > 0 && (
                    <div className="flex gap-4 mt-3">
                      <span className="text-xs text-muted-foreground">
                        Average score: {Math.round(activeSubs.reduce((sum, s) => sum + (s.score || 0), 0) / activeSubs.length)}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Certified: {activeCert.issued_at ? new Date(activeCert.issued_at).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modules */}
          <div className="space-y-4">
            {activeModules.map((module, index) => {
              const status = getModuleStatus(module.id, activeCert.id)
              const prevStatus = index > 0
                ? getModuleStatus(activeModules[index - 1].id, activeCert.id)
                : null
              const isLocked = index > 0 && !prevStatus?.passed

              return (
                <div
                  key={module.id}
                  className={`glass-card p-6 rounded-lg border transition-colors ${
                    status.passed
                      ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                      : status.submitted && !status.passed
                      ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                      : isLocked
                      ? "border-border/30 opacity-60"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      status.passed
                        ? "bg-green-100 dark:bg-green-900/30"
                        : status.submitted && !status.passed
                        ? "bg-red-100 dark:bg-red-900/30"
                        : isLocked
                        ? "bg-muted"
                        : "bg-primary/10"
                    }`}>
                      {status.passed ? (
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : status.submitted && !status.passed ? (
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : isLocked ? (
                        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : (
                        <span className="text-lg font-bold text-primary">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{module.title}</h3>
                        {status.submitted && status.score !== null && (
                          <span className={`text-sm font-medium ${
                            status.passed
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {status.score}% {status.passed ? "— Passed" : `— Below ${PASSING_SCORE}%`}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{module.questions} questions</p>
                    </div>

                    {!status.submitted && !isLocked && (
                      <Link
                        href={`/dashboard/certification/${module.id}?certId=${activeCert.id}`}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Start
                      </Link>
                    )}

                    {status.submitted && !status.passed && (
                      <Link
                        href={`/dashboard/certification/${module.id}?certId=${activeCert.id}`}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                      >
                        Retake
                      </Link>
                    )}

                    {status.passed && (
                      <Link
                        href={`/dashboard/certification/${module.id}?certId=${activeCert.id}&review=true`}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                      >
                        Review
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Certificate — visible when this tier is approved */}
          {activeCert.status === "approved" && (
            <Certificate
              organizationName={organizationName}
              certificationTier={activeCert.certification_tier}
              issuedAt={activeCert.issued_at}
              expiresAt={activeCert.expires_at}
              certificationId={activeCert.id}
              verificationCode={activeCert.verification_code}
            />
          )}
        </div>
      )}
    </div>
  )
}
