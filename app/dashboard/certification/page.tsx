"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getModuleSummaries, PASSING_SCORE, MODULES as ALL_MODULES, CERTIFICATION_TIERS } from "@/lib/certification-data"
import { Certificate } from "@/components/dashboard/Certificate"

interface Certification {
  id: string
  certification_tier: string
  status: string
  issued_at: string | null
  expires_at: string | null
  created_at: string
}

interface Submission {
  id: string
  submission_type: string
  score: number | null
  submitted_at: string
}

const MODULES = getModuleSummaries()

export default function CertificationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [organizationName, setOrganizationName] = useState("Your Organization")
  const [certification, setCertification] = useState<Certification | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [error, setError] = useState<string | null>(null)
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

      // Get partner membership
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

      // Get certification
      const { data: certData } = await supabase
        .from("certifications")
        .select("*")
        .eq("partner_id", membership.partner_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (certData) {
        setCertification(certData)

        // Get submissions for this certification
        const { data: submissionsData } = await supabase
          .from("certification_submissions")
          .select("*")
          .eq("certification_id", certData.id)

        setSubmissions(submissionsData || [])
      }

      setIsLoading(false)
    }

    loadCertificationData()
  }, [router])

  const startCertification = async () => {
    if (!partnerId) return

    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: newCert, error: certError } = await supabase
      .from("certifications")
      .insert({
        partner_id: partnerId,
        certification_tier: "sos_safe_basic",
        status: "pending",
      })
      .select()
      .single()

    if (certError) {
      setError(certError.message)
      return
    }

    setCertification(newCert)
  }

  const getModuleStatus = (moduleId: string) => {
    const submission = submissions.find(s => s.submission_type === moduleId)
    if (submission) {
      const passed = submission.score !== null && submission.score >= PASSING_SCORE
      return { submitted: true, passed, score: submission.score }
    }
    return { submitted: false, passed: false, score: null }
  }

  const passedModules = submissions.filter(s => s.score !== null && s.score >= PASSING_SCORE).length
  const progress = (passedModules / MODULES.length) * 100

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

  if (!certification) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">SOS Safe Certification</h1>
          <p className="text-muted-foreground mt-1">
            Become a trusted partner in tourist safety
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CERTIFICATION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`glass-card p-6 rounded-lg border relative flex flex-col ${
                tier.available
                  ? "border-primary/30 hover:border-primary/60"
                  : "border-border/30 opacity-60"
              }`}
            >
              {!tier.available && (
                <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Coming Soon
                </span>
              )}
              <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">Valid for {tier.validity}</p>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{tier.description}</p>
              <ul className="space-y-2 mb-6">
                {tier.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
              {tier.available ? (
                <button
                  onClick={startCertification}
                  className="btn-primary-gradient w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover"
                >
                  Start {tier.label} Certification
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-6 py-3 rounded-lg font-medium border border-border text-muted-foreground cursor-not-allowed"
                >
                  Not Yet Available
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Module preview */}
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <h3 className="font-semibold mb-4">Basic Certification Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODULES.map((module) => (
              <div key={module.id} className="p-4 rounded-lg bg-muted/50 text-left">
                <h4 className="font-medium mb-1">{module.title}</h4>
                <p className="text-sm text-muted-foreground">{module.questions} questions — {PASSING_SCORE}% to pass</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">SOS Safe Certification</h1>
          <p className="text-muted-foreground mt-1">
            Complete all modules to earn your certification
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          certification.status === "approved"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : certification.status === "in_review"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        }`}>
          {certification.status === "approved" ? "Certified" :
           certification.status === "in_review" ? "In Review" :
           "In Progress"}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-6 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{passedModules} of {MODULES.length} modules passed</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Each module requires a score of {PASSING_SCORE}% or higher to pass.
        </p>
        {passedModules === MODULES.length && certification.status === "pending" && (
          <p className="text-sm text-primary font-medium mt-3">
            All modules passed! Your certification is being reviewed by our team.
          </p>
        )}
      </div>

      {/* In-Review Banner */}
      {certification.status === "in_review" && (
        <div className="glass-card p-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-400">Certification Under Review</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All modules have been completed and passed. Our safety team is now reviewing your submissions.
                This typically takes 2–3 business days. You'll receive an email once your certification is approved.
              </p>
              {submissions.length > 0 && (
                <div className="flex gap-4 mt-3">
                  <span className="text-xs text-muted-foreground">
                    Average score: {Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Submitted: {new Date(Math.max(...submissions.map(s => new Date(s.submitted_at).getTime()))).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-4">
        {MODULES.map((module, index) => {
          const status = getModuleStatus(module.id)
          const prevStatus = index > 0 ? getModuleStatus(MODULES[index - 1].id) : null
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
                        {status.score}% {status.passed ? "— Passed" : "— Below " + PASSING_SCORE + "%"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{module.questions} questions</p>
                </div>

                {/* Not yet attempted and not locked */}
                {!status.submitted && !isLocked && (
                  <Link
                    href={`/dashboard/certification/${module.id}?certId=${certification.id}`}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Start
                  </Link>
                )}

                {/* Failed — show retry */}
                {status.submitted && !status.passed && (
                  <Link
                    href={`/dashboard/certification/${module.id}?certId=${certification.id}`}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                  >
                    Retake
                  </Link>
                )}

                {/* Passed — show review */}
                {status.passed && (
                  <Link
                    href={`/dashboard/certification/${module.id}?certId=${certification.id}&review=true`}
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

      {/* Certificate — visible when approved */}
      {certification.status === "approved" && (
        <Certificate
          organizationName={organizationName}
          certificationTier={certification.certification_tier}
          issuedAt={certification.issued_at}
          expiresAt={certification.expires_at}
          certificationId={certification.id}
        />
      )}
    </div>
  )
}
