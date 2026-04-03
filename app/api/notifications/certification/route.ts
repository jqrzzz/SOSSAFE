import { createClient } from "@/lib/supabase/server"

/**
 * Internal notification endpoint called after certification events.
 *
 * POST /api/notifications/certification
 * Body: { type: "approved" | "team_joined" | "training_expired", certificationId?, userId?, partnerId }
 *
 * This route is called from client-side code after cert approval, team joins, etc.
 * It loads context from Supabase and sends the appropriate email.
 *
 * Email provider: Currently logs notifications. To activate email delivery,
 * add RESEND_API_KEY to env and uncomment the Resend integration below.
 */

interface NotificationPayload {
  type: "certification_approved" | "team_member_joined" | "training_expiring"
  partnerId: string
  certificationTier?: string
  userId?: string
  memberName?: string
  moduleId?: string
}

export async function POST(req: Request) {
  try {
    const payload: NotificationPayload = await req.json()
    const supabase = await createClient()

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

    // Build notification based on type
    let subject = ""
    let body = ""

    switch (payload.type) {
      case "certification_approved": {
        const tierName = payload.certificationTier === "sos_safe_elite"
          ? "SOS Safe Elite"
          : payload.certificationTier === "sos_safe_premium"
          ? "SOS Safe Premium"
          : "SOS Safe Basic"
        subject = `${partner.name} is now ${tierName} Certified`
        body = [
          `Congratulations! ${partner.name} has successfully completed all modules and earned ${tierName} certification.`,
          "",
          `Your certificate is now active and visible in your dashboard.`,
          "",
          payload.certificationTier !== "sos_safe_elite"
            ? "Ready for the next level? Log in to start the next certification tier."
            : "You've reached the highest tier — Elite. Thank you for your commitment to guest safety.",
          "",
          "— The Tourist SOS Team",
        ].join("\n")
        break
      }

      case "team_member_joined": {
        subject = `New team member joined ${partner.name}`
        body = [
          `${payload.memberName || "A new member"} has joined your organization on SOS Safe.`,
          "",
          "They can now begin their individual training modules. You can track their progress on the Team page.",
          "",
          "— The Tourist SOS Team",
        ].join("\n")
        break
      }

      case "training_expiring": {
        subject = `Training expiring soon — ${partner.name}`
        body = [
          `A team member's training certification is expiring within 30 days.`,
          "",
          "Please log in to the Team page to review training status and encourage retaking expired modules.",
          "",
          "— The Tourist SOS Team",
        ].join("\n")
        break
      }
    }

    // ── Email Delivery ──────────────────────────────────────────────
    //
    // Option 1: Resend (recommended for Vercel)
    // Uncomment when RESEND_API_KEY is set:
    //
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // for (const email of ownerEmails) {
    //   await resend.emails.send({
    //     from: "SOS Safe <notifications@tourist-sos.com>",
    //     to: email,
    //     subject,
    //     text: body,
    //   })
    // }
    //
    // Option 2: Supabase Edge Functions (for shared infra)
    // Option 3: Any SMTP service via nodemailer
    //
    // For now, log the notification for development:
    console.log("[Notification]", {
      type: payload.type,
      to: ownerEmails,
      subject,
      partner: partner.name,
    })

    return Response.json({
      success: true,
      type: payload.type,
      recipients: ownerEmails.length,
      subject,
    })
  } catch (error) {
    console.error("[Notification Error]", error)
    return Response.json(
      { error: "Failed to process notification" },
      { status: 500 },
    )
  }
}
