import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function CasesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get partner membership
  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id")
    .eq("user_id", user?.id)
    .single()

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
      const caseIds = caseParties.map(cp => cp.case_id)
      const { data: casesData } = await supabase
        .from("cases")
        .select("*")
        .in("id", caseIds)
        .order("created_at", { ascending: false })

      cases = casesData || []
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cases</h1>
          <p className="text-muted-foreground mt-1">
            View and manage emergency cases
          </p>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="glass-card p-12 rounded-lg border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No cases yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            When you report an emergency or are involved in a case, it will appear here. 
            Cases are managed by the Tourist SOS Command Center.
          </p>
          <div className="p-4 rounded-lg bg-muted/50 text-sm max-w-md mx-auto">
            <p className="font-medium mb-2">Need to report an emergency?</p>
            <p className="text-muted-foreground">
              Contact Tourist SOS via WhatsApp or your preferred messaging app. 
              Our AI triage system will create a case and coordinate the response.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="glass-card p-6 rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      #{caseItem.case_number}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      caseItem.status === "open" 
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : caseItem.status === "in_progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {caseItem.status.replace("_", " ")}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      caseItem.priority === "critical"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : caseItem.priority === "high"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {caseItem.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {caseItem.city}, {caseItem.country}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(caseItem.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
