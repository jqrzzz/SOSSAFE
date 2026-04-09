import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { PASSING_SCORE, MODULES, CERTIFICATION_TIERS, TIER_MODULES } from "@/lib/certification-data"
import { ASSESSMENT_QUESTIONS } from "@/lib/facility-assessment-data"
import { DashboardCharts } from "@/components/dashboard/DashboardCharts"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const params = await searchParams
  const isWelcome = params.welcome === "true"
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const organizationName =
    user?.user_metadata?.organization_name || "Your Organization"
  const partnerType = user?.user_metadata?.partner_type || "accommodation"

  // Get partner profile
  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("*, partners(*)")
    .eq("user_id", user?.id)
    .single()

  const hasProfile = !!membership?.partners

  // ── Gather all dashboard data ────────────────────────────────────
  let allCertifications: {
    id: string
    status: string
    certification_tier: string
    issued_at: string | null
    expires_at: string | null
  }[] = []
  let activeCaseCount = 0
  let totalCaseCount = 0
  let teamMemberCount = 0
  let trainedMemberCount = 0
  let knowledgeEntryCount = 0
  let assessmentAnswerCount = 0
  let latestPolicyVersion: number | null = null
  let certSubmissions: { submission_type: string; score: number | null }[] = []

  if (hasProfile) {
    // All certifications (across tiers)
    const { data: certs } = await supabase
      .from("certifications")
      .select("id, status, certification_tier, issued_at, expires_at")
      .eq("partner_id", membership.partner_id)
      .order("created_at", { ascending: false })

    allCertifications = certs || []

    // All certification submissions (across all certs)
    const { data: subs } = await supabase
      .from("certification_submissions")
      .select("submission_type, score")

    certSubmissions = subs || []

    // Facility assessment progress
    const { count: assessCount } = await supabase
      .from("facility_assessments")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", membership.partner_id)

    assessmentAnswerCount = assessCount || 0

    // Latest policy document
    const { data: latestPolicy } = await supabase
      .from("facility_policies")
      .select("version")
      .eq("partner_id", membership.partner_id)
      .order("version", { ascending: false })
      .limit(1)
      .single()

    latestPolicyVersion = latestPolicy?.version ?? null

    // Cases
    const { data: caseParties } = await supabase
      .from("case_parties")
      .select("case_id")
      .eq("party_id", membership.partner_id)
      .eq("party_type", "other")

    if (caseParties && caseParties.length > 0) {
      totalCaseCount = caseParties.length
      const caseIds = caseParties.map((cp) => cp.case_id)
      const { count } = await supabase
        .from("cases")
        .select("*", { count: "exact", head: true })
        .in("id", caseIds)
        .in("status", ["open", "in_progress"])

      activeCaseCount = count || 0
    }

    // Team members
    const { data: members } = await supabase
      .from("partner_memberships")
      .select("id, user_id")
      .eq("partner_id", membership.partner_id)
      .is("removed_at", null)

    teamMemberCount = members?.length || 0

    // Count members who have completed all training modules
    if (members && members.length > 0) {
      const { data: trainingRecords } = await supabase
        .from("staff_training_completions")
        .select("user_id, module_id, passed")
        .eq("partner_id", membership.partner_id)

      if (trainingRecords && trainingRecords.length > 0) {
        // Count users who have passed at least one module
        const usersWithTraining = new Set(
          trainingRecords.filter((r) => r.passed).map((r) => r.user_id),
        )
        trainedMemberCount = usersWithTraining.size
      }
    }

    // Local knowledge entries
    const { count: knowledgeCount } = await supabase
      .from("partner_local_knowledge")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", membership.partner_id)

    knowledgeEntryCount = knowledgeCount || 0
  }

  // ── Derived values ───────────────────────────────────────────────
  const approvedCerts = allCertifications.filter((c) => c.status === "approved")
  const highestApproved = approvedCerts.length > 0 ? approvedCerts[0] : null
  const isCertified = approvedCerts.length > 0
  const certExpiresAt = highestApproved?.expires_at ?? null
  const daysUntilExpiry = certExpiresAt
    ? Math.ceil(
        (new Date(certExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
    : null

  // Find highest tier label
  const highestTierLabel = highestApproved
    ? CERTIFICATION_TIERS.find((t) => t.id === highestApproved.certification_tier)?.label ?? "Basic"
    : null

  // Current in-progress tier (latest non-approved cert)
  const inProgressCert = allCertifications.find((c) => c.status !== "approved")
  const currentTierId = inProgressCert?.certification_tier ?? allCertifications[0]?.certification_tier ?? "sos_safe_basic"
  const currentTierModules = TIER_MODULES[currentTierId] ?? MODULES.slice(0, 3).map((m) => m.id)
  const totalModulesInTier = currentTierModules.length

  const scoredSubmissions = certSubmissions.filter((s) => s.score != null)
  const avgScore =
    scoredSubmissions.length > 0
      ? Math.round(
          scoredSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) /
            scoredSubmissions.length,
        )
      : null

  const passedModules = certSubmissions.filter(
    (s) => s.score !== null && s.score >= PASSING_SCORE,
  ).length

  const totalAssessmentQuestions = ASSESSMENT_QUESTIONS.length

  // ── Chart data ──────────────────────────────────────────────────
  const moduleScores = MODULES
    .filter((m) => certSubmissions.some((s) => s.submission_type === m.id && s.score != null))
    .map((m) => {
      const sub = certSubmissions.find((s) => s.submission_type === m.id)
      const score = sub?.score ?? 0
      return {
        name: m.title.replace(" & ", " & "),
        score,
        passed: score >= PASSING_SCORE,
      }
    })

  const readinessData = [
    {
      label: "Certification Modules",
      value: passedModules,
      max: totalModulesInTier,
    },
    {
      label: "Team Trained",
      value: trainedMemberCount,
      max: Math.max(teamMemberCount, 1),
    },
    {
      label: "Facility Assessment",
      value: assessmentAnswerCount,
      max: totalAssessmentQuestions,
    },
    {
      label: "Local Knowledge",
      value: Math.min(knowledgeEntryCount, 10),
      max: 10,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          {isWelcome ? "Welcome to SOS Safe!" : "Welcome back!"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {organizationName} —{" "}
          {partnerType === "accommodation"
            ? "Accommodation Provider"
            : "Tour Operator"}
        </p>
      </div>

      {/* First-time welcome banner */}
      {isWelcome && (
        <div className="glass-card p-6 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Your organization is set up!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Next step: complete your safety certification. Pass all modules in a tier with {PASSING_SCORE}% or higher to earn your SOS Safe badge. Three tiers: Basic, Premium, and Elite.
              </p>
              <Link
                href="/dashboard/certification"
                className="inline-flex items-center gap-2 mt-4 btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium text-white"
              >
                Start Certification
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Setup nudge for new users */}
      {!hasProfile && (
        <div className="glass-card p-6 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Complete Your Setup</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Set up your partner profile to start the SOS Safe certification
                process.
              </p>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 mt-4 btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium text-white"
              >
                Complete Profile
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Stats Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Certification */}
        <Link
          href="/dashboard/certification"
          className="glass-card p-5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isCertified
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-muted"
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  isCertified
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Certification</p>
          <p className="text-xl font-bold mt-0.5">
            {isCertified
              ? `${highestTierLabel} Certified`
              : inProgressCert
                ? `${passedModules}/${totalModulesInTier} Modules`
                : "Not Started"}
          </p>
          {isCertified && daysUntilExpiry !== null && (
            <p
              className={`text-xs mt-1 ${
                daysUntilExpiry < 30
                  ? "text-red-500"
                  : daysUntilExpiry < 90
                    ? "text-yellow-500"
                    : "text-muted-foreground"
              }`}
            >
              {daysUntilExpiry > 0
                ? `Expires in ${daysUntilExpiry} days`
                : "Expired"}
            </p>
          )}
        </Link>

        {/* Active Cases */}
        <Link
          href="/dashboard/cases"
          className="glass-card p-5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeCaseCount > 0
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-muted"
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  activeCaseCount > 0
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-muted-foreground"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Active Cases</p>
          <p className="text-xl font-bold mt-0.5">{activeCaseCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {totalCaseCount} total
          </p>
        </Link>

        {/* Team */}
        <Link
          href="/dashboard/team"
          className="glass-card p-5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Team Members</p>
          <p className="text-xl font-bold mt-0.5">{teamMemberCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {trainedMemberCount} trained
          </p>
        </Link>

        {/* Average Score */}
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Safety Score</p>
          <p className="text-xl font-bold mt-0.5">
            {avgScore !== null ? `${avgScore}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {certSubmissions.length > 0
              ? `Across ${certSubmissions.length} modules`
              : "Complete modules to see score"}
          </p>
        </div>
      </div>

      {/* ── Charts ───────────────────────────────────────────────── */}
      {hasProfile && (
        <DashboardCharts
          moduleScores={moduleScores}
          readiness={readinessData}
          passingScore={PASSING_SCORE}
        />
      )}

      {/* ── Module Scores Breakdown ─────────────────────────────── */}
      {certSubmissions.length > 0 && (
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Module Scores</h2>
            <Link
              href="/dashboard/certification"
              className="text-xs text-primary hover:underline"
            >
              View all modules
            </Link>
          </div>
          <div className="space-y-4">
            {MODULES.filter((m) => certSubmissions.some((s) => s.submission_type === m.id)).map((mod) => {
              const label = mod.title
              const sub = certSubmissions.find(
                (s) => s.submission_type === mod.id,
              )
              const score = sub?.score ?? null
              const passed = score !== null && score >= PASSING_SCORE

              return (
                <div key={mod.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{label}</span>
                    {score !== null ? (
                      <span
                        className={`text-sm font-semibold ${
                          passed
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {score}%
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Not started
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score === null
                          ? "w-0"
                          : passed
                            ? "bg-green-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: score !== null ? `${score}%` : "0%" }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Quick Actions ───────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link
            href="/dashboard/certification"
            className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">
                {isCertified ? "View Certificate" : "Continue Certification"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isCertified
                  ? "Download or print your certificate"
                  : `${passedModules} of ${MODULES.length} modules passed`}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/team"
            className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Invite Staff</h3>
              <p className="text-xs text-muted-foreground">
                Share invite link with your team
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/cases"
            className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">View Cases</h3>
              <p className="text-xs text-muted-foreground">
                {activeCaseCount > 0
                  ? `${activeCaseCount} active case${activeCaseCount !== 1 ? "s" : ""}`
                  : "No active cases"}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/knowledge"
            className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Local Knowledge</h3>
              <p className="text-xs text-muted-foreground">
                {knowledgeEntryCount > 0
                  ? `${knowledgeEntryCount} entr${knowledgeEntryCount !== 1 ? "ies" : "y"} shared`
                  : "Share local safety intel"}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/policies"
            className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Policies & Procedures</h3>
              <p className="text-xs text-muted-foreground">
                {latestPolicyVersion
                  ? `v${latestPolicyVersion} generated`
                  : assessmentAnswerCount > 0
                    ? `${assessmentAnswerCount}/${totalAssessmentQuestions} questions answered`
                    : "Start facility assessment"}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── How It Works (for uncertified users) ─────────────── */}
      {!isCertified && (
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <h2 className="font-semibold mb-4">How SOS Safe Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Get Certified",
                desc: `Complete ${MODULES.length} safety modules across 3 tiers (Basic → Premium → Elite) with ${PASSING_SCORE}% or higher.`,
              },
              {
                step: "2",
                title: "Assess Your Facility",
                desc: "Let SOSA interview you about your property to build custom Policies & Procedures.",
              },
              {
                step: "3",
                title: "Train Your Team",
                desc: "Invite staff, share local safety intel, and ensure everyone is prepared.",
              },
              {
                step: "4",
                title: "Stay Connected",
                desc: "Report incidents via messaging. We coordinate care.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-sm font-semibold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Emergency Contact Reminder (for certified users) ── */}
      {isCertified && (
        <div className="glass-card p-5 rounded-lg border border-border/50 bg-muted/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium">Need to report an incident?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Contact Tourist SOS via WhatsApp or LINE. Our AI triage system
                will create a case and coordinate the response. All case data
                will appear in your Cases dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
