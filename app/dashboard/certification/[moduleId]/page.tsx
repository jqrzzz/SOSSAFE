"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { use } from "react"
import { CERTIFICATION_RULES } from "@/lib/certification/rules"
import { CERTIFICATION_MODULE_ORDER, getCertificationModule } from "@/lib/certification/curriculum"

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

  const moduleData = getCertificationModule(moduleId)

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

  const calculateScore = () => {
    let totalScore = 0
    const maxScore = questions.length * 3 // Max 3 points per question (index 0 = best)

    Object.values(answers).forEach(answerIndex => {
      // Score: 0 index = 3 points, 1 = 2 points, 2 = 1 point, 3 = 0 points
      totalScore += Math.max(0, 3 - answerIndex)
    })

    return Math.round((totalScore / maxScore) * 100)
  }

  const handleSubmit = async () => {
    if (!certId) return

    setIsSubmitting(true)
    const calculatedScore = calculateScore()

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (existingSubmission) {
        // Update existing submission
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

      // Check if all modules are complete
      const { data: allSubmissions } = await supabase
        .from("certification_submissions")
        .select("submission_type")
        .eq("certification_id", certId)

      const completedModules = new Set(allSubmissions?.map(s => s.submission_type) || [])
      completedModules.add(moduleId)

      if (completedModules.size === CERTIFICATION_MODULE_ORDER.length) {
        // All modules complete - update certification to in_review
        await supabase
          .from("certifications")
          .update({ status: "in_review" })
          .eq("id", certId)
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
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-lg border border-border/50 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            score && score >= CERTIFICATION_RULES.minModuleScore
              ? "bg-green-100 dark:bg-green-900/30" 
              : "bg-yellow-100 dark:bg-yellow-900/30"
          }`}>
            {score && score >= CERTIFICATION_RULES.minModuleScore ? (
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-2">{moduleData.title}</h1>
          <p className="text-4xl font-bold text-primary mb-4">{score}%</p>
          <p className="text-muted-foreground mb-8">
            {score && score >= CERTIFICATION_RULES.minModuleScore
              ? "Great job! You have demonstrated good safety practices."
              : "Consider improving your safety measures based on the assessment."}
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard/certification"
              className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white"
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
