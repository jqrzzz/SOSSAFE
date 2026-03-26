"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CERTIFICATION_RULES, evaluateCertificationReadiness } from "@/lib/certification/rules"
import { CERTIFICATION_CURRICULUM, CERTIFICATION_MODULE_ORDER } from "@/lib/certification/curriculum"

interface Certification {
  id: string
  certification_tier: string
  status: string
  issued_at: string | null
  expires_at: string | null
  created_at: string
}

interface PartnerProfile {
  id: string
  name: string
  type: "accommodation" | "tour_operator"
  city: string | null
  region: string | null
  country: string | null
}

interface Submission {
  id: string
  submission_type: string
  score: number | null
  submitted_at: string
  responses?: Record<string, number> | null
}

const MODULES = CERTIFICATION_MODULE_ORDER.map((moduleId) => {
  const module = CERTIFICATION_CURRICULUM[moduleId]
  return {
    id: module.id,
    title: module.title,
    description: module.description,
    questions: module.questions.length,
  }
})

export default function CertificationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null)
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

      const { data: partnerData } = await supabase
        .from("partners")
        .select("id, name, type, city, region, country")
        .eq("id", membership.partner_id)
        .single()

      if (partnerData) {
        setPartnerProfile(partnerData)
      }

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
      return { completed: true, score: submission.score }
    }
    return { completed: false, score: null }
  }

  const completedModules = submissions.length
  const progress = (completedModules / MODULES.length) * 100
  const readiness = evaluateCertificationReadiness(submissions)

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

        <div className="glass-card p-8 rounded-lg border border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Get SOS Safe Certified</h2>
            <p className="text-muted-foreground mb-8">
              Complete our certification modules to demonstrate your commitment to guest safety. 
              Certified partners receive a badge, priority support, and access to our emergency response network.
            </p>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {MODULES.map((module) => (
                <div key={module.id} className="p-4 rounded-lg bg-muted/50 text-left">
                  <h3 className="font-medium mb-1">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.questions} questions</p>
                </div>
              ))}
            </div>

            <button
              onClick={startCertification}
              className="btn-primary-gradient px-8 py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover"
            >
              Start Certification
            </button>
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

      {partnerProfile && (
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Organization</p>
              <h2 className="text-xl font-semibold">{partnerProfile.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {partnerProfile.type === "accommodation" ? "Accommodation" : "Tour Operator"}
                {partnerProfile.city || partnerProfile.region || partnerProfile.country
                  ? ` • ${[partnerProfile.city, partnerProfile.region, partnerProfile.country]
                      .filter(Boolean)
                      .join(", ")}`
                  : ""}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 px-4 py-3 bg-background/50">
              <p className="text-xs text-muted-foreground">Certification Tier</p>
              <p className="font-semibold mt-1">
                {certification.certification_tier === "sos_safe_basic"
                  ? "SOS Safe Basic"
                  : certification.certification_tier === "sos_safe_premium"
                  ? "SOS Safe Premium"
                  : "SOS Safe Elite"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="glass-card p-6 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{completedModules} of {MODULES.length} modules</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {completedModules === MODULES.length && certification.status === "pending" && (
          <p className="text-sm text-muted-foreground mt-3">
            All modules complete! Your certification is being reviewed by our team.
          </p>
        )}
      </div>

      {/* Readiness Summary */}
      <div className={`glass-card p-6 rounded-lg border ${
        readiness.isEligible
          ? "border-green-300 dark:border-green-800 bg-green-50/40 dark:bg-green-900/10"
          : "border-yellow-300 dark:border-yellow-800 bg-yellow-50/40 dark:bg-yellow-900/10"
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Certification Readiness</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Minimum module score: {CERTIFICATION_RULES.minModuleScore}% • Weighted overall: {CERTIFICATION_RULES.minOverallScore}%
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            readiness.isEligible
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          }`}>
            {readiness.isEligible ? "Eligible for Review" : "Needs Improvement"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border/50 p-3 bg-background/50">
            <p className="text-xs text-muted-foreground">Modules Completed</p>
            <p className="text-lg font-semibold">
              {readiness.completedModules}/{readiness.totalModules}
            </p>
          </div>
          <div className="rounded-lg border border-border/50 p-3 bg-background/50">
            <p className="text-xs text-muted-foreground">Weighted Overall</p>
            <p className="text-lg font-semibold">
              {readiness.weightedOverallScore !== null ? `${readiness.weightedOverallScore}%` : "N/A"}
            </p>
          </div>
          <div className="rounded-lg border border-border/50 p-3 bg-background/50">
            <p className="text-xs text-muted-foreground">Critical Fail Items</p>
            <p className="text-lg font-semibold">{readiness.criticalFails.length}</p>
          </div>
        </div>

        {!readiness.isEligible && (
          <ul className="mt-4 space-y-2 text-sm">
            {readiness.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2">
                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {MODULES.map((module, index) => {
          const status = getModuleStatus(module.id)
          const isLocked = index > 0 && !getModuleStatus(MODULES[index - 1].id).completed
          
          return (
            <div
              key={module.id}
              className={`glass-card p-6 rounded-lg border transition-colors ${
                status.completed
                  ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                  : isLocked
                  ? "border-border/30 opacity-60"
                  : "border-border/50 hover:border-primary/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  status.completed
                    ? "bg-green-100 dark:bg-green-900/30"
                    : isLocked
                    ? "bg-muted"
                    : "bg-primary/10"
                }`}>
                  {status.completed ? (
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    {status.completed && status.score !== null && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Score: {status.score}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{module.questions} questions</p>
                </div>

                {!status.completed && !isLocked && (
                  <Link
                    href={`/dashboard/certification/${module.id}?certId=${certification.id}`}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Start
                  </Link>
                )}

                {status.completed && (
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

      {/* Certification Badge Preview */}
      {certification.status === "approved" && (
        <div className="glass-card p-8 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">SOS Safe Certified</h2>
          <p className="text-muted-foreground mb-4">
            Valid until {certification.expires_at ? new Date(certification.expires_at).toLocaleDateString() : "N/A"}
          </p>
          <button className="px-6 py-2 rounded-lg border border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            Download Certificate
          </button>
        </div>
      )}
    </div>
  )
}
