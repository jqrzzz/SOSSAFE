import { createClient } from "@/lib/supabase/server"
import { TeamClient } from "./TeamClient"
import { getModuleSummaries } from "@/lib/certification-data"

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get current user's membership + partner
  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, role, partners(name)")
    .eq("user_id", user?.id)
    .is("removed_at", null)
    .single()

  if (!membership?.partner_id) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">
            Complete your partner profile first to manage your team.
          </p>
        </div>
      </div>
    )
  }

  // Get all active members for this partner
  const { data: members } = await supabase
    .from("partner_memberships")
    .select("id, user_id, role, is_primary_contact, invited_at, accepted_at")
    .eq("partner_id", membership.partner_id)
    .is("removed_at", null)
    .order("created_at", { ascending: true })

  // Get training completions for all members
  const { data: trainingData } = await supabase
    .from("staff_training_completions")
    .select("user_id, module_id, score, passed, completed_at, expires_at")
    .eq("partner_id", membership.partner_id)

  const partners = membership.partners as unknown as { name: string } | null
  const partnerName = partners?.name || "Your Organization"

  // Module definitions for display
  const modules = getModuleSummaries()

  return (
    <TeamClient
      partnerId={membership.partner_id}
      partnerName={partnerName}
      currentUserId={user?.id || ""}
      currentUserEmail={user?.email || ""}
      currentUserRole={membership.role}
      members={members || []}
      trainingData={trainingData || []}
      modules={modules}
    />
  )
}
