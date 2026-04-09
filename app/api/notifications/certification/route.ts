import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email"

/**
 * Internal notification endpoint called after certification events.
 *
 * POST /api/notifications/certification
 * Body: { type, partnerId, certificationTier?, memberName? }
 *
 * Sends emails via Resend (or logs in dev mode).
 */

interface NotificationPayload {
  type: "certification_approved" | "team_member_joined" | "training_expiring"
  partnerId: string
  certificationTier?: string
  memberName?: string
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // Verify the caller is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload: NotificationPayload = await req.json()

    // Verify the caller belongs to this partner
    const { data: callerMembership } = await supabase
      .from("partner_memberships")
      .select("partner_id, role")
      .eq("user_id", user.id)
      .eq("partner_id", payload.partnerId)
      .is("removed_at", null)
      .single()

    if (!callerMembership) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    // Load partner info
    const { data: partner } = await supabase
      .from("partners")
      .select("name, email")
      .eq("id", payload.partnerId)
      .single()

    if (!partner) {
      return Response.json({ error: "Partner not found" }, { status: 404 })
    }

    // Load owner(s) to notify
    const { data: owners } = await supabase
      .from("partner_memberships")
      .select("user_id")
      .eq("partner_id", payload.partnerId)
      .eq("role", "owner")
      .is("removed_at", null)

    if (!owners?.length) {
      return Response.json({ error: "No owners found" }, { status: 404 })
    }

    // Get owner emails from auth
    const ownerEmails: string[] = []
    for (const owner of owners) {
      const { data: { user } } = await supabase.auth.admin.getUserById(owner.user_id)
      if (user?.email) ownerEmails.push(user.email)
    }

    // Also include partner email if it's different
    const allRecipients = partner.email
      ? [...new Set([...ownerEmails, partner.email])]
      : ownerEmails

    // Send emails based on type
    let emailType: "certification_approved" | "team_member_joined"
    let emailData: Record<string, string | number | undefined>

    switch (payload.type) {
      case "certification_approved": {
        const tierName = payload.certificationTier === "sos_safe_elite"
          ? "SOS Safe Elite"
          : payload.certificationTier === "sos_safe_premium"
            ? "SOS Safe Premium"
            : "SOS Safe Basic"
        emailType = "certification_approved"
        emailData = { partnerName: partner.name, tierName }
        break
      }

      case "team_member_joined": {
        emailType = "team_member_joined"
        emailData = { partnerName: partner.name, memberName: payload.memberName }
        break
      }

      case "training_expiring": {
        // Use trial_expiring template for training reminders too
        for (const email of allRecipients) {
          await sendEmail({
            to: email,
            type: "trial_expiring",
            data: { partnerName: partner.name, daysLeft: 30 },
          })
        }
        return Response.json({ success: true, recipients: allRecipients.length })
      }
    }

    for (const email of allRecipients) {
      await sendEmail({ to: email, type: emailType, data: emailData })
    }

    return Response.json({
      success: true,
      type: payload.type,
      recipients: allRecipients.length,
    })
  } catch (error) {
    console.error("[Notification Error]", error)
    return Response.json(
      { error: "Failed to process notification" },
      { status: 500 },
    )
  }
}
