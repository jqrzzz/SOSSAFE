"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PASSING_SCORE } from "@/lib/certification-data"

interface Member {
  id: string
  user_id: string
  role: string
  is_primary_contact: boolean
  invited_at: string | null
  accepted_at: string | null
}

interface TrainingRecord {
  user_id: string
  module_id: string
  score: number
  passed: boolean
  completed_at: string
  expires_at: string | null
}

interface ModuleSummary {
  id: string
  title: string
  description: string
  icon: string
  questions: number
}

interface TeamClientProps {
  partnerId: string
  partnerName: string
  currentUserId: string
  currentUserEmail: string
  currentUserRole: string
  members: Member[]
  trainingData: TrainingRecord[]
  modules: ModuleSummary[]
}

export function TeamClient({
  partnerId,
  partnerName,
  currentUserId,
  currentUserEmail,
  currentUserRole,
  members: initialMembers,
  trainingData,
  modules,
}: TeamClientProps) {
  const [members, setMembers] = useState(initialMembers)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"members" | "training">("members")
  const isOwner = currentUserRole === "owner"

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  const generateInviteLink = (role: "manager" | "staff") => {
    return `${baseUrl}/auth/sign-up?invite=${partnerId}&role=${role}`
  }

  const copyLink = async (role: "manager" | "staff") => {
    const link = generateInviteLink(role)
    await navigator.clipboard.writeText(link)
    setCopiedLink(role)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const removeMember = async (membershipId: string) => {
    if (!confirm("Remove this team member? They will lose access to the dashboard."))
      return

    setRemovingId(membershipId)
    const supabase = createClient()
    const { error } = await supabase
      .from("partner_memberships")
      .update({ removed_at: new Date().toISOString() })
      .eq("id", membershipId)

    if (!error) {
      setMembers(prev => prev.filter(m => m.id !== membershipId))
    }
    setRemovingId(null)
  }

  const roleLabel = (role: string) => {
    switch (role) {
      case "owner": return "Owner"
      case "manager": return "Manager"
      case "staff": return "Staff"
      default: return role
    }
  }

  const roleBadgeStyle = (role: string) => {
    switch (role) {
      case "owner": return "bg-primary/10 text-primary"
      case "manager": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "staff": return "bg-muted text-muted-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  // Build training lookup: { userId: { moduleId: TrainingRecord } }
  const trainingByUser: Record<string, Record<string, TrainingRecord>> = {}
  for (const record of trainingData) {
    if (!trainingByUser[record.user_id]) {
      trainingByUser[record.user_id] = {}
    }
    trainingByUser[record.user_id][record.module_id] = record
  }

  // Training stats
  const totalModules = modules.length
  const fullyTrainedCount = members.filter((m) => {
    const userTraining = trainingByUser[m.user_id]
    if (!userTraining) return false
    return modules.every((mod) => userTraining[mod.id]?.passed)
  }).length

  const partiallyTrainedCount = members.filter((m) => {
    const userTraining = trainingByUser[m.user_id]
    if (!userTraining) return false
    const passedCount = modules.filter((mod) => userTraining[mod.id]?.passed).length
    return passedCount > 0 && passedCount < totalModules
  }).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">
          {partnerName} — {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Training overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Members</p>
          <p className="text-2xl font-bold">{members.length}</p>
        </div>
        <div className="glass-card p-4 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fully Trained</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{fullyTrainedCount}</p>
          <p className="text-xs text-muted-foreground">All {totalModules} modules passed</p>
        </div>
        <div className="glass-card p-4 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{partiallyTrainedCount}</p>
          <p className="text-xs text-muted-foreground">Some modules completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50 w-fit">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "members"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveTab("training")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "training"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Training Status
        </button>
      </div>

      {activeTab === "members" && (
        <>
          {/* Invite section — owners only */}
          {isOwner && (
            <div className="glass-card p-6 rounded-lg border border-primary/20 bg-primary/5">
              <h2 className="font-semibold mb-1">Invite Team Members</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Share an invite link with your staff. When they sign up using this link,
                they will automatically join your team.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => copyLink("staff")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {copiedLink === "staff" ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4" />
                      Copy Staff Invite Link
                    </>
                  )}
                </button>
                <button
                  onClick={() => copyLink("manager")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  {copiedLink === "manager" ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4" />
                      Copy Manager Invite Link
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Managers can view cases and certification status. Staff can complete training modules.
              </p>
            </div>
          )}

          {/* Team members list */}
          <div className="space-y-3">
            {members.map((member) => {
              const isCurrentUser = member.user_id === currentUserId
              const isPending = !member.accepted_at
              const userTraining = trainingByUser[member.user_id]
              const passedModuleCount = userTraining
                ? modules.filter((mod) => userTraining[mod.id]?.passed).length
                : 0

              return (
                <div
                  key={member.id}
                  className={`glass-card p-4 rounded-lg border transition-colors ${
                    isPending ? "border-border/30 opacity-70" : "border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${roleBadgeStyle(member.role)}`}
                      >
                        {member.role === "owner" ? "O" : member.role === "manager" ? "M" : "S"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {isCurrentUser ? currentUserEmail : "Team member"}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs text-muted-foreground">(you)</span>
                          )}
                          {isPending && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle(member.role)}`}>
                            {roleLabel(member.role)}
                          </span>
                          {member.is_primary_contact && (
                            <span className="text-xs text-muted-foreground">Primary contact</span>
                          )}
                          {/* Training badge */}
                          {passedModuleCount === totalModules ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Fully trained
                            </span>
                          ) : passedModuleCount > 0 ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              {passedModuleCount}/{totalModules} modules
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {member.accepted_at
                          ? `Joined ${new Date(member.accepted_at).toLocaleDateString()}`
                          : member.invited_at
                            ? `Invited ${new Date(member.invited_at).toLocaleDateString()}`
                            : ""}
                      </span>
                      {isOwner && !isCurrentUser && (
                        <button
                          onClick={() => removeMember(member.id)}
                          disabled={removingId === member.id}
                          className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          title="Remove member"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Roles explanation */}
          <div className="glass-card p-6 rounded-lg border border-border/50">
            <h3 className="font-semibold mb-4">Team Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle("owner")}`}>Owner</span>
                <p className="text-sm text-muted-foreground mt-2">
                  Full access. Manage team, view all cases, complete certification, update profile.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle("manager")}`}>Manager</span>
                <p className="text-sm text-muted-foreground mt-2">
                  View cases, certification status, and training progress. Cannot manage team.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle("staff")}`}>Staff</span>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete training modules and view their own training status.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "training" && (
        <>
          {/* Training matrix */}
          <div className="glass-card rounded-lg border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="font-semibold">Training Progress</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Track which team members have completed each safety module.
                Passing score: {PASSING_SCORE}%.
              </p>
            </div>

            {members.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No team members yet. Invite staff to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Team Member
                      </th>
                      {modules.map((mod) => (
                        <th
                          key={mod.id}
                          className="text-center p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[140px]"
                        >
                          <span className="text-base block mb-0.5">{mod.icon}</span>
                          {mod.title.replace("Assessment", "").replace("Protocols", "").trim()}
                        </th>
                      ))}
                      <th className="text-center p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => {
                      const isCurrentUser = member.user_id === currentUserId
                      const userTraining = trainingByUser[member.user_id] || {}
                      const passedCount = modules.filter((mod) => userTraining[mod.id]?.passed).length

                      return (
                        <tr key={member.id} className="border-b border-border/30 last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${roleBadgeStyle(member.role)}`}
                              >
                                {member.role === "owner" ? "O" : member.role === "manager" ? "M" : "S"}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {isCurrentUser ? currentUserEmail : "Team member"}
                                  {isCurrentUser && (
                                    <span className="text-xs text-muted-foreground ml-1">(you)</span>
                                  )}
                                </p>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${roleBadgeStyle(member.role)}`}>
                                  {roleLabel(member.role)}
                                </span>
                              </div>
                            </div>
                          </td>

                          {modules.map((mod) => {
                            const record = userTraining[mod.id]
                            const daysUntilExpiry = record?.expires_at
                              ? Math.ceil((new Date(record.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                              : null
                            const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0
                            const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 60

                            return (
                              <td key={mod.id} className="p-4 text-center">
                                {record ? (
                                  <div>
                                    <div
                                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-1 ${
                                        isExpired
                                          ? "bg-orange-100 dark:bg-orange-900/30"
                                          : record.passed
                                            ? "bg-green-100 dark:bg-green-900/30"
                                            : "bg-red-100 dark:bg-red-900/30"
                                      }`}
                                    >
                                      {isExpired ? (
                                        <ClockIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                      ) : record.passed ? (
                                        <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                      ) : (
                                        <XIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                      )}
                                    </div>
                                    <p
                                      className={`text-xs font-medium ${
                                        isExpired
                                          ? "text-orange-600 dark:text-orange-400"
                                          : record.passed
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {isExpired ? "Expired" : `${record.score}%`}
                                    </p>
                                    <p className={`text-xs ${isExpiringSoon ? "text-orange-500 font-medium" : "text-muted-foreground"}`}>
                                      {isExpired
                                        ? "Retrain needed"
                                        : isExpiringSoon
                                          ? `${daysUntilExpiry}d left`
                                          : new Date(record.completed_at).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                            })}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/50">
                                    <span className="text-xs text-muted-foreground">—</span>
                                  </div>
                                )}
                              </td>
                            )
                          })}

                          <td className="p-4 text-center">
                            {passedCount === totalModules ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <CheckIcon className="w-3 h-3" />
                                Complete
                              </span>
                            ) : passedCount > 0 ? (
                              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                {passedCount}/{totalModules}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-muted/50">
                                Not started
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Module descriptions */}
          <div className="glass-card p-6 rounded-lg border border-border/50">
            <h3 className="font-semibold mb-4">Training Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modules.map((mod) => (
                <div key={mod.id} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{mod.icon}</span>
                    <h4 className="font-medium text-sm">{mod.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{mod.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {mod.questions} questions — {PASSING_SCORE}% to pass
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Note about training */}
          <div className="glass-card p-6 rounded-lg border border-border/50 bg-muted/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <InfoIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">How staff training works</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Each team member completes the same safety assessment modules used for your
                  organization&apos;s SOS Safe certification. Their individual scores are tracked here so
                  you can verify that all staff are trained to the same standard. Training records
                  can be used for insurance compliance and safety audits.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
