import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email"

/**
 * POST /api/email/welcome
 *
 * Sends a welcome email to a newly onboarded partner.
 * Called fire-and-forget from the onboarding form.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { partnerId } = await req.json()

    // Verify caller owns this partner
    const { data: membership } = await supabase
      .from("partner_memberships")
      .select("partner_id, role")
      .eq("user_id", user.id)
      .eq("partner_id", partnerId)
      .is("removed_at", null)
      .single()

    if (!membership) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: partner } = await supabase
      .from("partners")
      .select("name, email")
      .eq("id", partnerId)
      .single()

    if (!partner?.email) {
      return Response.json({ error: "No partner email" }, { status: 404 })
    }

    await sendEmail({
      to: partner.email,
      type: "welcome",
      data: { partnerName: partner.name },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("[Welcome Email Error]", error)
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}
