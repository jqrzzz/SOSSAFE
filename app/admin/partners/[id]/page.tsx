import { createAdminClient } from "@/lib/admin"
import { getPlan, formatPrice, TRIAL_DAYS } from "@/lib/pricing-data"
import type { PropertyType } from "@/lib/pricing-data"
import { PartnerActions } from "@/components/admin/PartnerActions"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function AdminPartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const [
    { data: partner },
    { data: memberships },
    { data: certifications },
    { data: submissions },
  ] = await Promise.all([
    supabase.from("partners").select("*").eq("id", id).single(),
    supabase
      .from("partner_memberships")
      .select("id, user_id, role, accepted_at, removed_at, is_primary_contact")
      .eq("partner_id", id)
      .is("removed_at", null)
      .order("accepted_at", { ascending: true }),
    supabase
      .from("certifications")
      .select("id, tier, status, issued_at, expires_at")
      .eq("partner_id", id)
      .order("issued_at", { ascending: false }),
    supabase
      .from("certification_submissions")
      .select("id, module_id, score, passed, submitted_at")
      .eq("partner_id", id)
      .order("submitted_at", { ascending: false }),
  ])

  if (!partner) notFound()

  const plan = partner.property_type ? getPlan(partner.property_type as PropertyType) : null
  const trialEnd = partner.trial_ends_at ? new Date(partner.trial_ends_at) : null
  const now = new Date()
  const daysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null

  const activeMembers = memberships || []
  const allCerts = certifications || []
  const allSubmissions = submissions || []

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/partners" className="hover:text-foreground transition-colors">Partners</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{partner.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{partner.name}</h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">
            {(partner.property_type || partner.type || "—").replace("_", " ")}
            {partner.city && partner.country ? ` — ${partner.city}, ${partner.country}` : ""}
          </p>
        </div>
        <SubscriptionBadge status={partner.subscription_status || "trialing"} />
      </div>

      {/* Quick Actions */}
      <PartnerActions
        partnerId={partner.id}
        subscriptionStatus={partner.subscription_status || "trialing"}
        trialEndsAt={partner.trial_ends_at}
      />

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile */}
        <div className="glass-card p-5 rounded-lg border border-border/50 space-y-3">
          <h2 className="font-semibold">Profile</h2>
          <InfoRow label="Email" value={partner.email || "—"} />
          <InfoRow label="Phone" value={partner.phone || "—"} />
          <InfoRow label="Website" value={partner.website || "—"} />
          <InfoRow label="Address" value={partner.address || "—"} />
          <InfoRow label="Region" value={partner.region || "—"} />
          <InfoRow
            label="Created"
            value={new Date(partner.created_at).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          />
        </div>

        {/* Subscription */}
        <div className="glass-card p-5 rounded-lg border border-border/50 space-y-3">
          <h2 className="font-semibold">Subscription</h2>
          <InfoRow label="Status" value={(partner.subscription_status || "trialing").replace("_", " ")} />
          {plan && (
            <>
              <InfoRow label="Plan" value={`${plan.name} — ${formatPrice(plan.monthlyPrice)}/mo`} />
              <InfoRow label="Annual Option" value={`${formatPrice(plan.annualPrice)}/yr`} />
            </>
          )}
          {trialEnd && (
            <InfoRow
              label="Trial Ends"
              value={`${trialEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}${daysLeft !== null ? ` (${daysLeft}d left)` : ""}`}
            />
          )}
          <InfoRow label="Stripe Customer" value={partner.stripe_customer_id || "Not connected"} />
          <InfoRow label="Stripe Subscription" value={partner.stripe_subscription_id || "Not connected"} />
        </div>
      </div>

      {/* Team Members */}
      <div className="glass-card p-5 rounded-lg border border-border/50">
        <h2 className="font-semibold mb-4">Team ({activeMembers.length} member{activeMembers.length !== 1 ? "s" : ""})</h2>
        {activeMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No team members.</p>
        ) : (
          <div className="space-y-2">
            {activeMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="text-sm">
                  <span className="font-medium">{m.user_id.slice(0, 8)}...</span>
                  {m.is_primary_contact && (
                    <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Primary</span>
                  )}
                </div>
                <span className="text-xs capitalize text-muted-foreground">{m.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certification History */}
      <div className="glass-card p-5 rounded-lg border border-border/50">
        <h2 className="font-semibold mb-4">Certifications</h2>
        {allCerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No certifications yet.</p>
        ) : (
          <div className="space-y-2">
            {allCerts.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <span className="text-sm font-medium capitalize">{c.tier}</span>
                  <span className={`ml-2 text-xs ${c.status === "approved" ? "text-green-500" : "text-yellow-500"}`}>
                    {c.status === "approved" ? "Certified" : c.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {c.issued_at && <p>Issued: {new Date(c.issued_at).toLocaleDateString()}</p>}
                  {c.expires_at && <p>Expires: {new Date(c.expires_at).toLocaleDateString()}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Module Submissions */}
      <div className="glass-card p-5 rounded-lg border border-border/50">
        <h2 className="font-semibold mb-4">Assessment Submissions ({allSubmissions.length})</h2>
        {allSubmissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="px-3 py-2 font-medium text-muted-foreground">Module</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Score</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Result</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {allSubmissions.map((s) => (
                  <tr key={s.id} className="border-b border-border/30">
                    <td className="px-3 py-2">{s.module_id}</td>
                    <td className="px-3 py-2 font-medium">{s.score}%</td>
                    <td className="px-3 py-2">
                      <span className={s.passed ? "text-green-500" : "text-red-500"}>
                        {s.passed ? "Pass" : "Fail"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {new Date(s.submitted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
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
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.trialing}`}>
      {status === "past_due" ? "Past Due" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
