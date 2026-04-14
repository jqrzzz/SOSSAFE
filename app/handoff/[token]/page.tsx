import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { HandoffView } from "@/components/dashboard/response/HandoffView"
import { PrintButton } from "@/components/dashboard/response/PrintButton"
import type { IncidentEvent } from "@/app/dashboard/respond/[id]/ResponseConsole"

export const dynamic = "force-dynamic"

interface HandoffRow {
  id: string
  partner_id: string
  started_at: string
  ended_at: string | null
  nature: string
  location: string | null
  room_number: string | null
  guest_name: string | null
  patient_age: string | null
  patient_sex: string | null
  patient_description: string | null
  ems_destination: string | null
  disposition: string | null
  notes: string | null
  events: unknown
  partner_name: string | null
  partner_city: string | null
  partner_country: string | null
  partner_address: string | null
  partner_phone: string | null
}

export default async function PublicHandoffPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_incident_by_handoff_token", {
    p_token: token,
  })

  if (error || !data || (Array.isArray(data) && data.length === 0)) notFound()

  const row: HandoffRow = Array.isArray(data) ? data[0] : (data as HandoffRow)

  return (
    <div className="min-h-screen bg-muted/20 print:bg-white">
      <div className="container mx-auto max-w-4xl px-4 py-6 print:px-0 print:py-0 space-y-4">
        <header className="flex items-center justify-between gap-2 flex-wrap print:hidden">
          <div className="text-sm text-muted-foreground">
            SOS Safe · Pre-hospital handover
          </div>
          <PrintButton />
        </header>

        <HandoffView
          partner={{
            name: row.partner_name ?? "—",
            city: row.partner_city ?? "",
            country: row.partner_country ?? "",
            address: row.partner_address ?? "",
            phone: row.partner_phone ?? "",
          }}
          incident={{
            nature: row.nature,
            started_at: row.started_at,
            ended_at: row.ended_at,
            location: row.location,
            room_number: row.room_number,
            guest_name: row.guest_name,
            patient_age: row.patient_age,
            patient_sex: row.patient_sex,
            patient_description: row.patient_description,
            ems_destination: row.ems_destination,
            disposition: row.disposition,
            notes: row.notes,
            events: (Array.isArray(row.events) ? row.events : []) as IncidentEvent[],
            handoff_token: token,
          }}
        />
      </div>
    </div>
  )
}
