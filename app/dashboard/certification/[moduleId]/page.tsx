"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { use } from "react"
import { MODULES, PASSING_SCORE, calculateModuleScore, didPass } from "@/lib/certification-data"

export default function ModuleAssessmentPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const resolvedParams = use(params)
  const moduleId = resolvedParams.moduleId
  const searchParams = useSearchParams()
  const certId = searchParams.get("certId")
  const isReview = searchParams.get("review") === "true"
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [existingSubmission, setExistingSubmission] = useState<{responses: Record<string, number>; score: number} | null>(null)
  const router = useRouter()

  const moduleData = MODULES.find((m) => m.id === moduleId)

  useEffect(() => {
    async function loadExistingSubmission() {
      if (!certId) return

      const supabase = createClient()
      const { data } = await supabase
        .from("certification_submissions")
        .select("*")
        .eq("certification_id", certId)
        .eq("submission_type", moduleId)
        .single()

      if (data) {
        setExistingSubmission({
          responses: data.responses as Record<string, number>,
          score: data.score
        })
        setAnswers(data.responses as Record<string, number>)
        if (isReview) {
          setSubmitted(true)
          setScore(data.score)
        }
      }
    }

    loadExistingSubmission()
  }, [certId, moduleId, isReview])

  if (!moduleData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Module not found</h1>
        <Link href="/dashboard/certification" className="text-primary hover:underline">
          Back to Certification
        </Link>
      </div>
    )
  }

  const questions = moduleData.questions
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!certId) return

    setIsSubmitting(true)
    const calculatedScore = calculateModuleScore(moduleId, answers)
    const passed = didPass(calculatedScore)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (existingSubmission) {
        // Update existing submission (retry or re-take)
        await supabase
          .from("certification_submissions")
          .update({
            responses: answers,
            score: calculatedScore,
            submitted_at: new Date().toISOString(),
          })
          .eq("certification_id", certId)
          .eq("submission_type", moduleId)
      } else {
        // Create new submission
        await supabase
          .from("certification_submissions")
          .insert({
            certification_id: certId,
            submission_type: moduleId,
            responses: answers,
            score: calculatedScore,
            submitted_by_user_id: user?.id,
          })
      }

      // Only check for full completion if this module passed
      if (passed) {
        const { data: allSubmissions } = await supabase
          .from("certification_submissions")
          .select("submission_type, score")
          .eq("certification_id", certId)

        // A module counts as "complete" only if it passed
        const passedModules = new Set(
          (allSubmissions || [])
            .filter((s) => s.score !== null && s.score >= PASSING_SCORE)
            .map((s) => s.submission_type),
        )
        passedModules.add(moduleId) // include the one we just submitted

        if (passedModules.size === MODULES.length) {
          await supabase
            .from("certifications")
            .update({ status: "in_review" })
            .eq("id", certId)
        }
      }

      // Also record individual training completion for this user
      if (user?.id) {
        const { data: membership } = await supabase
          .from("partner_memberships")
          .select("partner_id")
          .eq("user_id", user.id)
          .is("removed_at", null)
          .single()

        if (membership?.partner_id) {
          await supabase
            .from("staff_training_completions")
            .upsert(
              {
                partner_id: membership.partner_id,
                user_id: user.id,
                module_id: moduleId,
                score: calculatedScore,
                passed,
                completed_at: new Date().toISOString(),
              },
              { onConflict: "partner_id,user_id,module_id" },
            )
        }
      }

      setScore(calculatedScore)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const allAnswered = Object.keys(answers).length === questions.length

  if (submitted) {
    const passed = score !== null && didPass(score)

    const handleRetry = () => {
      setSubmitted(false)
      setScore(null)
      setAnswers({})
      setCurrentQuestion(0)
      setExistingSubmission(null)
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className={`glass-card p-8 rounded-lg border text-center ${
          passed
            ? "border-green-200 dark:border-green-800"
            : "border-red-200 dark:border-red-800"
        }`}>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}>
            {passed ? (
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-2">{moduleData?.title}</h1>
          <p className={`text-4xl font-bold mb-2 ${passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {score}%
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Passing score: {PASSING_SCORE}%
          </p>

          {passed ? (
            <p className="text-muted-foreground mb-8">
              Excellent — you've demonstrated strong safety practices for this module.
            </p>
          ) : (
            <div className="mb-8">
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                This module requires a score of {PASSING_SCORE}% or higher to pass.
              </p>
              <p className="text-muted-foreground text-sm">
                Review the areas where you scored lower and consider what improvements your property could make. You can retake this module as many times as needed.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            {!passed && (
              <button
                onClick={handleRetry}
                className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white"
              >
                Retake Module
              </button>
            )}
            <Link
              href="/dashboard/certification"
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                passed
                  ? "btn-primary-gradient text-white"
                  : "border border-border hover:bg-muted/50"
              }`}
            >
              Back to Certification
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/dashboard/certification" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Certification
        </Link>
        <h1 className="text-2xl font-bold">{moduleData.title}</h1>
        <p className="text-muted-foreground">{moduleData.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="glass-card p-6 rounded-lg border border-border/50 mb-6">
        <h2 className="text-lg font-medium mb-4">{question.question}</h2>
        {question.helpText && (
          <p className="text-sm text-muted-foreground mb-4">{question.helpText}</p>
        )}

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                answers[question.id] === index
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  answers[question.id] === index
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}>
                  {answers[question.id] === index && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQuestion
                  ? "bg-primary"
                  : answers[questions[index].id] !== undefined
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={answers[question.id] === undefined}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
