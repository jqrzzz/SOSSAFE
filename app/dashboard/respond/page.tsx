import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { StartIncidentForm } from "./StartIncidentForm"
import { natureLabel } from "@/lib/response-protocols"

function elapsed(from: string, to?: string | null) {
  const start = new Date(from).getTime()
  const end = to ? new Date(to).getTime() : Date.now()
  const s = Math.max(0, Math.floor((end - start) / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m >= 60) {
    const h = Math.floor(m / 60)
    return `${h}h ${m % 60}m`
  }
  return `${m}m ${r.toString().padStart(2, "0")}s`
}

export default async function RespondPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, role, partners(name)")
    .eq("user_id", user.id)
    .is("removed_at", null)
    .single()

  if (!membership?.partner_id) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Emergency Response</h1>
        <p className="text-muted-foreground">
          Complete your partner profile before using the response console.
        </p>
        <Link href="/dashboard/profile" className="text-primary underline">
          Go to Profile
        </Link>
      </div>
    )
  }

  type IncidentRow = {
    id: string
    nature: string
    location: string | null
    room_number: string | null
    started_at: string
    ended_at: string | null
  }

  const { data: incidents, error } = await supabase
    .from("response_incidents")
    .select("id, nature, location, room_number, started_at, ended_at")
    .eq("partner_id", membership.partner_id)
    .order("started_at", { ascending: false })
    .limit(25)

  const rows: IncidentRow[] = error ? [] : (incidents ?? [])
  const active = rows.filter((i) => !i.ended_at)
  const past = rows.filter((i) => i.ended_at)

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-3xl font-bold">Emergency Response</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          One-tap console for a live medical emergency. Starts a timer, walks
          your staff through the protocol, and builds a timestamped handover
          for paramedics. Use it the moment someone shouts for help.
        </p>
      </header>

      {active.length > 0 && (
        <section className="rounded-xl border border-red-500/40 bg-red-500/5 p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wide text-xs">
            <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Live — {active.length} in progress
          </div>
          <div className="divide-y divide-border">
            {active.map((i) => (
              <Link
                key={i.id}
                href={`/dashboard/respond/${i.id}`}
                className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors"
              >
                <div>
                  <div className="font-semibold">{natureLabel(i.nature)}</div>
                  <div className="text-sm text-muted-foreground">
                    {[i.room_number, i.location].filter(Boolean).join(" · ") || "Location unset"}
                  </div>
                </div>
                <div className="text-right font-mono text-lg tabular-nums text-red-500">
                  {elapsed(i.started_at)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <StartIncidentForm partnerId={membership.partner_id} userId={user.id} />

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Recent incidents</h2>
          <div className="rounded-lg border border-border divide-y divide-border">
            {past.map((i) => (
              <Link
                key={i.id}
                href={`/dashboard/respond/${i.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <div className="font-medium">{natureLabel(i.nature)}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(i.started_at).toLocaleString()}
                    {" · "}
                    {[i.room_number, i.location].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-mono tabular-nums">
                  {elapsed(i.started_at, i.ended_at)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {error && (
        <p className="text-xs text-muted-foreground">
          Response incidents table not yet migrated. Run
          <code className="mx-1 rounded bg-muted px-1 py-0.5">scripts/009_create_response_incidents_table.sql</code>
          to enable persistence.
        </p>
      )}
    </div>
  )
}
