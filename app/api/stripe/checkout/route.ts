import { createClient } from "@/lib/supabase/server"
import { stripe, getStripePriceId } from "@/lib/stripe"
import type { PropertyType } from "@/lib/pricing-data"

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for the authenticated partner.
 * Body: { interval: "monthly" | "annual" }
 *
 * Flow:
 * 1. Verify auth + partner membership
 * 2. Create or reuse Stripe customer
 * 3. Create Checkout Session with correct price
 * 4. Return session URL for redirect
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { interval } = await req.json()

    if (interval !== "monthly" && interval !== "annual") {
      return Response.json({ error: "Invalid interval. Must be 'monthly' or 'annual'." }, { status: 400 })
    }

    // Get partner via membership
    const { data: membership } = await supabase
      .from("partner_memberships")
      .select("partner_id, role, partners(id, name, email, property_type, stripe_customer_id, subscription_status)")
      .eq("user_id", user.id)
      .is("removed_at", null)
      .single()

    if (!membership?.partners) {
      return Response.json({ error: "No partner found" }, { status: 404 })
    }

    const partner = membership.partners as unknown as {
      id: string
      name: string
      email: string
      property_type: string | null
      stripe_customer_id: string | null
      subscription_status: string | null
    }

    if (!partner.property_type) {
      return Response.json({ error: "Partner has no property type set. Complete onboarding first." }, { status: 400 })
    }

    // Only owners and managers can subscribe
    if (membership.role !== "owner" && membership.role !== "manager") {
      return Response.json({ error: "Only owners and managers can manage billing." }, { status: 403 })
    }

    // Don't allow checkout if already active
    if (partner.subscription_status === "active") {
      return Response.json({ error: "Already subscribed. Use the customer portal to manage your subscription." }, { status: 400 })
    }

    const priceId = getStripePriceId(partner.property_type as PropertyType, interval)

    // Create or reuse Stripe customer
    let customerId = partner.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: partner.email || user.email || undefined,
        name: partner.name,
        metadata: {
          partner_id: partner.id,
          property_type: partner.property_type,
        },
      })
      customerId = customer.id

      // Save customer ID immediately
      await supabase
        .from("partners")
        .update({ stripe_customer_id: customerId })
        .eq("id", partner.id)
    }

    // Determine base URL for redirects
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/settings/billing?success=true`,
      cancel_url: `${origin}/dashboard/settings/billing`,
      subscription_data: {
        metadata: {
          partner_id: partner.id,
          property_type: partner.property_type,
          interval,
        },
      },
      metadata: {
        partner_id: partner.id,
      },
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: "I agree to the [Terms of Service](https://tourist-sos.com/terms) and [Privacy Policy](https://tourist-sos.com/privacy).",
        },
      },
      allow_promotion_codes: true,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error("[Stripe Checkout Error]", error)
    const message = error instanceof Error ? error.message : "Failed to create checkout session"
    return Response.json({ error: message }, { status: 500 })
  }
}
