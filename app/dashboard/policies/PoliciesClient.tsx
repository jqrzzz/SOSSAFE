"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type {
  AssessmentQuestion,
  AssessmentCategory,
  CategoryMeta,
} from "@/lib/facility-assessment-data"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Answer {
  id: string
  partner_id: string
  question_id: string
  category: string
  answer: string
  extracted_data: Record<string, unknown>
  answered_by: string
  created_at: string
  updated_at: string
}

interface Policy {
  id: string
  partner_id: string
  title: string
  content: string
  version: number
  generated_at: string
}

interface Props {
  partnerId: string
  partnerName: string
  partnerType: "accommodation" | "tour_operator"
  userId: string
  canManage: boolean
  existingAnswers: Answer[]
  latestPolicy: Policy | null
  questions: AssessmentQuestion[]
  categories: CategoryMeta[]
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function PoliciesClient({
  partnerId,
  partnerName,
  partnerType,
  userId,
  canManage,
  existingAnswers,
  latestPolicy,
  questions,
  categories,
}: Props) {
  const [tab, setTab] = useState<"interview" | "policies">(
    latestPolicy ? "policies" : "interview",
  )
  const [answers, setAnswers] = useState<Answer[]>(existingAnswers)
  const [policy, setPolicy] = useState<Policy | null>(latestPolicy)
  const [activeCategory, setActiveCategory] = useState<AssessmentCategory>(
    categories[0].id,
  )
  const [currentInput, setCurrentInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const categoryQuestions = questions.filter(
    (q) => q.category === activeCategory,
  )
  const answeredIds = new Set(answers.map((a) => a.question_id))
  const totalQuestions = questions.length
  const totalAnswered = answers.length
  const completionPercent = Math.round((totalAnswered / totalQuestions) * 100)

  // Find the next unanswered question in this category
  const nextUnanswered = categoryQuestions.find(
    (q) => !answeredIds.has(q.id),
  )
  const activeQuestion = nextUnanswered ?? categoryQuestions[0]

  const getAnswerForQuestion = (questionId: string) =>
    answers.find((a) => a.question_id === questionId)

  // Auto-scroll to bottom of interview
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeCategory, answers])

  // Category completion stats
  const getCategoryStats = (catId: AssessmentCategory) => {
    const catQuestions = questions.filter((q) => q.category === catId)
    const catAnswered = catQuestions.filter((q) => answeredIds.has(q.id)).length
    return { total: catQuestions.length, answered: catAnswered }
  }

  /* ── Save an answer ─────────────────────────────────────────────── */
  const saveAnswer = async (questionId: string, text: string) => {
    if (!text.trim() || saving) return
    setSaving(true)

    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from("facility_assessments")
      .upsert(
        {
          partner_id: partnerId,
          question_id: questionId,
          category: question.category,
          answer: text.trim(),
          answered_by: userId,
        },
        { onConflict: "partner_id,question_id" },
      )
      .select()
      .single()

    if (!error && data) {
      setAnswers((prev) => {
        const existing = prev.findIndex(
          (a) => a.question_id === questionId,
        )
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = data
          return updated
        }
        return [...prev, data]
      })
    }

