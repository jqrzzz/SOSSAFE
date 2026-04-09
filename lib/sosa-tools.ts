/**
 * SOSA Dashboard Tools — Scoped to a single partner
 *
 * Each tool queries the partner's own data on-demand rather than
 * stuffing everything into the system prompt. Claude calls tools
 * as needed based on the user's question.
 */

import { tool } from "ai"
import { z } from "zod"
import { ASSESSMENT_QUESTIONS, ASSESSMENT_CATEGORIES } from "./facility-assessment-data"
import { MODULES, PASSING_SCORE } from "./certification-data"
import { getPlan, formatPrice, TRIAL_DAYS } from "./pricing-data"
import type { PropertyType } from "./pricing-data"
import type { SupabaseClient } from "@supabase/supabase-js"

export function createDashboardTools(supabase: SupabaseClient, partnerId: string) {
  return {
    get_certification_progress: tool({
      description:
        "Get the partner's certification progress — tiers, module scores, pass/fail status, and what they need to do next. Call this when the user asks about certification, scores, progress, or next steps.",
      inputSchema: z.object({}),
      execute: async () => {
        const [{ data: certs }, { data: submissions }] = await Promise.all([
          supabase
            .from("certifications")
            .select("id, certification_tier, status, issued_at, expires_at")
            .eq("partner_id", partnerId),
          supabase
            .from("certification_submissions")
            .select("id, module_id, score, passed, submitted_at")
            .eq("partner_id", partnerId)
            .order("submitted_at", { ascending: false }),
        ])

        const allSubs = submissions || []
        const allCerts = certs || []

        // Best attempt per module
        const bestByModule: Record<string, { score: number; passed: boolean; attempts: number }> = {}
        for (const s of allSubs) {
          const existing = bestByModule[s.module_id]
          const attempts = (existing?.attempts || 0) + 1
          if (!existing || s.score > existing.score) {
            bestByModule[s.module_id] = { score: s.score, passed: s.passed, attempts }
          } else {
            existing.attempts = attempts
          }
        }

        const modulesCompleted = Object.values(bestByModule).filter((m) => m.passed).length
        const totalModules = MODULES.length

        // Figure out next steps
        const incompleteModules = MODULES.filter((m) => !bestByModule[m.id]?.passed).map((m) => ({
          id: m.id,
          title: m.title,
          attempted: !!bestByModule[m.id],
          bestScore: bestByModule[m.id]?.score ?? null,
        }))

        return {
          certifications: allCerts.map((c) => ({
            tier: c.certification_tier,
            status: c.status,
            issuedAt: c.issued_at,
            expiresAt: c.expires_at,
          })),
          moduleResults: Object.entries(bestByModule).map(([id, data]) => ({
            moduleId: id,
            moduleName: MODULES.find((m) => m.id === id)?.title ?? id,
            bestScore: data.score,
            passed: data.passed,
            attempts: data.attempts,
          })),
          modulesCompleted,
          totalModules,
          passingScore: PASSING_SCORE,
          incompleteModules,
          totalAttempts: allSubs.length,
          appUrl: "/dashboard/certification",
        }
      },
    }),

    get_team_status: tool({
      description:
        "Get the team roster and training status — who's on the team, their roles, and who has completed which training modules. Call this when the user asks about team, staff, training progress, or invites.",
      inputSchema: z.object({}),
      execute: async () => {
        const [{ data: members }, { data: training }] = await Promise.all([
          supabase
            .from("partner_memberships")
            .select("user_id, role, is_primary_contact, accepted_at")
            .eq("partner_id", partnerId)
            .is("removed_at", null),
          supabase
            .from("staff_training_completions")
            .select("user_id, module_id, score, passed, completed_at")
            .eq("partner_id", partnerId),
        ])

        const allMembers = members || []
        const allTraining = training || []

        // Training per user
        const trainingByUser: Record<string, { completed: number; modules: string[] }> = {}
        for (const t of allTraining) {
          if (!t.passed) continue
          if (!trainingByUser[t.user_id]) {
            trainingByUser[t.user_id] = { completed: 0, modules: [] }
          }
          trainingByUser[t.user_id].completed++
          const mod = MODULES.find((m) => m.id === t.module_id)
          if (mod) trainingByUser[t.user_id].modules.push(mod.title)
        }

        const fullyTrained = Object.values(trainingByUser).filter(
          (u) => u.completed >= MODULES.length,
        ).length

        return {
          totalMembers: allMembers.length,
          members: allMembers.map((m) => ({
            role: m.role,
            isPrimaryContact: m.is_primary_contact,
            joinedAt: m.accepted_at,
            modulesCompleted: trainingByUser[m.user_id]?.completed ?? 0,
            completedModules: trainingByUser[m.user_id]?.modules ?? [],
          })),
          fullyTrainedMembers: fullyTrained,
          totalModules: MODULES.length,
          appUrl: "/dashboard/team",
        }
      },
    }),

    get_local_knowledge: tool({
      description:
        "Search or browse the partner's local knowledge base — safety intel about nearby hospitals, emergency contacts, hazards, transport, etc. Call this when the user asks about local info, hospitals, emergency contacts, or area-specific safety details.",
      inputSchema: z.object({
        category: z.string().optional().describe("Filter by category (e.g. 'medical', 'transport', 'hazards', 'contacts')"),
        search: z.string().optional().describe("Search term to filter entries by title or content"),
      }),
      execute: async ({ category, search }) => {
        let query = supabase
          .from("partner_local_knowledge")
          .select("id, category, title, content, verified, created_at")
          .eq("partner_id", partnerId)
          .order("created_at", { ascending: false })
          .limit(30)

        if (category) {
          query = query.eq("category", category)
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
        }

        const { data: entries } = await query

        const { count: totalCount } = await supabase
          .from("partner_local_knowledge")
          .select("*", { count: "exact", head: true })
          .eq("partner_id", partnerId)

        return {
          entries: (entries || []).map((e) => ({
            category: e.category,
            title: e.title,
            content: e.content,
            verified: e.verified,
          })),
          resultCount: entries?.length ?? 0,
          totalEntries: totalCount ?? 0,
          appUrl: "/dashboard/knowledge",
        }
      },
    }),

    get_facility_profile: tool({
      description:
        "Get the partner's facility assessment answers — what equipment they have, protocols in place, and gaps that need attention. Call this when the user asks about their facility, equipment (AED, first aid kit, etc.), protocols, or policies.",
      inputSchema: z.object({
        category: z.string().optional().describe("Filter by category (e.g. 'medical_equipment', 'emergency_protocols', 'staff_training')"),
      }),
      execute: async ({ category }) => {
        let query = supabase
          .from("facility_assessments")
          .select("question_id, category, answer, created_at")
          .eq("partner_id", partnerId)
          .order("created_at", { ascending: true })

        if (category) {
          query = query.eq("category", category)
        }

        const { data: answers } = await query

        const allAnswers = (answers || []).map((a) => {
          const question = ASSESSMENT_QUESTIONS.find((q) => q.id === a.question_id)
          return {
            question: question?.question ?? a.question_id,
            category: a.category,
            categoryLabel: ASSESSMENT_CATEGORIES.find((c) => c.id === a.category)?.label ?? a.category,
            answer: a.answer,
            policySection: question?.policySection ?? "General",
          }
        })

        // Find gaps — categories with no answers
        const answeredCategories = new Set(allAnswers.map((a) => a.category))
        const gaps = ASSESSMENT_CATEGORIES
          .filter((c) => !answeredCategories.has(c.id))
          .map((c) => c.label)

        return {
          answers: allAnswers,
          totalAnswered: allAnswers.length,
          totalQuestions: ASSESSMENT_QUESTIONS.length,
          gaps,
          appUrl: "/dashboard/policies",
        }
      },
    }),

    get_case_summary: tool({
      description:
        "Get a summary of emergency cases linked to this partner — total count, recent cases, and status breakdown. Call this when the user asks about cases, incidents, emergencies, or their case history.",
      inputSchema: z.object({}),
      execute: async () => {
        const { data: caseLinks } = await supabase
          .from("case_parties")
          .select("case_id, role")
          .eq("partner_id", partnerId)

        if (!caseLinks || caseLinks.length === 0) {
          return {
            totalCases: 0,
            recentCases: [],
            note: "No emergency cases linked to this partner yet.",
            appUrl: "/dashboard/cases",
          }
        }

        const caseIds = caseLinks.map((c) => c.case_id)
        const { data: cases } = await supabase
          .from("cases")
          .select("id, status, severity, created_at")
          .in("id", caseIds)
          .order("created_at", { ascending: false })
          .limit(10)

        return {
          totalCases: caseLinks.length,
          recentCases: (cases || []).map((c) => ({
            id: c.id,
            status: c.status,
            severity: c.severity,
            createdAt: c.created_at,
          })),
          appUrl: "/dashboard/cases",
        }
      },
    }),

    get_subscription_info: tool({
      description:
        "Get the partner's subscription and billing status — plan, trial days remaining, and payment status. Call this when the user asks about their plan, billing, trial, subscription, or payment.",
      inputSchema: z.object({}),
      execute: async () => {
        const { data: partner } = await supabase
          .from("partners")
          .select("subscription_status, trial_ends_at, property_type")
          .eq("id", partnerId)
          .single()

        if (!partner) return { error: "Partner not found" }

        const status = partner.subscription_status || "trialing"
        const trialEnd = partner.trial_ends_at ? new Date(partner.trial_ends_at) : null
        const daysLeft = trialEnd
          ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          : null
        const plan = partner.property_type ? getPlan(partner.property_type as PropertyType) : null

        return {
          subscriptionStatus: status,
          trialDaysLeft: daysLeft,
          trialEndsAt: partner.trial_ends_at,
          trialLength: TRIAL_DAYS,
          plan: plan
            ? {
                name: plan.name,
                monthlyPrice: formatPrice(plan.monthlyPrice),
                annualPrice: formatPrice(plan.annualPrice),
              }
            : null,
          appUrl: "/dashboard/settings/billing",
        }
      },
    }),
  }
}
