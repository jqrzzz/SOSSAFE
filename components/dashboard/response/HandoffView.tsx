import { protocolFor } from "@/lib/response-protocols"
import type { IncidentEvent } from "@/app/dashboard/respond/[id]/ResponseConsole"

interface Props {
  partner: {
    name: string
    city: string
    country: string
    address: string
    phone: string
  }
  incident: {
    nature: string
    started_at: string
    ended_at: string | null
    location: string | null
    room_number: string | null
    guest_name: string | null
    patient_age: string | null
    patient_sex: string | null
    patient_description: string | null
    ems_destination: string | null
    disposition: string | null
    notes: string | null
    events: IncidentEvent[]
    handoff_token: string
  }
}

export function HandoffView({ partner, incident }: Props) {
  const started = new Date(incident.started_at)
  const ended = incident.ended_at ? new Date(incident.ended_at) : null
  const durationSec = Math.max(
    0,
    Math.floor(((ended?.getTime() ?? Date.now()) - started.getTime()) / 1000),
  )
  const duration = `${Math.floor(durationSec / 60)}m ${(durationSec % 60).toString().padStart(2, "0")}s`
  const protocol = protocolFor(incident.nature)
  const startMs = started.getTime()

  // Highlight critical actions
  const keyActions = [
    "ems_called",
    "cpr_started",
    "aed_attached",
    "shock_delivered",
    "aspirin_given",
    "epi_given",
    "epi_given_2",
    "rosc",
    "ems_arrived",
  ]
  const summary: { label: string; first: Date; count: number }[] = []
  for (const k of keyActions) {
    const matches = incident.events.filter((e) => e.kind === k)
    if (matches.length > 0) {
      summary.push({
        label: matches[0].label ?? k,
        first: new Date(matches[0].t),
        count: matches.length,
      })
    }
  }

  return (
    <article className="rounded-xl border-2 border-border bg-background p-6 sm:p-8 print:border-0 print:p-0 print:text-black print:bg-white">
      <header className="border-b border-border pb-4 mb-4 flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground print:text-gray-600">
            Pre-hospital handover · SOS Safe
          </div>
          <h1 className="text-2xl font-bold mt-1">{protocol.title}</h1>
          <div className="text-sm text-muted-foreground print:text-gray-700">
            {partner.name} · {[partner.city, partner.country].filter(Boolean).join(", ")}
            {partner.phone && <> · {partner.phone}</>}
          </div>
        </div>
        <div className="text-right text-sm">
          <div>
            <span className="text-muted-foreground print:text-gray-600">Incident started</span>{" "}
            <span className="font-mono">{started.toLocaleString()}</span>
          </div>
          {ended && (
            <div>
              <span className="text-muted-foreground print:text-gray-600">Ended</span>{" "}
              <span className="font-mono">{ended.toLocaleString()}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground print:text-gray-600">Duration</span>{" "}
            <span className="font-mono">{duration}</span>
          </div>
        </div>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-5">
        <Field label="Location">
          {[incident.room_number, incident.location].filter(Boolean).join(" · ") || "—"}
        </Field>
        <Field label="Patient">
          {incident.guest_name || "Unnamed"}
          {(incident.patient_age || incident.patient_sex) && (
            <span className="text-muted-foreground print:text-gray-700">
              {" · "}
              {[incident.patient_age, incident.patient_sex].filter(Boolean).join(" / ")}
            </span>
          )}
        </Field>
        <Field label="Destination / disposition">
          {incident.ems_destination || "—"}
          {incident.disposition && (
            <span className="text-muted-foreground print:text-gray-700"> · {incident.disposition.replace(/_/g, " ")}</span>
          )}
        </Field>
      </section>

      {incident.patient_description && (
        <section className="mb-5">
          <FieldLabel>Observations</FieldLabel>
          <p className="text-sm whitespace-pre-wrap">{incident.patient_description}</p>
        </section>
      )}

      {summary.length > 0 && (
        <section className="mb-5">
          <FieldLabel>Key interventions</FieldLabel>
          <ul className="grid sm:grid-cols-2 gap-1 mt-1 text-sm">
            {summary.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-muted-foreground print:text-gray-600 w-16">
                  +{formatDelta(s.first.getTime() - startMs)}
                </span>
                <span className="font-medium">{s.label}</span>
                {s.count > 1 && <span className="text-xs text-muted-foreground">×{s.count}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <FieldLabel>Full timeline</FieldLabel>
        {incident.events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events recorded.</p>
        ) : (
          <ol className="mt-1 space-y-0.5 font-mono text-xs">
            {incident.events.map((e, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="tabular-nums text-muted-foreground print:text-gray-600 w-20">
                  +{formatDelta(new Date(e.t).getTime() - startMs)}
                </span>
                <span className="tabular-nums text-muted-foreground print:text-gray-600 w-20">
                  {new Date(e.t).toLocaleTimeString()}
                </span>
                <span className="flex-1">
                  <span className="font-semibold">{e.label ?? e.kind}</span>
                  {e.note && <span> — {e.note}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {incident.notes && (
        <section className="mt-5">
          <FieldLabel>Follow-up notes</FieldLabel>
          <p className="text-sm whitespace-pre-wrap">{incident.notes}</p>
        </section>
      )}

      <footer className="mt-6 pt-3 border-t border-border text-[11px] text-muted-foreground print:text-gray-600 flex items-center justify-between flex-wrap gap-2">
        <span>Handover ref: {incident.handoff_token}</span>
        <span>Generated by SOS Safe response console</span>
      </footer>
    </article>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="text-sm mt-0.5">{children}</div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground print:text-gray-600 font-semibold">
      {children}
    </div>
  )
}

function formatDelta(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, "0")}`
}
