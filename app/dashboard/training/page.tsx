import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getModuleSummaries, PASSING_SCORE } from "@/lib/certification-data"

export default async function MyTrainingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, role, partners(name)")
    .eq("user_id", user.id)
    .is("removed_at", null)
    .single()

  if (!membership?.partner_id) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Training</h1>
          <p className="text-muted-foreground mt-1">
            Complete your partner profile first to access training.
          </p>
        </div>
      </div>
    )
  }

  // Get this user's training completions
  const { data: trainingRecords } = await supabase
    .from("staff_training_completions")
    .select("module_id, score, passed, completed_at, expires_at")
    .eq("partner_id", membership.partner_id)
    .eq("user_id", user.id)

  // Get org certification (needed for module links)
  const { data: certification } = await supabase
    .from("certifications")
    .select("id, status")
    .eq("partner_id", membership.partner_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const modules = getModuleSummaries()
  const trainingByModule: Record<
    string,
    { score: number; passed: boolean; completed_at: string; expires_at: string | null }
  > = {}
  for (const r of trainingRecords || []) {
    trainingByModule[r.module_id] = r
  }

  const passedCount = modules.filter((m) => trainingByModule[m.id]?.passed).length
  const allPassed = passedCount === modules.length
  const partners = membership.partners as unknown as { name: string } | null
  const partnerName = partners?.name || "Your Organization"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Training</h1>
        <p className="text-muted-foreground mt-1">
          {partnerName} — {user.email}
        </p>
      </div>

      {/* Overall progress */}
      <div className="glass-card p-6 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Training Progress</h2>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              allPassed
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : passedCount > 0
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {allPassed
              ? "Fully Trained"
              : passedCount > 0
                ? `${passedCount}/${modules.length} Complete`
                : "Not Started"}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(passedCount / modules.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Complete all {modules.length} safety modules with a score of{" "}
          {PASSING_SCORE}% or higher.
        </p>
      </div>

      {/* Module cards */}
      <div className="space-y-4">
        {modules.map((module, index) => {
          const record = trainingByModule[module.id]
          const prevRecord = index > 0 ? trainingByModule[modules[index - 1].id] : null
          const isLocked = index > 0 && !prevRecord?.passed
          const canStart = !!certification?.id && !isLocked
          const daysUntilExpiry = record?.expires_at
            ? Math.ceil((new Date(record.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null
          const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0
          const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 60

          return (
            <div
              key={module.id}
              className={`glass-card p-6 rounded-lg border transition-colors ${
                isExpired
                  ? "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10"
                  : record?.passed
                    ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                    : record && !record.passed
                      ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                      : isLocked
                        ? "border-border/30 opacity-60"
                        : "border-border/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-xl ${
                    isExpired
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : record?.passed
                        ? "bg-green-100 dark:bg-green-900/30"
                        : record && !record.passed
                          ? "bg-red-100 dark:bg-red-900/30"
                          : isLocked
                            ? "bg-muted"
                            : "bg-primary/10"
                  }`}
                >
                  {isExpired ? (
                    <ClockIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  ) : record?.passed ? (
                    <CheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : record && !record.passed ? (
                    <XIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  ) : isLocked ? (
                    <LockIcon className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <span>{module.icon}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold">{module.title}</h3>
                    {isExpired ? (
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        Expired — retrain required
                      </span>
                    ) : record ? (
                      <span
                        className={`text-sm font-medium ${
                          record.passed
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {record.score}%{" "}
                        {record.passed ? "— Passed" : `— Below ${PASSING_SCORE}%`}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {module.questions} questions
                    </span>
                    {record?.completed_at && (
                      <span className="text-xs text-muted-foreground">
                        Completed{" "}
                        {new Date(record.completed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {isExpiringSoon && (
                      <span className="text-xs font-medium text-orange-500">
                        Expires in {daysUntilExpiry} days
                      </span>
                    )}
                    {record?.passed && !isExpired && !isExpiringSoon && record.expires_at && (
                      <span className="text-xs text-muted-foreground">
                        Valid until{" "}
                        {new Date(record.expires_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isExpired && certification?.id ? (
                    <Link
                      href={`/dashboard/certification/${module.id}?certId=${certification.id}`}
                      className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors"
                    >
                      Retrain
                    </Link>
                  ) : record?.passed && certification?.id ? (
                    <Link
                      href={`/dashboard/certification/${module.id}?certId=${certification.id}&review=true`}
                      className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                    >
                      Review
                    </Link>
                  ) : record && !record.passed && certification?.id ? (
                    <Link
                      href={`/dashboard/certification/${module.id}?certId=${certification.id}`}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                    >
                      Retake
                    </Link>
                  ) : canStart ? (
                    <Link
                      href={`/dashboard/certification/${module.id}?certId=${certification!.id}`}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Start
                    </Link>
                  ) : isLocked ? (
                    <span className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">
                      Locked
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* No certification yet */}
      {!certification?.id && (
        <div className="glass-card p-6 rounded-lg border border-border/50 bg-muted/20">
          <div className="flex items-start gap-4">
            <InfoIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">
                Certification not started yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your organization hasn&apos;t started the SOS Safe certification
                process. Ask your team owner or manager to begin the
                certification — once started, you&apos;ll be able to complete
                training modules here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fully trained congratulations */}
      {allPassed && (
        <div className="glass-card p-6 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-400">
                Training Complete
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                You&apos;ve passed all {modules.length} safety modules.
                Your training is logged for compliance and audit purposes.
                You can review any module at any time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
