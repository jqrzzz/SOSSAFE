import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

interface CaseDetailPageProps {
  params: Promise<{ caseId: string }>
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { caseId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verify user's partner is linked to this case
  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id")
    .eq("user_id", user?.id)
    .is("removed_at", null)
    .single()

  if (!membership?.partner_id) return notFound()

  const { data: caseParty } = await supabase
    .from("case_parties")
    .select("case_id")
    .eq("case_id", caseId)
    .eq("party_id", membership.partner_id)
    .single()

  if (!caseParty) return notFound()

  // Fetch the case
  const { data: caseData } = await supabase
    .from("cases")
    .select("*")
    .eq("id", caseId)
    .single()

  if (!caseData) return notFound()

  // Fetch all parties involved in this case
  const { data: parties } = await supabase
    .from("case_parties")
    .select("*")
    .eq("case_id", caseId)

  // Fetch case events/timeline (may not exist yet — table created by SOSCOMMAND)
  const { data: events } = await supabase
    .from("case_events")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true })

  const statusStyle = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "resolved":
      case "closed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const priorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const partyTypeLabel = (type: string) => {
    switch (type) {
      case "patient":
        return "Patient"
      case "provider":
        return "Medical Provider"
      case "other":
        return "Partner"
      case "ems":
        return "EMS"
      default:
        return type
    }
  }

  return (
    <div className="space-y-8">
      {/* Back + header */}
      <div>
        <Link
          href="/dashboard/cases"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cases
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Case #{caseData.case_number}</h1>
            </div>
            <p className="text-muted-foreground">
              {caseData.city && caseData.country
                ? `${caseData.city}, ${caseData.country}`
                : "Location not specified"}
              {" — "}
              Opened {new Date(caseData.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(caseData.status)}`}>
              {caseData.status?.replace("_", " ")}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyle(caseData.priority)}`}>
              {caseData.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Case details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
          <p className="text-lg font-semibold capitalize">{caseData.status?.replace("_", " ")}</p>
        </div>
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Priority</p>
          <p className="text-lg font-semibold capitalize">{caseData.priority}</p>
        </div>
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Case ID</p>
          <p className="text-lg font-semibold font-mono">{caseData.case_number}</p>
        </div>
      </div>

      {/* Parties involved */}
      {parties && parties.length > 0 && (
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <h2 className="font-semibold mb-4">Parties Involved</h2>
          <div className="space-y-3">
            {parties.map((party: { id: string; party_type: string; party_id: string }) => (
              <div key={party.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {partyTypeLabel(party.party_type).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{partyTypeLabel(party.party_type)}</p>
                  {party.party_id === membership.partner_id && (
                    <p className="text-xs text-muted-foreground">Your organization</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline / Events */}
      <div className="glass-card p-6 rounded-lg border border-border/50">
        <h2 className="font-semibold mb-4">Case Timeline</h2>

        {events && events.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {events.map((event: { id: string; event_type: string; description: string; created_at: string; metadata?: Record<string, unknown> }) => (
                <div key={event.id} className="relative pl-10">
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <div>
                    <p className="text-sm font-medium">{event.event_type?.replace(/_/g, " ")}</p>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Case timeline events are managed by the Tourist SOS Command Center.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Events will appear here as the case progresses.
            </p>
          </div>
        )}
      </div>

      {/* Communication note */}
      <div className="glass-card p-6 rounded-lg border border-border/50 bg-muted/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-sm">Real-time communication</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Active case coordination happens via your preferred messaging platform (WhatsApp, LINE, etc.)
              with the Tourist SOS Command Center. This dashboard provides a record of all actions and outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
