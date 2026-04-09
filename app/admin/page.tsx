import { createAdminClient } from "@/lib/admin"
import { PRICING_PLANS } from "@/lib/pricing-data"
import Link from "next/link"

export default async function AdminOverviewPage() {
  const supabase = createAdminClient()

  // Run all queries in parallel
  const [
    { data: partners },
    { data: memberships },
    { data: certifications },
    { data: recentPartners },
    { data: expiringTrials },
  ] = await Promise.all([
    supabase.from("partners").select("id, name, type, property_type, subscription_status, trial_ends_at, created_at"),
    supabase.from("partner_memberships").select("id, partner_id, role").is("removed_at", null),
    supabase.from("certifications").select("id, partner_id, tier, status"),
    supabase
      .from("partners")
      .select("id, name, property_type, subscription_status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("partners")
      .select("id, name, trial_ends_at, subscription_status")
      .eq("subscription_status", "trialing")
      .not("trial_ends_at", "is", null)
      .order("trial_ends_at", { ascending: true })
      .limit(10),
  ])

  const allPartners = partners || []
  const allMemberships = memberships || []
  const allCertifications = certifications || []

  // --- KPI calculations ---
  const totalPartners = allPartners.length
  const byStatus = {
    trialing: allPartners.filter((p) => p.subscription_status === "trialing").length,
    active: allPartners.filter((p) => p.subscription_status === "active").length,
    expired: allPartners.filter((p) => p.subscription_status === "expired").length,
    past_due: allPartners.filter((p) => p.subscription_status === "past_due").length,
    cancelled: allPartners.filter((p) => p.subscription_status === "cancelled").length,
  }

  const byType = {
    hostel: allPartners.filter((p) => p.property_type === "hostel").length,
    guesthouse: allPartners.filter((p) => p.property_type === "guesthouse").length,
    hotel: allPartners.filter((p) => p.property_type === "hotel").length,
    tour_operator: allPartners.filter((p) => p.property_type === "tour_operator").length,
    unset: allPartners.filter((p) => !p.property_type).length,
  }

  const totalMembers = allMemberships.length
  const certifiedPartners = new Set(
    allCertifications.filter((c) => c.status === "approved").map((c) => c.partner_id)
  ).size

  // MRR estimate (based on property types of active subscribers)
  const activePartners = allPartners.filter((p) => p.subscription_status === "active")
  const estimatedMRR = activePartners.reduce((sum, p) => {
    const plan = PRICING_PLANS.find((pl) => pl.id === p.property_type)
    return sum + (plan?.monthlyPrice || 0)
  }, 0)

  // Signups this month
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const signupsThisMonth = allPartners.filter(
    (p) => new Date(p.created_at) >= monthStart
  ).length

  // Trials expiring within 7 days
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const expiringWithin7Days = (expiringTrials || []).filter((p) => {
    const end = new Date(p.trial_ends_at)
    return end <= sevenDaysFromNow && end >= now
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Business Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          SOS Safe platform metrics — {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPICard label="Total Partners" value={totalPartners} />
        <KPICard label="Subscribed" value={byStatus.active} accent="green" />
        <KPICard
          label="Est. MRR"
          value={`$${estimatedMRR}`}
          accent="green"
          sub={estimatedMRR > 0 ? `$${estimatedMRR * 12}/yr` : undefined}
        />
        <KPICard label="Signups This Month" value={signupsThisMonth} />
      </div>

      {/* Status + Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* By Subscription Status */}
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <h2 className="font-semibold mb-4">Subscription Status</h2>
          <div className="space-y-3">
            <StatusRow label="Trialing" count={byStatus.trialing} total={totalPartners} color="bg-blue-500" />
            <StatusRow label="Active" count={byStatus.active} total={totalPartners} color="bg-green-500" />
            <StatusRow label="Past Due" count={byStatus.past_due} total={totalPartners} color="bg-yellow-500" />
            <StatusRow label="Expired" count={byStatus.expired} total={totalPartners} color="bg-red-500" />
            <StatusRow label="Cancelled" count={byStatus.cancelled} total={totalPartners} color="bg-gray-500" />
          </div>
        </div>

        {/* By Property Type */}
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <h2 className="font-semibold mb-4">By Business Type</h2>
          <div className="space-y-3">
            <StatusRow label="Hostel" count={byType.hostel} total={totalPartners} color="bg-cyan-500" />
            <StatusRow label="Guesthouse" count={byType.guesthouse} total={totalPartners} color="bg-purple-500" />
            <StatusRow label="Hotel & Resort" count={byType.hotel} total={totalPartners} color="bg-orange-500" />
            <StatusRow label="Tour Operator" count={byType.tour_operator} total={totalPartners} color="bg-teal-500" />
            {byType.unset > 0 && (
              <StatusRow label="Unset (legacy)" count={byType.unset} total={totalPartners} color="bg-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Team + Certification stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPICard label="Total Team Members" value={totalMembers} />
        <KPICard label="Certified Partners" value={certifiedPartners} />
        <KPICard
          label="Certification Rate"
          value={totalPartners > 0 ? `${Math.round((certifiedPartners / totalPartners) * 100)}%` : "—"}
        />
        <KPICard
          label="Avg Team Size"
          value={totalPartners > 0 ? (totalMembers / totalPartners).toFixed(1) : "—"}
        />
      </div>

      {/* Two columns: Recent signups + Expiring trials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Signups */}
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Signups</h2>
            <Link href="/admin/partners" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {(recentPartners || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No partners yet.</p>
          ) : (
            <div className="space-y-2">
              {(recentPartners || []).map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/partners/${p.id}`}
                  className="flex items-center justify-between py-2 px-3 -mx-3 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{p.property_type || "—"}</p>
                  </div>
                  <div className="text-right">
                    <SubscriptionBadge status={p.subscription_status || "trialing"} />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Trials */}
        <div className="glass-card p-5 rounded-lg border border-border/50">
          <h2 className="font-semibold mb-4">Trials Expiring Soon</h2>
          {expiringWithin7Days.length === 0 ? (
            <p className="text-sm text-muted-foreground">No trials expiring in the next 7 days.</p>
          ) : (
            <div className="space-y-2">
              {expiringWithin7Days.map((p) => {
                const end = new Date(p.trial_ends_at)
                const days = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                return (
                  <Link
                    key={p.id}
                    href={`/admin/partners/${p.id}`}
                    className="flex items-center justify-between py-2 px-3 -mx-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-sm font-medium">{p.name}</p>
                    <span className={`text-xs font-medium ${days <= 2 ? "text-red-500" : "text-yellow-500"}`}>
                      {days === 0 ? "Expires today" : `${days}d left`}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---- Helper Components ---- */

function KPICard({
  label,
  value,
  accent,
  sub,
}: {
  label: string
  value: string | number
  accent?: "green" | "red"
  sub?: string
}) {
  return (
    <div className="glass-card p-4 rounded-lg border border-border/50">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${
        accent === "green" ? "text-green-500" : accent === "red" ? "text-red-500" : ""
      }`}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

function StatusRow({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{count}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SubscriptionBadge({ status }: { status: string }) {
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
