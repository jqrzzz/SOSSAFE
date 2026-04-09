import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"
import { ASSESSMENT_QUESTIONS } from "@/lib/facility-assessment-data"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const { partnerId } = await req.json()

  // Rate limit: 5 generations per hour per partner (expensive AI operation)
  const { allowed } = rateLimit(`policy:${partnerId}`, { maxRequests: 5, windowMs: 3_600_000 })
  if (!allowed) {
    return Response.json(
      { error: "Rate limit exceeded. Please wait before generating another document." },
      { status: 429 },
    )
  }

  const supabase = await createClient()

  // Verify the user has access to this partner
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: membership } = await supabase
    .from("partner_memberships")
    .select("partner_id, role")
    .eq("user_id", user.id)
    .eq("partner_id", partnerId)
    .is("removed_at", null)
    .single()

  if (!membership || !["owner", "manager"].includes(membership.role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  // Load partner info
  const { data: partner } = await supabase
    .from("partners")
    .select("name, type, country, city, address")
    .eq("id", partnerId)
    .single()

  // Load all assessment answers
  const { data: answers } = await supabase
    .from("facility_assessments")
    .select("question_id, category, answer")
    .eq("partner_id", partnerId)
    .order("created_at", { ascending: true })

  if (!answers?.length) {
    return Response.json(
      { error: "No assessment answers found" },
      { status: 400 },
    )
  }

  // Build the prompt with all Q&A pairs
  const qaPairs = answers
    .map((a) => {
      const question = ASSESSMENT_QUESTIONS.find((q) => q.id === a.question_id)
      return question
        ? `**${question.policySection}**\nQ: ${question.question}\nA: ${a.answer}`
        : null
    })
    .filter(Boolean)
    .join("\n\n")

  const propertyType =
    partner?.type === "tour_operator" ? "tour operation" : "accommodation property"

  const prompt = `You are generating a professional Emergency Policies & Procedures document for a ${propertyType}.

## Property Information
- **Name**: ${partner?.name ?? "Unknown"}
- **Type**: ${propertyType}
- **Location**: ${partner?.city ?? "Unknown"}, ${partner?.country ?? "Unknown"}
${partner?.address ? `- **Address**: ${partner.address}` : ""}

## Facility Assessment Data
The property owner/manager provided these answers during a structured assessment:

${qaPairs}

## Your Task
Generate a comprehensive, professional Emergency Policies & Procedures document based on their answers. The document should:

1. Use markdown formatting (# for title, ## for sections, ### for subsections, - for bullet points)
2. Start with: # Emergency Policies & Procedures — ${partner?.name ?? "Property Name"}
3. Include a brief introduction paragraph
4. Organize into clear sections based on the assessment categories
5. For each topic, write:
   - The current state (what they have)
   - The procedure/protocol (step-by-step what staff should do)
   - Any gaps or recommendations you identified from their answers
6. Include a "Recommended Improvements" section at the end for anything they're missing
7. Be specific — use the actual numbers, locations, and details they provided
8. Write in clear, actionable language that frontline staff can follow
9. Include contact numbers and locations they mentioned
10. End with a "Document Review Schedule" section recommending quarterly reviews

Write the complete document. Be thorough but practical — this will be printed and posted in staff areas.`

  // Generate the document (non-streaming — we need the full text)
  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    prompt,
  })

  // Collect the full response
  let fullText = ""
  for await (const chunk of result.textStream) {
    fullText += chunk
  }

  // Get current version number
  const { data: latestVersion } = await supabase
    .from("facility_policies")
    .select("version")
    .eq("partner_id", partnerId)
    .order("version", { ascending: false })
    .limit(1)
    .single()

  const nextVersion = (latestVersion?.version ?? 0) + 1

  // Save the generated policy
  const { data: savedPolicy, error: saveError } = await supabase
    .from("facility_policies")
    .insert({
      partner_id: partnerId,
      title: `Emergency Policies & Procedures — ${partner?.name ?? "Property"}`,
      content: fullText,
      based_on_answers: answers.map((a) => a.question_id),
      version: nextVersion,
      generated_by: user.id,
    })
    .select()
    .single()

  if (saveError) {
    return Response.json({ error: saveError.message }, { status: 500 })
  }

  return Response.json({ policy: savedPolicy })
}
