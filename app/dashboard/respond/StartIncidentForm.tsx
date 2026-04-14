"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { NATURE_CHOICES, type IncidentNature } from "@/lib/response-protocols"

interface Props {
  partnerId: string
  userId: string
}

export function StartIncidentForm({ partnerId, userId }: Props) {
  const router = useRouter()
  const [nature, setNature] = useState<IncidentNature>("cardiac_arrest")
  const [location, setLocation] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleStart = () => {
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const startedAt = new Date().toISOString()
      const { data, error: insertError } = await supabase
        .from("response_incidents")
        .insert({
          partner_id: partnerId,
          started_by: userId,
          nature,
          location: location.trim() || null,
          room_number: roomNumber.trim() || null,
          started_at: startedAt,
          events: [
            {
              t: startedAt,
              kind: "incident_started",
              note: NATURE_CHOICES.find((n) => n.nature === nature)?.label ?? nature,
            },
          ],
        })
        .select("id")
        .single()

      if (insertError || !data) {
        setError(insertError?.message ?? "Could not start incident")
        return
      }
      router.push(`/dashboard/respond/${data.id}`)
    })
  }

  return (
    <section className="rounded-xl border-2 border-red-500/60 bg-gradient-to-br from-red-500/10 to-transparent p-5 sm:p-6 space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Start response</h2>
        <p className="text-sm text-muted-foreground">
          Tap the emergency type. You can refine details after the timer starts.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {NATURE_CHOICES.map((c) => {
          const active = nature === c.nature
          return (
            <button
              key={c.nature}
              type="button"
              onClick={() => setNature(c.nature)}
              className={`text-left rounded-lg border p-3 transition-colors ${
                active
                  ? "border-red-500 bg-red-500/15 ring-2 ring-red-500/30"
                  : "border-border hover:border-red-500/40 hover:bg-muted/40"
              }`}
            >
              <div className="font-semibold text-sm">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.blurb}</div>
            </button>
          )
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Room / unit (optional)</span>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="e.g. 412"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Location description (optional)</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Pool deck, Lobby bar"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isPending}
        className="w-full rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg py-4 shadow-lg shadow-red-500/20 transition-colors"
      >
        {isPending ? "Starting…" : "Start response timer"}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        This starts the clock, not the call. Always call your local emergency
        number (e.g. 191, 1669, 911) first.
      </p>
    </section>
  )
}
