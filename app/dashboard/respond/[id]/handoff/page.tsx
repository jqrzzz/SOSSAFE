import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { HandoffView } from "@/components/dashboard/response/HandoffView"
import { PrintButton } from "@/components/dashboard/response/PrintButton"
import type { IncidentEvent } from "../ResponseConsole"

export default async function IncidentHandoffPage({
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

  const { data: partner } = await supabase
    .from("partners")
    .select("name, city, country, address, phone")
    .eq("id", incident.partner_id)
    .single()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap print:hidden">
        <Link
          href={`/dashboard/respond/${incident.id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to console
        </Link>
        <PrintButton />

      </div>

      <HandoffView
        partner={{
          name: partner?.name ?? "—",
          city: partner?.city ?? "",
          country: partner?.country ?? "",
          address: partner?.address ?? "",
          phone: partner?.phone ?? "",
        }}
        incident={{
          nature: incident.nature,
          started_at: incident.started_at,
          ended_at: incident.ended_at,
          location: incident.location,
          room_number: incident.room_number,
          guest_name: incident.guest_name,
          patient_age: incident.patient_age,
          patient_sex: incident.patient_sex,
          patient_description: incident.patient_description,
          ems_destination: incident.ems_destination,
          disposition: incident.disposition,
          notes: incident.notes,
          events: (Array.isArray(incident.events) ? incident.events : []) as IncidentEvent[],
          handoff_token: incident.handoff_token,
        }}
      />
    </div>
  )
}
