import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

/**
 * POST /api/stripe/portal
 *
 * Creates a Stripe Customer Portal session for the authenticated partner.
 * The portal lets customers manage their subscription, update payment
 * method, view invoices, and cancel — all hosted by Stripe.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: membership } = await supabase
      .from("partner_memberships")
      .select("partner_id, role, partners(stripe_customer_id)")
      .eq("user_id", user.id)
      .is("removed_at", null)
      .single()

    if (!membership?.partners) {
      return Response.json({ error: "No partner found" }, { status: 404 })
    }

    const partner = membership.partners as unknown as { stripe_customer_id: string | null }

    if (!partner.stripe_customer_id) {
      return Response.json({ error: "No billing account found. Subscribe first." }, { status: 400 })
    }

    if (membership.role !== "owner" && membership.role !== "manager") {
      return Response.json({ error: "Only owners and managers can manage billing." }, { status: 403 })
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await stripe.billingPortal.sessions.create({
      customer: partner.stripe_customer_id,
      return_url: `${origin}/dashboard/settings/billing`,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error("[Stripe Portal Error]", error)
    const message = error instanceof Error ? error.message : "Failed to create portal session"
    return Response.json({ error: message }, { status: 500 })
  }
}
