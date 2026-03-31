import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const organizationName = user?.user_metadata?.organization_name || "Your Organization"
  const partnerType = user?.user_metadata?.partner_type || "accommodation"

  // Check if partner profile exists
  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("*, partners(*)")
    .eq("user_id", user?.id)
    .single()

  const hasProfile = !!membership?.partners

  // Get certification status if profile exists
  let certificationStatus = null
  let activeCaseCount = 0
  if (hasProfile) {
    const { data: certification } = await supabase
      .from("certifications")
      .select("*")
      .eq("partner_id", membership.partner_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    certificationStatus = certification

    // Count active cases for this partner
    const { data: caseParties } = await supabase
      .from("case_parties")
      .select("case_id")
      .eq("party_id", membership.partner_id)
      .eq("party_type", "other")

    if (caseParties && caseParties.length > 0) {
      const caseIds = caseParties.map(cp => cp.case_id)
      const { count } = await supabase
        .from("cases")
        .select("*", { count: "exact", head: true })
        .in("id", caseIds)
        .in("status", ["open", "in_progress"])

      activeCaseCount = count || 0
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          {organizationName} - {partnerType === "accommodation" ? "Accommodation Provider" : "Tour Operator"}
        </p>
      </div>

      {/* Setup Progress */}
      {!hasProfile && (
        <div className="glass-card p-6 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Complete Your Setup</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Set up your partner profile to start the SOS Safe certification process.
              </p>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 mt-4 btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium text-white"
              >
                Complete Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Certification Status</p>
              <p className="text-2xl font-bold mt-1">
                {certificationStatus?.status === "approved" ? "Certified" : 
                 certificationStatus?.status === "pending" ? "Pending" :
                 certificationStatus?.status === "in_review" ? "In Review" :
                 "Not Started"}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              certificationStatus?.status === "approved" 
                ? "bg-green-100 dark:bg-green-900/30" 
                : "bg-muted"
            }`}>
              <svg className={`w-6 h-6 ${
                certificationStatus?.status === "approved" 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-muted-foreground"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Cases</p>
              <p className="text-2xl font-bold mt-1">{activeCaseCount}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Profile Complete</p>
              <p className="text-2xl font-bold mt-1">{hasProfile ? "100%" : "0%"}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/certification"
            className="glass-card p-6 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Start Certification</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete training modules to become SOS Safe Certified
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/cases"
            className="glass-card p-6 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Report Emergency</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a new case for an emergency situation
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* What is SOS Safe */}
      <div className="glass-card p-6 rounded-lg border border-border/50">
        <h2 className="text-xl font-semibold mb-4">What is SOS Safe Certification?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-semibold">
              1
            </div>
            <div>
              <h3 className="font-medium">Training Modules</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Complete assessments on facility safety, emergency preparedness, and communication protocols.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-semibold">
              2
            </div>
            <div>
              <h3 className="font-medium">Verification</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our team reviews your submissions and verifies your emergency readiness.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-semibold">
              3
            </div>
            <div>
              <h3 className="font-medium">Certification</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Receive your SOS Safe badge and join the trusted network of safety-conscious partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
