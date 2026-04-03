import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PoliciesClient } from "./PoliciesClient"
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_CATEGORIES,
} from "@/lib/facility-assessment-data"

export default async function PoliciesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, role, partners(name, type)")
    .eq("user_id", user.id)
    .is("removed_at", null)
    .single()

  if (!membership?.partner_id) redirect("/onboarding")

  const partner = membership.partners as unknown as {
    name: string
    type: string
  } | null

  const canManage = membership.role === "owner" || membership.role === "manager"

  // Load existing assessment answers
  const { data: answers } = await supabase
    .from("facility_assessments")
    .select("*")
    .eq("partner_id", membership.partner_id)
    .order("created_at", { ascending: true })

  // Load latest policy document
  const { data: latestPolicy } = await supabase
    .from("facility_policies")
    .select("*")
    .eq("partner_id", membership.partner_id)
    .order("version", { ascending: false })
    .limit(1)
    .single()

  return (
    <PoliciesClient
      partnerId={membership.partner_id}
      partnerName={partner?.name ?? "Your Organization"}
      partnerType={(partner?.type ?? "accommodation") as "accommodation" | "tour_operator"}
      userId={user.id}
      canManage={canManage}
      existingAnswers={answers ?? []}
      latestPolicy={latestPolicy}
      questions={ASSESSMENT_QUESTIONS}
      categories={ASSESSMENT_CATEGORIES}
    />
  )
}
