import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import { SosaChatWidget } from "@/components/dashboard/SosaChatWidget"
import { TrialBanner } from "@/components/dashboard/TrialBanner"
import { SubscriptionGate } from "@/components/dashboard/SubscriptionGate"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch subscription status for trial banner
  let subscriptionStatus = "trialing"
  let trialEndsAt: string | null = null

  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, partners(subscription_status, trial_ends_at)")
    .eq("user_id", user.id)
    .is("removed_at", null)
    .single()

  if (membership?.partners) {
    const partner = membership.partners as unknown as { subscription_status: string | null; trial_ends_at: string | null }
    subscriptionStatus = partner.subscription_status || "trialing"
    trialEndsAt = partner.trial_ends_at
  }

  return (
    <div className="min-h-screen bg-background dark">
      <TrialBanner subscriptionStatus={subscriptionStatus} trialEndsAt={trialEndsAt} />
      <div className="print:hidden">
        <DashboardNav user={user} />
      </div>
      <main className="container mx-auto px-4 py-6 max-w-7xl print:px-0 print:py-0">
        <SubscriptionGate subscriptionStatus={subscriptionStatus} trialEndsAt={trialEndsAt}>
          {children}
        </SubscriptionGate>
      </main>
      <SosaChatWidget />
    </div>
  )
}
