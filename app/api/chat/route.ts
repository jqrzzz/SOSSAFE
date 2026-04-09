import { streamText, stepCountIs } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"
import { getPublicSystemPrompt, getDashboardSystemPrompt } from "@/lib/sosa-system-prompt"
import { createDashboardTools } from "@/lib/sosa-tools"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  // Rate limit: 20 requests per minute per IP
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  const { allowed } = rateLimit(`chat:${ip}`, { maxRequests: 20, windowMs: 60_000 })
  if (!allowed) {
    return new Response("Too many requests. Please wait a moment before trying again.", {
      status: 429,
      headers: { "Content-Type": "text/plain" },
    })
  }

  const { messages, context } = await req.json()

  let systemPrompt: string
  let tools: ReturnType<typeof createDashboardTools> | undefined

  if (context === "dashboard") {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

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

          systemPrompt = getDashboardSystemPrompt({
            partnerName: partner?.name ?? "Your Organization",
            partnerType: partner?.type ?? "accommodation",
            country: partner?.country ?? "Unknown",
            city: partner?.city ?? "Unknown",
          })

          // Create scoped tools — every query is filtered to this partner
          tools = createDashboardTools(supabase, membership.partner_id)
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

  try {
    const result = streamText({
      model: anthropic("claude-haiku-4-5"),
      system: systemPrompt,
      messages,
      tools,
      stopWhen: stepCountIs(5),
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[Chat API Error]", error)
    return new Response("I'm having trouble connecting right now. Please try again in a moment.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
