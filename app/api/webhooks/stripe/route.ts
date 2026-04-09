import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/admin"
import { sendEmail } from "@/lib/email"
import type Stripe from "stripe"

/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events for the subscription lifecycle.
 * Uses service-role Supabase client (bypasses RLS) since there's
 * no user auth context — Stripe calls this directly.
 *
 * Events handled:
 *   checkout.session.completed  — first subscription created
 *   invoice.paid                — recurring payment succeeded
 *   invoice.payment_failed      — payment failed (card declined, etc.)
 *   customer.subscription.updated — plan change, cancellation scheduled
 *   customer.subscription.deleted — subscription fully cancelled/expired
 */
export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[Stripe Webhook] Signature verification failed:", message)
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session)
        break
      }

      case "invoice.paid": {
        await handleInvoicePaid(supabase, event.data.object as Stripe.Invoice)
        break
      }

      case "invoice.payment_failed": {
        await handleInvoiceFailed(supabase, event.data.object as Stripe.Invoice)
        break
      }

      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription)
        break
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription)
        break
      }

      default:
        break
    }

    return new Response("OK", { status: 200 })
  } catch (error) {
    console.error(`[Stripe Webhook] Error handling ${event.type}:`, error)
    return new Response("Webhook handler error (logged)", { status: 200 })
  }
}

// ── Helpers ───────────────────────────────────────────────────────

/** Get the current_period_end from a subscription's first item */
function getPeriodEnd(subscription: Stripe.Subscription): string | null {
  const item = subscription.items?.data?.[0]
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000).toISOString()
  }
  return null
}

/** Extract subscription ID from an invoice's parent field (Stripe v22+) */
function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent
  if (!parent) return null

  if (parent.type === "subscription_details" && parent.subscription_details) {
    const sub = parent.subscription_details.subscription
    return typeof sub === "string" ? sub : sub?.id ?? null
  }

  return null
}

// ── Handlers ──────────────────────────────────────────────────────

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session,
) {
  const partnerId = session.metadata?.partner_id
  if (!partnerId) {
    console.error("[Stripe Webhook] checkout.session.completed missing partner_id in metadata")
    return
  }

  const subscriptionId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription?.id

  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const interval = subscription.metadata?.interval || (
    subscription.items.data[0]?.price?.recurring?.interval === "year" ? "annual" : "monthly"
  )

  const periodEnd = getPeriodEnd(subscription)

  const updateData: Record<string, unknown> = {
    subscription_status: "active",
    stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripe_subscription_id: subscriptionId,
    plan_interval: interval,
  }
  if (periodEnd) updateData.current_period_end = periodEnd

  const { error } = await supabase
    .from("partners")
    .update(updateData)
    .eq("id", partnerId)

  if (error) {
    console.error("[Stripe Webhook] Failed to update partner:", error)
    return
  }

  // Send subscription confirmation email
  const { data: partner } = await supabase
    .from("partners")
    .select("name, email, property_type")
    .eq("id", partnerId)
    .single()

  if (partner?.email) {
    await sendEmail({
      to: partner.email,
      type: "subscription_confirmed",
      data: {
        partnerName: partner.name,
        planName: partner.property_type || "SOS Safe",
        interval,
      },
    })
  }

  console.log(`[Stripe Webhook] Partner ${partnerId} activated (${interval})`)
}

async function handleInvoicePaid(
  supabase: ReturnType<typeof createAdminClient>,
  invoice: Stripe.Invoice,
) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice)
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const periodEnd = getPeriodEnd(subscription)

  const partnerId = subscription.metadata?.partner_id

  const updateData: Record<string, unknown> = { subscription_status: "active" }
  if (periodEnd) updateData.current_period_end = periodEnd

  if (partnerId) {
    await supabase.from("partners").update(updateData).eq("id", partnerId)
  } else {
    const { data } = await supabase
      .from("partners")
      .select("id")
      .eq("stripe_subscription_id", subscriptionId)
      .single()

    if (data) {
      await supabase.from("partners").update(updateData).eq("id", data.id)
    }
  }
}

async function handleInvoiceFailed(
  supabase: ReturnType<typeof createAdminClient>,
  invoice: Stripe.Invoice,
) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice)
  if (!subscriptionId) return

  const { data: partner } = await supabase
    .from("partners")
    .select("id, name, email")
    .eq("stripe_subscription_id", subscriptionId)
    .single()

  if (!partner) return

  await supabase
    .from("partners")
    .update({ subscription_status: "past_due" })
    .eq("id", partner.id)

  if (partner.email) {
    await sendEmail({
      to: partner.email,
      type: "payment_failed",
      data: { partnerName: partner.name },
    })
  }

  console.log(`[Stripe Webhook] Partner ${partner.id} payment failed — set to past_due`)
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription,
) {
  const partnerId = subscription.metadata?.partner_id

  let targetId = partnerId
  if (!targetId) {
    const { data } = await supabase
      .from("partners")
      .select("id")
      .eq("stripe_subscription_id", subscription.id)
      .single()
    targetId = data?.id
  }

  if (!targetId) return

  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    canceled: "cancelled",
    unpaid: "past_due",
    trialing: "trialing",
  }

  const newStatus = statusMap[subscription.status] || subscription.status
  const periodEnd = getPeriodEnd(subscription)

  const updateData: Record<string, unknown> = { subscription_status: newStatus }
  if (periodEnd) updateData.current_period_end = periodEnd

  await supabase.from("partners").update(updateData).eq("id", targetId)
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription,
) {
  const partnerId = subscription.metadata?.partner_id

  let targetId = partnerId
  if (!targetId) {
    const { data } = await supabase
      .from("partners")
      .select("id")
      .eq("stripe_subscription_id", subscription.id)
      .single()
    targetId = data?.id
  }

  if (!targetId) return

  await supabase
    .from("partners")
    .update({
      subscription_status: "cancelled",
      stripe_subscription_id: null,
    })
    .eq("id", targetId)

  console.log(`[Stripe Webhook] Partner ${targetId} subscription cancelled`)
}