    setCurrentInput("")
    setSaving(false)
  }

  /* ── Generate P&P document ──────────────────────────────────────── */
  const [generateError, setGenerateError] = useState<string | null>(null)

  const generatePolicy = async () => {
    if (totalAnswered === 0 || generating) return
    setGenerating(true)
    setGenerateError(null)

    try {
      const res = await fetch("/api/policies/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId }),
      })

      if (res.ok) {
        const result = await res.json()
        setPolicy(result.policy)
        setTab("policies")
      } else {
        setGenerateError("Failed to generate document. Please try again.")
      }
    } catch {
      setGenerateError("Network error. Please check your connection and try again.")
    }

    setGenerating(false)
  }

  /* ── Interview Tab ──────────────────────────────────────────────── */
  const renderInterview = () => (
    <div className="space-y-6">
      {/* Progress */}
      <div className="glass-card p-4 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Facility Assessment Progress</span>
          <span className="text-sm text-muted-foreground">
            {totalAnswered} of {totalQuestions} questions ({completionPercent}%)
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const stats = getCategoryStats(cat.id)
          const isActive = activeCategory === cat.id
          const isComplete = stats.answered === stats.total

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-muted/50"
              }`}
            >
              {isComplete && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {cat.label}
              <span className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {stats.answered}/{stats.total}
              </span>
            </button>
          )
        })}
      </div>

      {/* Q&A Flow */}
      <div
        ref={scrollRef}
        className="glass-card rounded-lg border border-border/50 overflow-hidden"
      >
        <div className="p-4 border-b border-border/50 bg-muted/30">
          <h3 className="font-semibold text-sm">
            {categories.find((c) => c.id === activeCategory)?.label}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {categories.find((c) => c.id === activeCategory)?.description}
          </p>
        </div>

        <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
          {categoryQuestions.map((q) => {
            const existing = getAnswerForQuestion(q.id)
            const isNext = !existing && q.id === activeQuestion?.id

            return (
              <div key={q.id} className="space-y-3">
                {/* SOSA's question */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">S</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.question}</p>
                    {isNext && q.followUps.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {q.followUps.map((fu, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            {">"} {fu}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing answer */}
                {existing && (
                  <div className="flex gap-3 ml-11">
                    <div className="flex-1 bg-primary/5 rounded-lg p-3">
                      <p className="text-sm">{existing.answer}</p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Answered {new Date(existing.updated_at).toLocaleDateString()}
                        {canManage && (
                          <button
                            onClick={() => {
                              setCurrentInput(existing.answer)
                              // Focus input
                              setTimeout(() => inputRef.current?.focus(), 100)
                            }}
                            className="ml-2 text-primary hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Input for next unanswered question */}
                {isNext && canManage && (
                  <div className="ml-11">
                    <div className="flex gap-2">
                      <textarea
                        ref={inputRef}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            saveAnswer(q.id, currentInput)
                          }
                        }}
                        placeholder="Type your answer... (Enter to save, Shift+Enter for new line)"
                        rows={3}
                        className="premium-input flex-1 resize-none text-sm"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] text-muted-foreground">
                        Be specific — include numbers, locations, names. This builds your P&P document.
                      </p>
                      <button
                        onClick={() => saveAnswer(q.id, currentInput)}
                        disabled={!currentInput.trim() || saving}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Answer"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Not answered yet and not the current question */}
                {!existing && !isNext && (
                  <div className="ml-11">
                    <p className="text-xs text-muted-foreground/50 italic">
                      Answer the question above first
                    </p>
                  </div>
                )}
              </div>
            )
          })}

          {/* Category complete message */}
          {getCategoryStats(activeCategory).answered ===
            getCategoryStats(activeCategory).total && (
            <div className="text-center py-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                All questions in this category answered
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Switch to another category or generate your P&P document.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      {totalAnswered >= 5 && (
        <div className="glass-card p-6 rounded-lg border border-primary/20 text-center">
          <h3 className="font-semibold mb-2">
            Ready to Generate Your Policies & Procedures?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your {totalAnswered} answers, SOSA will create a custom
            emergency policies and procedures document for {partnerName}.
            {totalAnswered < totalQuestions && (
              <> You can continue answering more questions later to improve it.</>
            )}
          </p>
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 mb-4">
            <p className="text-xs text-yellow-800 dark:text-yellow-300 leading-relaxed">
              <strong>Important:</strong> The generated document is created by AI based on your assessment answers.
              It should be reviewed and approved by qualified safety personnel before adoption.
              It does not constitute professional safety, legal, or regulatory advice.
            </p>
          </div>
          <button
            onClick={generatePolicy}
            disabled={generating}
            className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white transition-all duration-300"
          >
            {generating
              ? "Generating..."
              : policy
              ? "Regenerate P&P Document"
              : "Generate P&P Document"}
          </button>
          {generateError && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">{generateError}</p>
          )}
        </div>
      )}
    </div>
  )

  /* ── Policy Document Tab ────────────────────────────────────────── */
  const renderPolicy = () => {
    if (!policy) {
      return (
        <div className="glass-card p-8 rounded-lg border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Policy Document Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Complete the facility assessment interview first, then SOSA will generate
            a custom Policies & Procedures document for your property.
          </p>
          <button
            onClick={() => setTab("interview")}
            className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white"
          >
            Start Assessment
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Document header */}
        <div className="glass-card p-6 rounded-lg border border-border/50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{policy.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Version {policy.version} — Generated{" "}
                {new Date(policy.generated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Print
              </button>
              {canManage && (
                <button
                  onClick={generatePolicy}
                  disabled={generating}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {generating ? "Regenerating..." : "Regenerate"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI-generated disclaimer */}
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 print:hidden">
          <p className="text-xs text-yellow-800 dark:text-yellow-300 leading-relaxed">
            This document was generated by AI based on your facility assessment answers. It should be reviewed
            and approved by qualified safety personnel before being adopted as official policy. Tourist SOS is
            not responsible for the accuracy or completeness of AI-generated content.
          </p>
        </div>

        {/* Document content */}
        <div className="glass-card p-8 rounded-lg border border-border/50 print:border-none print:shadow-none">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {policy.content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={i} className="text-2xl font-bold mt-8 mb-4 first:mt-0">
                    {line.slice(2)}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-semibold mt-6 mb-3 text-primary">
                    {line.slice(3)}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-lg font-medium mt-4 mb-2">
                    {line.slice(4)}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-4 text-sm text-muted-foreground">
                    {line.slice(2)}
                  </li>
                )
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="font-semibold text-sm mt-3">
                    {line.slice(2, -2)}
                  </p>
                )
              }
              if (!line.trim()) return <br key={i} />
              return (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {line}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Policies & Procedures</h1>
        <p className="text-muted-foreground mt-1">
          SOSA interviews your team to build custom emergency protocols for{" "}
          {partnerName}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("interview")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "interview"
              ? "bg-primary text-primary-foreground"
              : "border border-border hover:bg-muted/50"
          }`}
        >
          Facility Assessment
          {totalAnswered > 0 && (
            <span className="ml-2 text-xs opacity-70">
              {completionPercent}%
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("policies")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "policies"
              ? "bg-primary text-primary-foreground"
              : "border border-border hover:bg-muted/50"
          }`}
        >
          P&P Document
          {policy && (
            <span className="ml-2 text-xs opacity-70">v{policy.version}</span>
          )}
        </button>
      </div>

      {tab === "interview" ? renderInterview() : renderPolicy()}
    </div>
  )
}
