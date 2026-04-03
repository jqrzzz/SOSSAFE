import { createClient } from "@/lib/supabase/server"
import { CasesClient } from "./CasesClient"

export default async function CasesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get partner membership
  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, partners(name)")
    .eq("user_id", user?.id)
    .is("removed_at", null)
    .single()

  const partners = membership?.partners as unknown as { name: string } | null
  const partnerName = partners?.name || "Your Organization"

  // Get cases where this partner is involved via case_parties
  let cases: Array<{
    id: string
    case_number: string
    status: string
    priority: string
    created_at: string
    country: string
    city: string
  }> = []

  if (membership?.partner_id) {
    const { data: caseParties } = await supabase
      .from("case_parties")
      .select("case_id")
      .eq("party_id", membership.partner_id)
      .eq("party_type", "other")

    if (caseParties && caseParties.length > 0) {
      const caseIds = caseParties.map((cp) => cp.case_id)
      const { data: casesData } = await supabase
        .from("cases")
        .select("*")
        .in("id", caseIds)
        .order("created_at", { ascending: false })

      cases = casesData || []
    }
  }

  return <CasesClient cases={cases} partnerName={partnerName} />
}
