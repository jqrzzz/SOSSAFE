import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ResponseConsole, type IncidentEvent } from "./ResponseConsole"

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: incident } = await supabase
    .from("response_incidents")
    .select(
      "id, partner_id, nature, location, room_number, guest_name, patient_age, patient_sex, patient_description, ems_destination, disposition, notes, events, started_at, ended_at, handoff_token",
    )
    .eq("id", id)
    .single()

  if (!incident) notFound()

  // Pull hospital + AED info from facility assessment (best-effort, non-blocking)
  const { data: facilityRows } = await supabase
    .from("facility_assessments")
    .select("question_id, answer")
    .eq("partner_id", incident.partner_id)

  const facility: Record<string, string> = {}
  for (const r of facilityRows ?? []) {
    if (r.question_id && typeof r.answer === "string") facility[r.question_id] = r.answer
  }

  const events = (Array.isArray(incident.events) ? incident.events : []) as IncidentEvent[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Link
          href="/dashboard/respond"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All incidents
        </Link>
        <Link
          href={`/dashboard/respond/${incident.id}/handoff`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Paramedic handoff →
        </Link>
      </div>

      <ResponseConsole
        incidentId={incident.id}
        initialNature={incident.nature}
        initialEvents={events}
        startedAt={incident.started_at}
        endedAt={incident.ended_at}
        initial={{
          location: incident.location ?? "",
          room_number: incident.room_number ?? "",
          guest_name: incident.guest_name ?? "",
          patient_age: incident.patient_age ?? "",
          patient_sex: incident.patient_sex ?? "",
          patient_description: incident.patient_description ?? "",
          ems_destination: incident.ems_destination ?? "",
          disposition: incident.disposition ?? "",
          notes: incident.notes ?? "",
        }}
        handoffToken={incident.handoff_token}
        facility={{
          primaryHospital: facility["primary_hospital"] ?? facility["hospital_name"] ?? "",
          ambulanceEta: facility["ambulance_eta"] ?? "",
          aedLocation: facility["aed_location"] ?? "",
        }}
      />
    </div>
  )
}
