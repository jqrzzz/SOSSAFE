import { createAdminClient } from "@/lib/admin"
import { PartnerListClient } from "@/components/admin/PartnerListClient"

export default async function AdminPartnersPage() {
  const supabase = createAdminClient()

  const [{ data: partners }, { data: memberships }, { data: certifications }] = await Promise.all([
    supabase
      .from("partners")
      .select("id, name, type, property_type, country, city, subscription_status, trial_ends_at, created_at, email")
      .order("created_at", { ascending: false }),
    supabase
      .from("partner_memberships")
      .select("partner_id")
      .is("removed_at", null),
    supabase
      .from("certifications")
      .select("partner_id, tier, status"),
  ])

  // Count team members per partner
  const teamCounts: Record<string, number> = {}
  for (const m of memberships || []) {
    teamCounts[m.partner_id] = (teamCounts[m.partner_id] || 0) + 1
  }

  // Best certification per partner
  const certMap: Record<string, { tier: string; status: string }> = {}
  const tierRank: Record<string, number> = { basic: 1, premium: 2, elite: 3 }
  for (const c of certifications || []) {
    const existing = certMap[c.partner_id]
    const rank = tierRank[c.tier] || 0
    const existingRank = existing ? (tierRank[existing.tier] || 0) : -1
    if (rank > existingRank || (rank === existingRank && c.status === "approved")) {
      certMap[c.partner_id] = { tier: c.tier, status: c.status }
    }
  }

  const enriched = (partners || []).map((p) => ({
    ...p,
    teamSize: teamCounts[p.id] || 0,
    certification: certMap[p.id] || null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partners</h1>
        <p className="text-sm text-muted-foreground mt-1">{enriched.length} total partners</p>
      </div>
      <PartnerListClient partners={enriched} />
    </div>
  )
}
