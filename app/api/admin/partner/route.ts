import { NextRequest, NextResponse } from "next/server"
import { getAdminUser, createAdminClient } from "@/lib/admin"

/**
 * PATCH /api/admin/partner — Admin quick actions
 * Body: { partnerId, action, value? }
 * Actions: extend_trial, set_status
 */
export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { partnerId, action, value } = body

  if (!partnerId || !action) {
    return NextResponse.json({ error: "Missing partnerId or action" }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (action === "extend_trial") {
    // Extend trial by N days (default 30)
    const days = typeof value === "number" ? value : 30
    const newEnd = new Date()
    newEnd.setDate(newEnd.getDate() + days)

    const { error } = await supabase
      .from("partners")
      .update({
        trial_ends_at: newEnd.toISOString(),
        subscription_status: "trialing",
      })
      .eq("id", partnerId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, trial_ends_at: newEnd.toISOString() })
  }

  if (action === "set_status") {
    const allowed = ["trialing", "active", "past_due", "cancelled", "expired"]
    if (!allowed.includes(value)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${allowed.join(", ")}` }, { status: 400 })
    }

    const { error } = await supabase
      .from("partners")
      .update({ subscription_status: value })
      .eq("id", partnerId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, subscription_status: value })
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
}
