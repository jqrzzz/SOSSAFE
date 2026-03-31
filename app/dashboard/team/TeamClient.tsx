"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Member {
  id: string
  user_id: string
  role: string
  is_primary_contact: boolean
  invited_at: string | null
  accepted_at: string | null
}

interface TeamClientProps {
  partnerId: string
  partnerName: string
  currentUserId: string
  currentUserEmail: string
  currentUserRole: string
  members: Member[]
}

export function TeamClient({
  partnerId,
  partnerName,
  currentUserId,
  currentUserEmail,
  currentUserRole,
  members,
}: TeamClientProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
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
    await supabase
      .from("partner_memberships")
      .update({ removed_at: new Date().toISOString() })
      .eq("id", membershipId)

    // Reload page to refresh server data
    window.location.reload()
  }

  const roleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Owner"
      case "manager":
        return "Manager"
      case "staff":
        return "Staff"
      default:
        return role
    }
  }

  const roleBadgeStyle = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-primary/10 text-primary"
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "staff":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">
          {partnerName} — {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>

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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${roleBadgeStyle(
                      member.role,
                    )}`}
                  >
                    {member.role === "owner"
                      ? "O"
                      : member.role === "manager"
                        ? "M"
                        : "S"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {isCurrentUser ? currentUserEmail : `Team member`}
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle(
                          member.role,
                        )}`}
                      >
                        {roleLabel(member.role)}
                      </span>
                      {member.is_primary_contact && (
                        <span className="text-xs text-muted-foreground">
                          Primary contact
                        </span>
                      )}
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
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle("owner")}`}>
              Owner
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              Full access. Manage team, view all cases, complete certification, update profile.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle("manager")}`}>
              Manager
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              View cases, certification status, and training progress. Cannot manage team.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyle("staff")}`}>
              Staff
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              Complete training modules and view their own training status.
            </p>
          </div>
        </div>
      </div>
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
