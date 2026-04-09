/**
 * Pricing Plans — Single Source of Truth
 *
 * All plan definitions, pricing, and property type mappings live here
 * so they can be updated without touching UI components.
 */

export type PropertyType = "hostel" | "guesthouse" | "hotel" | "tour_operator"

export interface PricingPlan {
  id: PropertyType
  name: string
  description: string
  monthlyPrice: number // USD
  annualPrice: number // USD (total for the year)
  annualMonthly: number // USD equivalent per month when paying annually
  examples: string[]
  icon: "hostel" | "guesthouse" | "hotel" | "tour"
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "hostel",
    name: "Hostel",
    description: "For hostels, backpacker lodges, and dormitory-style accommodations.",
    monthlyPrice: 12,
    annualPrice: 119,
    annualMonthly: 9.92,
    examples: ["Hostels", "Backpacker lodges", "Dormitories", "Capsule hotels"],
    icon: "hostel",
  },
  {
    id: "guesthouse",
    name: "Guesthouse",
    description: "For guesthouses, B&Bs, vacation rentals, and boutique stays.",
    monthlyPrice: 22,
    annualPrice: 219,
    annualMonthly: 18.25,
    examples: ["Guesthouses", "B&Bs", "Vacation rentals", "Homestays", "Boutique inns"],
    icon: "guesthouse",
  },
  {
    id: "hotel",
    name: "Hotel & Resort",
    description: "For hotels, resorts, and serviced apartment properties.",
    monthlyPrice: 52,
    annualPrice: 519,
    annualMonthly: 43.25,
    examples: ["Hotels", "Resorts", "Serviced apartments", "Hotel chains"],
    icon: "hotel",
  },
  {
    id: "tour_operator",
    name: "Tour Operator",
    description: "For tour companies, activity providers, and travel agencies.",
    monthlyPrice: 22,
    annualPrice: 219,
    annualMonthly: 18.25,
    examples: ["Tour companies", "Activity providers", "Travel agencies", "Dive shops", "Adventure guides"],
    icon: "tour",
  },
]

export const INCLUDED_FEATURES = [
  "All 3 certification tiers (Basic, Premium, Elite)",
  "Unlimited staff training seats",
  "AI-powered safety assistant (SOSA)",
  "Facility assessment & AI policy generation",
  "Emergency case dashboard",
  "Public verification page & QR certificate",
  "Local knowledge base",
  "CSV incident log exports",
  "30-day free trial",
]

export const TRIAL_DAYS = 30

/** Map legacy partner_type values to the new property type for pricing */
export function getDefaultPropertyType(partnerType: string): PropertyType {
  return partnerType === "tour_operator" ? "tour_operator" : "guesthouse"
}

/** Get plan by property type */
export function getPlan(propertyType: PropertyType): PricingPlan {
  return PRICING_PLANS.find((p) => p.id === propertyType) ?? PRICING_PLANS[1]
}

/** Format price for display */
export function formatPrice(amount: number): string {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`
}
