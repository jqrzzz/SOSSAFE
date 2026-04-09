/**
 * Admin SOSA Tools — Platform-wide queries + actions
 *
 * These tools use the service-role Supabase client to read/write
 * across all partners. Only available to admin users.
 */

import { tool } from "ai"
import { z } from "zod"
import { PRICING_PLANS, TRIAL_DAYS } from "./pricing-data"
import type { SupabaseClient } from "@supabase/supabase-js"

export function createAdminTools(supabase: SupabaseClient) {
  return {
    get_platform_stats: tool({
      description:
        "Get platform-wide business metrics — total partners, MRR, signups, subscription breakdown. Call this when the admin asks about business health, revenue, growth, or overall numbers.",
      inputSchema: z.object({}),
      execute: async () => {
        const [{ data: partners }, { data: memberships }, { data: certs }] = await Promise.all([
          supabase.from("partners").select("id, property_type, subscription_status, trial_ends_at, created_at"),
          supabase.from("partner_memberships").select("id").is("removed_at", null),
          supabase.from("certifications").select("partner_id, status"),
        ])

        const all = partners || []
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const byStatus: Record<string, number> = {}
        const byType: Record<string, number> = {}
        let mrr = 0

        for (const p of all) {
          const st = p.subscription_status || "trialing"
          byStatus[st] = (byStatus[st] || 0) + 1
          const pt = p.property_type || "unset"
          byType[pt] = (byType[pt] || 0) + 1
          if (st === "active") {
            const plan = PRICING_PLANS.find((pl) => pl.id === p.property_type)
            mrr += plan?.monthlyPrice || 0
          }
        }

        const certifiedPartners = new Set(
          (certs || []).filter((c) => c.status === "approved").map((c) => c.partner_id),
        ).size

        return {
          totalPartners: all.length,
          totalTeamMembers: memberships?.length || 0,
          certifiedPartners,
          bySubscriptionStatus: byStatus,
          byBusinessType: byType,
          estimatedMRR: `$${mrr}`,
          estimatedARR: `$${mrr * 12}`,
          signupsThisMonth: all.filter((p) => new Date(p.created_at) >= monthStart).length,
          signupsThisWeek: all.filter((p) => new Date(p.created_at) >= weekAgo).length,
        }
      },
    }),

    search_partners: tool({
      description:
        "Search for partners by name, email, country, city, subscription status, or business type. Call this when the admin asks about a specific partner or wants to filter the partner list.",
      inputSchema: z.object({
        query: z.string().optional().describe("Search by name, email, country, or city"),
        status: z.string().optional().describe("Filter by subscription status: trialing, active, expired, past_due, cancelled"),
        type: z.string().optional().describe("Filter by business type: hostel, guesthouse, hotel, tour_operator"),
        limit: z.number().optional().describe("Max results to return (default 10)"),
      }),
      execute: async ({ query, status, type, limit }) => {
        let q = supabase
          .from("partners")
          .select("id, name, email, property_type, country, city, subscription_status, trial_ends_at, created_at")
          .order("created_at", { ascending: false })
          .limit(limit || 10)

        if (status) q = q.eq("subscription_status", status)
        if (type) q = q.eq("property_type", type)
        if (query) {
          q = q.or(`name.ilike.%${query}%,email.ilike.%${query}%,country.ilike.%${query}%,city.ilike.%${query}%`)
        }

        const { data: partners } = await q
        const now = Date.now()

        return {
          count: partners?.length || 0,
          partners: (partners || []).map((p) => {
            const trialEnd = p.trial_ends_at ? new Date(p.trial_ends_at) : null
            const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now) / (1000 * 60 * 60 * 24))) : null
            return {
              id: p.id,
              name: p.name,
              email: p.email,
              type: p.property_type,
              location: [p.city, p.country].filter(Boolean).join(", "),
              status: p.subscription_status || "trialing",
              trialDaysLeft: daysLeft,
              joined: p.created_at,
              adminUrl: `/admin/partners/${p.id}`,
            }
          }),
        }
      },
    }),

    get_partner_detail: tool({
      description:
        "Get detailed information about a specific partner — profile, subscription, team, certifications. Call this when the admin asks about a specific partner's details. Requires the partner ID (get it from search_partners first).",
      inputSchema: z.object({
        partnerId: z.string().describe("The partner's UUID"),
      }),
      execute: async ({ partnerId }) => {
        const [{ data: partner }, { data: members }, { data: certs }] = await Promise.all([
          supabase.from("partners").select("*").eq("id", partnerId).single(),
          supabase.from("partner_memberships").select("role").eq("partner_id", partnerId).is("removed_at", null),
          supabase.from("certifications").select("certification_tier, status, issued_at, expires_at").eq("partner_id", partnerId),
        ])

        if (!partner) return { error: "Partner not found" }

        const plan = PRICING_PLANS.find((p) => p.id === partner.property_type)
        const trialEnd = partner.trial_ends_at ? new Date(partner.trial_ends_at) : null
        const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null

        return {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          type: partner.property_type || partner.type,
          location: [partner.city, partner.region, partner.country].filter(Boolean).join(", "),
          phone: partner.phone,
          website: partner.website,
          subscription: {
            status: partner.subscription_status || "trialing",
            trialDaysLeft: daysLeft,
            trialEndsAt: partner.trial_ends_at,
            plan: plan ? `${plan.name} — $${plan.monthlyPrice}/mo` : "No plan set",
            stripeConnected: !!(partner.stripe_customer_id),
          },
          teamSize: members?.length || 0,
          teamRoles: members?.map((m) => m.role) || [],
          certifications: (certs || []).map((c) => ({
            tier: c.certification_tier,
            status: c.status,
            issuedAt: c.issued_at,
            expiresAt: c.expires_at,
          })),
          createdAt: partner.created_at,
          adminUrl: `/admin/partners/${partner.id}`,
        }
      },
    }),

    extend_trial: tool({
      description:
        "Extend a partner's free trial by a number of days. Also resets their status to 'trialing'. Call this when the admin wants to give a partner more trial time.",
      inputSchema: z.object({
        partnerId: z.string().describe("The partner's UUID"),
        days: z.number().optional().describe("Number of days to extend (default 30)"),
      }),
      execute: async ({ partnerId, days }) => {
        const extendDays = days || 30
        const newEnd = new Date()
        newEnd.setDate(newEnd.getDate() + extendDays)

        const { error } = await supabase
          .from("partners")
          .update({ trial_ends_at: newEnd.toISOString(), subscription_status: "trialing" })
          .eq("id", partnerId)

        if (error) return { success: false, error: error.message }

        return {
          success: true,
          message: `Trial extended by ${extendDays} days. New expiry: ${newEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
          newTrialEndsAt: newEnd.toISOString(),
        }
      },
    }),

    set_subscription_status: tool({
      description:
        "Update a partner's subscription status. Use 'active' for paying customers or manual deals, 'trialing' to reset to trial, 'expired' to expire. Call this when the admin wants to change a partner's subscription state.",
      inputSchema: z.object({
        partnerId: z.string().describe("The partner's UUID"),
        status: z.enum(["trialing", "active", "past_due", "cancelled", "expired"]).describe("New subscription status"),
      }),
      execute: async ({ partnerId, status }) => {
        const { error } = await supabase
          .from("partners")
          .update({ subscription_status: status })
          .eq("id", partnerId)

        if (error) return { success: false, error: error.message }

        return {
          success: true,
          message: `Subscription status updated to "${status}".`,
          newStatus: status,
        }
      },
    }),

    get_expiring_trials: tool({
      description:
        "Get partners whose trials are expiring soon — useful for churn prevention. Call this when the admin asks about expiring trials, churn risk, or who to follow up with.",
      inputSchema: z.object({
        withinDays: z.number().optional().describe("Show trials expiring within N days (default 7)"),
      }),
      execute: async ({ withinDays }) => {
        const days = withinDays || 7
        const now = new Date()
        const cutoff = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

        const { data: partners } = await supabase
          .from("partners")
          .select("id, name, email, property_type, trial_ends_at")
          .eq("subscription_status", "trialing")
          .not("trial_ends_at", "is", null)
          .lte("trial_ends_at", cutoff.toISOString())
          .gte("trial_ends_at", now.toISOString())
          .order("trial_ends_at", { ascending: true })

        return {
          count: partners?.length || 0,
          withinDays: days,
          partners: (partners || []).map((p) => {
            const end = new Date(p.trial_ends_at)
            const dLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
            return {
              id: p.id,
              name: p.name,
              email: p.email,
              type: p.property_type,
              daysLeft: dLeft,
              trialEndsAt: p.trial_ends_at,
              adminUrl: `/admin/partners/${p.id}`,
            }
          }),
        }
      },
    }),
  }
}
