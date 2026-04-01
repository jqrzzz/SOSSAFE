import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"
import {
  getPublicSystemPrompt,
  getDashboardSystemPrompt,
  type PartnerContext,
} from "@/lib/sosa-system-prompt"

export async function POST(req: Request) {
  const { messages, context } = await req.json()

  // Determine if this is a dashboard (authenticated) or public request
  let systemPrompt: string

  if (context === "dashboard") {
    // Try to load partner context for authenticated users
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: membership } = await supabase
          .from("partner_memberships")
          .select("partner_id, role, partners(name, type, country, city)")
          .eq("user_id", user.id)
          .is("removed_at", null)
          .single()

        if (membership?.partner_id) {
          const partner = membership.partners as unknown as {
            name: string
            type: "accommodation" | "tour_operator"
            country: string
            city: string
          } | null

          // Get certification status
          const { data: cert } = await supabase
            .from("certifications")
            .select("status")
            .eq("partner_id", membership.partner_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          // Get modules completed
          const { data: subs } = await supabase
            .from("certification_submissions")
            .select("submission_type, score")
            .eq("partner_id", membership.partner_id)

          const modulesCompleted = (subs ?? []).filter(
            (s) => s.score !== null && s.score >= 80,
          ).length

          // Get team size
          const { count: teamSize } = await supabase
            .from("partner_memberships")
            .select("*", { count: "exact", head: true })
            .eq("partner_id", membership.partner_id)
            .is("removed_at", null)

          // Get trained count
          const { data: training } = await supabase
            .from("staff_training_completions")
            .select("user_id, passed")
            .eq("partner_id", membership.partner_id)

          const trainedMembers = new Set(
            (training ?? []).filter((t) => t.passed).map((t) => t.user_id),
          ).size

          // Get local knowledge entries
          const { data: knowledge } = await supabase
            .from("partner_local_knowledge")
            .select("category, title, content, verified")
            .eq("partner_id", membership.partner_id)
            .order("created_at", { ascending: false })
            .limit(50)

          const partnerContext: PartnerContext = {
            partnerName: partner?.name ?? "Your Organization",
            partnerType: partner?.type ?? "accommodation",
            country: partner?.country ?? "Unknown",
            city: partner?.city ?? "Unknown",
            certificationStatus: cert?.status ?? null,
            modulesCompleted,
            teamSize: teamSize ?? 1,
            trainedMembers,
            localKnowledge: (knowledge ?? []).map((k) => ({
              category: k.category,
              title: k.title,
              content: k.content,
              verified: k.verified,
            })),
          }

          systemPrompt = getDashboardSystemPrompt(partnerContext)
        } else {
          systemPrompt = getPublicSystemPrompt()
        }
      } else {
        systemPrompt = getPublicSystemPrompt()
      }
    } catch {
      systemPrompt = getPublicSystemPrompt()
    }
  } else {
    systemPrompt = getPublicSystemPrompt()
  }

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}
