"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  NATURE_CHOICES,
  PROTOCOLS,
  UNIVERSAL_ACTIONS,
  protocolFor,
  type ActionStep,
  type IncidentNature,
} from "@/lib/response-protocols"

export interface IncidentEvent {
  t: string // ISO
  kind: string
  label?: string
  note?: string
}

interface PatientFields {
  location: string
  room_number: string
  guest_name: string
  patient_age: string
  patient_sex: string
  patient_description: string
  ems_destination: string
  disposition: string
  notes: string
}

interface Props {
  incidentId: string
  initialNature: string
  initialEvents: IncidentEvent[]
  startedAt: string
  endedAt: string | null
  initial: PatientFields
  handoffToken: string
  facility: {
    primaryHospital: string
    ambulanceEta: string
    aedLocation: string
  }
}

const CPR_BPM = 110
const RHYTHM_CHECK_SECONDS = 120

export function ResponseConsole(props: Props) {
  const router = useRouter()
  const [nature, setNature] = useState<IncidentNature>(
    (props.initialNature as IncidentNature) ?? "unknown",
  )
  const [events, setEvents] = useState<IncidentEvent[]>(props.initialEvents)
  const [patient, setPatient] = useState<PatientFields>(props.initial)
  const [ended, setEnded] = useState(!!props.endedAt)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [metronomeOn, setMetronomeOn] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  const supabase = useMemo(() => createClient(), [])
  const protocol = protocolFor(nature)

  // Tick clock
  useEffect(() => {
    if (ended) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [ended])

  const startMs = useMemo(() => new Date(props.startedAt).getTime(), [props.startedAt])
  const endMs = props.endedAt ? new Date(props.endedAt).getTime() : null
  const elapsedMs = (endMs ?? now) - startMs
  const elapsedLabel = formatElapsed(elapsedMs)

  // Rhythm-check countdown resets each time CPR is (re)started
  const lastCprStart = useMemo(() => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].kind === "cpr_started" || events[i].kind === "cpr_handover") {
        return new Date(events[i].t).getTime()
      }
    }
    return null
  }, [events])

  const rhythmRemaining = lastCprStart
    ? Math.max(0, RHYTHM_CHECK_SECONDS - Math.floor(((endMs ?? now) - lastCprStart) / 1000))
    : null

  // ── Metronome ───────────────────────────────────────────────────────
  const audioCtxRef = useRef<AudioContext | null>(null)
  useEffect(() => {
    if (!metronomeOn) return
    const interval = 60000 / CPR_BPM
    let cancelled = false
    const id = window.setInterval(() => {
      if (cancelled) return
      if (soundOn) click()
    }, interval)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metronomeOn, soundOn])

  const click = () => {
    try {
      if (!audioCtxRef.current) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        if (!Ctor) return
        audioCtxRef.current = new Ctor()
      }
      const ctx = audioCtxRef.current
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      osc.type = "square"
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    } catch {
      /* ignore */
    }
  }

  // Auto-start metronome for protocols that need it
  useEffect(() => {
    if (protocol.showMetronome && !ended) setMetronomeOn(true)
  }, [protocol.showMetronome, ended])

  // ── Persistence ────────────────────────────────────────────────────
  const persist = useCallback(
    async (patch: Partial<{
      events: IncidentEvent[]
      nature: string
      ended_at: string | null
    } & PatientFields>) => {
      setSaving(true)
      setSaveError(null)
      const { error } = await supabase
        .from("response_incidents")
        .update(patch)
        .eq("id", props.incidentId)
      setSaving(false)
      if (error) setSaveError(error.message)
    },
    [supabase, props.incidentId],
  )

  const logAction = useCallback(
    async (step: ActionStep, note?: string) => {
      const ev: IncidentEvent = {
        t: new Date().toISOString(),
        kind: step.kind,
        label: step.label,
        ...(note ? { note } : {}),
      }
      const next = [...events, ev]
      setEvents(next)
      await persist({ events: next })
    },
    [events, persist],
  )

  const addNote = useCallback(async () => {
    const note = window.prompt("Add a timestamped note:")?.trim()
    if (!note) return
    await logAction({ kind: "note", label: "Note" }, note)
  }, [logAction])

  const changeNature = async (n: IncidentNature) => {
    setNature(n)
    const ev: IncidentEvent = {
      t: new Date().toISOString(),
      kind: "nature_changed",
      label: PROTOCOLS[n].title,
    }
    const next = [...events, ev]
    setEvents(next)
    await persist({ nature: n, events: next })
  }

  const updateField = async <K extends keyof PatientFields>(key: K, value: PatientFields[K]) => {
    const nextPatient = { ...patient, [key]: value }
    setPatient(nextPatient)
    await persist({ [key]: value } as Partial<PatientFields>)
  }

  const endIncident = async () => {
    if (!window.confirm("End this response? The clock will stop and the record will be finalised.")) return
    const endedAt = new Date().toISOString()
    const ev: IncidentEvent = { t: endedAt, kind: "incident_ended", label: "Incident ended" }
    const next = [...events, ev]
    setEvents(next)
    setEnded(true)
    await persist({ ended_at: endedAt, events: next })
    router.refresh()
  }

  // ── UI ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header: nature + big clock */}
      <section className="rounded-xl border-2 border-red-500/50 bg-red-500/5 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-red-500 font-semibold flex items-center gap-2">
              {!ended && <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
              {ended ? "Closed" : "Live incident"}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">{protocol.title}</h1>
            {protocol.preArrival && (
              <p className="text-sm text-muted-foreground max-w-2xl">{protocol.preArrival}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Elapsed</div>
            <div className="font-mono tabular-nums text-4xl sm:text-5xl font-bold text-red-500 leading-none">
              {elapsedLabel}
            </div>
          </div>
        </div>

        {/* Metronome + rhythm countdown (shown when CPR protocol is active OR after cpr_started logged) */}
        {(protocol.showMetronome || lastCprStart !== null) && !ended && (
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <Metronome
              on={metronomeOn}
              bpm={CPR_BPM}
              soundOn={soundOn}
              onToggle={() => setMetronomeOn((v) => !v)}
              onSoundToggle={() => setSoundOn((v) => !v)}
            />
            {rhythmRemaining !== null && (
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rhythm check in</div>
                <div className="font-mono tabular-nums text-3xl font-bold">
                  {Math.floor(rhythmRemaining / 60)}:{(rhythmRemaining % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Switch compressors & reassess
                </div>
              </div>
            )}
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Depth & rate</div>
              <div className="text-sm font-semibold">5–6 cm · 100–120/min</div>
              <div className="text-xs text-muted-foreground mt-1">
                Allow full chest recoil. Minimise pauses.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Nature re-classify */}
      <details className="rounded-lg border border-border bg-background">
        <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium">
          Reclassify emergency
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 pt-1">
          {NATURE_CHOICES.map((c) => (
            <button
              key={c.nature}
              type="button"
              onClick={() => changeNature(c.nature)}
              disabled={ended}
              className={`text-left rounded-md border p-2 text-xs disabled:opacity-50 transition-colors ${
                nature === c.nature
                  ? "border-red-500 bg-red-500/15"
                  : "border-border hover:border-red-500/40 hover:bg-muted/40"
              }`}
            >
              <div className="font-semibold">{c.label}</div>
              <div className="text-[11px] text-muted-foreground">{c.blurb}</div>
            </button>
          ))}
        </div>
      </details>

      {/* Protocol actions */}
      {protocol.steps.length > 0 && (
        <section className="rounded-xl border border-border bg-background p-4 space-y-3">
          <h2 className="font-semibold">Protocol actions</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {protocol.steps.map((s) => (
              <ActionButton
                key={s.kind}
                step={s}
                count={events.filter((e) => e.kind === s.kind).length}
                disabled={ended}
                onClick={() => logAction(s)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Universal actions */}
      <section className="rounded-xl border border-border bg-background p-4 space-y-3">
        <h2 className="font-semibold">Coordination</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {UNIVERSAL_ACTIONS.map((s) => (
            <ActionButton
              key={s.kind}
              step={s}
              count={events.filter((e) => e.kind === s.kind).length}
              disabled={ended}
              onClick={s.kind === "note" ? addNote : () => logAction(s)}
            />
          ))}
        </div>
      </section>

      {/* Facility quick-refs */}
      {(props.facility.primaryHospital || props.facility.aedLocation || props.facility.ambulanceEta) && (
        <section className="rounded-xl border border-border bg-muted/20 p-4 grid sm:grid-cols-3 gap-3 text-sm">
          <QuickRef label="Receiving hospital" value={props.facility.primaryHospital} />
          <QuickRef label="AED location" value={props.facility.aedLocation} />
          <QuickRef label="Ambulance ETA" value={props.facility.ambulanceEta} />
        </section>
      )}

      {/* Patient + disposition */}
      <section className="rounded-xl border border-border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="font-semibold">Patient & handover details</h2>
          <CopyHandoffLink token={props.handoffToken} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Room / unit" value={patient.room_number} onChange={(v) => updateField("room_number", v)} disabled={ended} />
          <Field label="Location" value={patient.location} onChange={(v) => updateField("location", v)} disabled={ended} />
          <Field label="Guest name (optional)" value={patient.guest_name} onChange={(v) => updateField("guest_name", v)} disabled={ended} />
          <Field label="Age" value={patient.patient_age} onChange={(v) => updateField("patient_age", v)} disabled={ended} />
          <Field label="Sex" value={patient.patient_sex} onChange={(v) => updateField("patient_sex", v)} disabled={ended} />
          <Field label="Receiving hospital" value={patient.ems_destination} onChange={(v) => updateField("ems_destination", v)} disabled={ended} />
        </div>
        <Textarea
          label="Observations (allergies, meds, what happened)"
          value={patient.patient_description}
          onChange={(v) => updateField("patient_description", v)}
          disabled={ended}
        />
      </section>

      {/* Timeline */}
      <section className="rounded-xl border border-border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Timeline</h2>
          <span className="text-xs text-muted-foreground">
            {events.length} {events.length === 1 ? "event" : "events"}
          </span>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events logged yet.</p>
        ) : (
          <ol className="space-y-1.5 font-mono text-sm">
            {events.map((e, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="tabular-nums text-muted-foreground w-16">
                  +{formatElapsed(new Date(e.t).getTime() - startMs, true)}
                </span>
                <span className="flex-1">
                  <span className="font-semibold">{e.label ?? e.kind}</span>
                  {e.note && <span className="text-muted-foreground"> — {e.note}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Footer: end + status */}
      <section className="rounded-xl border border-border bg-background p-4 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Disposition</span>
            <select
              value={patient.disposition}
              onChange={(e) => updateField("disposition", e.target.value)}
              disabled={ended}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm disabled:opacity-60"
            >
              <option value="">—</option>
              <option value="transported">Transported by EMS</option>
              <option value="resolved_onsite">Resolved on site</option>
              <option value="refused">Patient refused transport</option>
              <option value="deceased">Deceased</option>
              <option value="other">Other</option>
            </select>
          </label>
          <Field
            label="Follow-up notes"
            value={patient.notes}
            onChange={(v) => updateField("notes", v)}
            disabled={ended}
          />
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap pt-2">
          <div className="text-xs text-muted-foreground">
            {saving ? "Saving…" : saveError ? <span className="text-red-500">{saveError}</span> : "Auto-saved"}
          </div>
          {ended ? (
            <span className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground">
              Incident closed
            </span>
          ) : (
            <button
              type="button"
              onClick={endIncident}
              className="rounded-md bg-foreground text-background font-semibold px-4 py-2 text-sm hover:opacity-90"
            >
              End response
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

function ActionButton({
  step,
  count,
  disabled,
  onClick,
}: {
  step: ActionStep
  count: number
  disabled?: boolean
  onClick: () => void
}) {
  const logged = count > 0
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-left rounded-lg border p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        step.critical
          ? "border-red-500/60 bg-red-500/5 hover:bg-red-500/10"
          : "border-border hover:bg-muted/40"
      } ${logged ? "ring-1 ring-primary/40" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-sm">{step.label}</div>
        {logged && (
          <span className="text-[10px] font-mono rounded bg-primary/20 text-primary px-1.5 py-0.5">
            ×{count}
          </span>
        )}
      </div>
      {step.hint && <div className="text-xs text-muted-foreground mt-0.5">{step.hint}</div>}
    </button>
  )
}

function Metronome({
  on,
  bpm,
  soundOn,
  onToggle,
  onSoundToggle,
}: {
  on: boolean
  bpm: number
  soundOn: boolean
  onToggle: () => void
  onSoundToggle: () => void
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          CPR metronome
        </div>
        <button
          type="button"
          onClick={onSoundToggle}
          className="text-[11px] text-muted-foreground hover:text-foreground"
          aria-label="Toggle sound"
        >
          {soundOn ? "🔊 on" : "🔇 off"}
        </button>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`inline-flex h-3.5 w-3.5 rounded-full ${
            on ? "bg-red-500" : "bg-muted-foreground/40"
          }`}
          style={on ? { animation: `pulseDot ${60 / bpm}s ease-in-out infinite` } : undefined}
        />
        <span className="text-2xl font-mono font-bold tabular-nums">{bpm}</span>
        <span className="text-xs text-muted-foreground">bpm</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="mt-2 w-full rounded-md border border-border px-2 py-1 text-xs hover:bg-muted/40"
      >
        {on ? "Pause metronome" : "Start metronome"}
      </button>
      <style jsx>{`
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function CopyHandoffLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    const url = `${window.location.origin}/handoff/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      window.prompt("Copy this handoff link:", url)
    }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs rounded-md border border-border px-2 py-1 hover:bg-muted/40"
    >
      {copied ? "Link copied" : "Copy handoff link"}
    </button>
  )
}

function QuickRef({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value || <span className="text-muted-foreground">—</span>}</div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-500/20"
      />
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <label className="space-y-1 block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-500/20"
      />
    </label>
  )
}

function formatElapsed(ms: number, short = false): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }
  if (short) return `${m}:${sec.toString().padStart(2, "0")}`
  return `${m}:${sec.toString().padStart(2, "0")}`
}
