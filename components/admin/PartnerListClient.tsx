"use client"

import { useState } from "react"
import Link from "next/link"

interface Partner {
  id: string
  name: string
  type: string
  property_type: string | null
  country: string | null
  city: string | null
  subscription_status: string | null
  trial_ends_at: string | null
  created_at: string
  email: string | null
  teamSize: number
  certification: { tier: string; status: string } | null
}

export function PartnerListClient({ partners }: { partners: Partner[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filtered = partners.filter((p) => {
    if (search) {
      const q = search.toLowerCase()
      const matches =
        p.name.toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q) ||
        (p.country || "").toLowerCase().includes(q) ||
        (p.city || "").toLowerCase().includes(q)
      if (!matches) return false
    }
    if (statusFilter !== "all" && (p.subscription_status || "trialing") !== statusFilter) return false
    if (typeFilter !== "all" && p.property_type !== typeFilter) return false
    return true
  })

  const now = Date.now()

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, country, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="premium-input flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="premium-input w-full sm:w-40"
        >
          <option value="all">All Status</option>
          <option value="trialing">Trialing</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="premium-input w-full sm:w-40"
        >
          <option value="all">All Types</option>
          <option value="hostel">Hostel</option>
          <option value="guesthouse">Guesthouse</option>
          <option value="hotel">Hotel</option>
          <option value="tour_operator">Tour Operator</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} partner{filtered.length !== 1 ? "s" : ""} shown</p>

      {/* Table */}
      <div className="glass-card rounded-lg border border-border/50 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">Partner</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Trial</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Team</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Cert</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No partners match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const trialEnd = p.trial_ends_at ? new Date(p.trial_ends_at) : null
                const daysLeft = trialEnd
                  ? Math.max(0, Math.ceil((trialEnd.getTime() - now) / (1000 * 60 * 60 * 24)))
                  : null

                return (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/partners/${p.id}`} className="hover:text-primary transition-colors">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.email || "—"}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs">{(p.property_type || p.type || "—").replace("_", " ")}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {[p.city, p.country].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.subscription_status || "trialing"} />
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {p.subscription_status === "active" ? (
                        <span className="text-green-500">Subscribed</span>
                      ) : daysLeft !== null ? (
                        <span className={daysLeft <= 5 ? "text-red-500 font-medium" : "text-muted-foreground"}>
                          {daysLeft === 0 ? "Expired" : `${daysLeft}d left`}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.teamSize}</td>
                    <td className="px-4 py-3">
                      {p.certification ? (
                        <span className={`text-xs font-medium capitalize ${
                          p.certification.status === "approved" ? "text-green-500" : "text-yellow-500"
                        }`}>
                          {p.certification.tier}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CSV Export */}
      <button
        onClick={() => {
          const headers = ["Name", "Email", "Type", "Country", "City", "Status", "Trial Ends", "Team Size", "Certification", "Joined"]
          const rows = filtered.map((p) => [
            p.name,
            p.email || "",
            p.property_type || p.type || "",
            p.country || "",
            p.city || "",
            p.subscription_status || "trialing",
            p.trial_ends_at || "",
            p.teamSize,
            p.certification ? `${p.certification.tier} (${p.certification.status})` : "None",
            p.created_at,
          ])
          const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")
          const blob = new Blob([csv], { type: "text/csv" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `sossafe-partners-${new Date().toISOString().split("T")[0]}.csv`
          a.click()
          URL.revokeObjectURL(url)
        }}
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    trialing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    past_due: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400",
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${styles[status] || styles.trialing}`}>
      {status === "past_due" ? "Past Due" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
