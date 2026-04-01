import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CATEGORIES } from "@/lib/knowledge-categories"
import { KnowledgeClient } from "./KnowledgeClient"

export default async function KnowledgePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Get partner membership
  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, role, partners(name)")
    .eq("user_id", user.id)
    .is("removed_at", null)
    .single()

  if (!membership?.partner_id) redirect("/onboarding")

  // Fetch knowledge entries for this partner
  const { data: entries } = await supabase
    .from("partner_local_knowledge")
    .select("*")
    .eq("partner_id", membership.partner_id)
    .order("created_at", { ascending: false })

  // Get team member names for display
  const userIds = [
    ...new Set((entries ?? []).map((e) => e.submitted_by)),
  ]
  let userMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: members } = await supabase
      .from("partner_memberships")
      .select("user_id")
      .eq("partner_id", membership.partner_id)
      .is("removed_at", null)

    // We can't query auth.users directly, but user_id is available
    // Use email from user metadata if accessible, otherwise use short ID
    if (members) {
      for (const m of members) {
        userMap[m.user_id] = m.user_id === user.id ? "You" : m.user_id.slice(0, 8)
      }
    }
  }

  const partners = membership.partners as unknown as { name: string } | null
  const partnerName = partners?.name ?? "Your Organization"
  const canManage = membership.role === "owner" || membership.role === "manager"

  return (
    <KnowledgeClient
      entries={entries ?? []}
      categories={CATEGORIES}
      partnerId={membership.partner_id}
      userId={user.id}
      partnerName={partnerName}
      canManage={canManage}
      userMap={userMap}
    />
  )
}
