import Stripe from "stripe"
import { PRICING_PLANS, type PropertyType } from "./pricing-data"

/**
 * Stripe client — initialized once per cold start.
 *
 * Requires STRIPE_SECRET_KEY in environment.
 * All Stripe operations go through this client.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

/**
 * Map property type + interval to a Stripe Price ID.
 *
 * You create these in the Stripe Dashboard (or via API):
 *   4 products (hostel, guesthouse, hotel, tour_operator)
 *   8 prices  (monthly + annual for each)
 *
 * Store the IDs in env vars so they're easy to swap between
 * test mode and live mode.
 */
const STRIPE_PRICE_MAP: Record<string, string | undefined> = {
  hostel_monthly: process.env.STRIPE_PRICE_HOSTEL_MONTHLY,
  hostel_annual: process.env.STRIPE_PRICE_HOSTEL_ANNUAL,
  guesthouse_monthly: process.env.STRIPE_PRICE_GUESTHOUSE_MONTHLY,
  guesthouse_annual: process.env.STRIPE_PRICE_GUESTHOUSE_ANNUAL,
  hotel_monthly: process.env.STRIPE_PRICE_HOTEL_MONTHLY,
  hotel_annual: process.env.STRIPE_PRICE_HOTEL_ANNUAL,
  tour_operator_monthly: process.env.STRIPE_PRICE_TOUR_OPERATOR_MONTHLY,
  tour_operator_annual: process.env.STRIPE_PRICE_TOUR_OPERATOR_ANNUAL,
}

export function getStripePriceId(
  propertyType: PropertyType,
  interval: "monthly" | "annual",
): string {
  const key = `${propertyType}_${interval}`
  const priceId = STRIPE_PRICE_MAP[key]
  if (!priceId) {
    throw new Error(
      `No Stripe Price ID configured for ${key}. Set STRIPE_PRICE_${propertyType.toUpperCase()}_${interval.toUpperCase()} in your environment.`,
    )
  }
  return priceId
}

/** Get the display price for a property type + interval */
export function getDisplayPrice(
  propertyType: PropertyType,
  interval: "monthly" | "annual",
): { amount: number; label: string } {
  const plan = PRICING_PLANS.find((p) => p.id === propertyType)
  if (!plan) throw new Error(`Unknown property type: ${propertyType}`)

  if (interval === "annual") {
    return { amount: plan.annualPrice, label: `$${plan.annualPrice}/year` }
  }
  return { amount: plan.monthlyPrice, label: `$${plan.monthlyPrice}/month` }
}
