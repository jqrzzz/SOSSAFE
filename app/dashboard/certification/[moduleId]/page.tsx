"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { use } from "react"

interface Question {
  id: string
  question: string
  options: string[]
  helpText?: string
}

const MODULE_DATA: Record<string, { title: string; description: string; questions: Question[] }> = {
  facility_assessment: {
    title: "Facility Assessment",
    description: "Evaluate your property safety features and emergency equipment",
    questions: [
      {
        id: "fa1",
        question: "Does your property have clearly marked emergency exits?",
        options: ["Yes, all exits are clearly marked and lit", "Yes, most exits are marked", "Some exits are marked", "No marked emergency exits"],
        helpText: "Emergency exits should be clearly visible with illuminated signs."
      },
      {
        id: "fa2",
        question: "Is there a first aid kit readily available on the premises?",
        options: ["Yes, multiple kits in accessible locations", "Yes, one well-stocked kit", "Yes, but supplies are limited", "No first aid kit available"],
      },
      {
        id: "fa3",
        question: "Are fire extinguishers present and regularly inspected?",
        options: ["Yes, inspected within the last 6 months", "Yes, inspected within the last year", "Yes, but not recently inspected", "No fire extinguishers"],
      },
      {
        id: "fa4",
        question: "Does your property have an AED (Automated External Defibrillator)?",
        options: ["Yes, with trained staff", "Yes, but staff needs training", "Planning to acquire one", "No AED available"],
      },
      {
        id: "fa5",
        question: "Are emergency contact numbers posted in visible locations?",
        options: ["Yes, in all rooms and common areas", "Yes, in common areas only", "Yes, at the front desk only", "No posted emergency numbers"],
      },
      {
        id: "fa6",
        question: "Is your property accessible for guests with mobility issues?",
        options: ["Fully accessible with ramps and elevators", "Partially accessible", "Limited accessibility", "Not accessible"],
      },
      {
        id: "fa7",
        question: "Do you have smoke detectors and fire alarms installed?",
        options: ["Yes, in all rooms and tested regularly", "Yes, in all rooms", "Yes, in common areas only", "No smoke detectors"],
      },
      {
        id: "fa8",
        question: "Is there adequate lighting in emergency exit routes?",
        options: ["Yes, with backup emergency lighting", "Yes, standard lighting", "Partial lighting", "Inadequate lighting"],
      },
    ],
  },
  emergency_preparedness: {
    title: "Emergency Preparedness",
    description: "Assess your team readiness and emergency response procedures",
    questions: [
      {
        id: "ep1",
        question: "Does your staff receive regular emergency response training?",
        options: ["Yes, quarterly training sessions", "Yes, annual training", "Informal training only", "No formal training"],
      },
      {
        id: "ep2",
        question: "Is there a designated emergency coordinator on each shift?",
        options: ["Yes, trained coordinator on every shift", "Yes, but not on all shifts", "Informal arrangement", "No designated coordinator"],
      },
      {
        id: "ep3",
        question: "Do you have a written emergency response plan?",
        options: ["Yes, comprehensive and regularly updated", "Yes, but needs updating", "Basic plan only", "No written plan"],
      },
      {
        id: "ep4",
        question: "How often do you conduct emergency drills?",
        options: ["Quarterly or more often", "Twice a year", "Once a year", "Never conducted drills"],
      },
      {
        id: "ep5",
        question: "Are staff trained in basic first aid and CPR?",
        options: ["Most staff certified", "Some staff certified", "One person certified", "No certified staff"],
      },
      {
        id: "ep6",
        question: "Do you have procedures for natural disasters common to your area?",
        options: ["Yes, specific procedures for all risks", "Yes, for major risks", "Basic awareness only", "No specific procedures"],
      },
      {
        id: "ep7",
        question: "Is there a system to account for all guests during an emergency?",
        options: ["Yes, with guest manifest system", "Yes, manual process", "Informal process", "No system in place"],
      },
      {
        id: "ep8",
        question: "Do you have backup power for essential services?",
        options: ["Yes, generator for full property", "Yes, for essential systems only", "Battery backup only", "No backup power"],
      },
      {
        id: "ep9",
        question: "Are emergency supplies stocked (water, blankets, etc.)?",
        options: ["Yes, well-stocked emergency supplies", "Yes, basic supplies", "Minimal supplies", "No emergency supplies"],
      },
      {
        id: "ep10",
        question: "Do you have relationships with local emergency services?",
        options: ["Yes, direct contacts and coordination", "Yes, know how to reach them", "General awareness only", "No established relationship"],
      },
    ],
  },
  communication_protocols: {
    title: "Communication Protocols",
    description: "Review your guest communication and emergency coordination systems",
    questions: [
      {
        id: "cp1",
        question: "Do you provide emergency information to guests at check-in?",
        options: ["Yes, verbal and written information", "Yes, written information only", "Only if asked", "No emergency information provided"],
      },
      {
        id: "cp2",
        question: "Is emergency information available in multiple languages?",
        options: ["Yes, 3+ languages including local", "Yes, 2 languages", "English only", "Local language only"],
      },
      {
        id: "cp3",
        question: "Do you have a system to communicate with all guests quickly?",
        options: ["Yes, PA system and room phones", "Yes, one of these methods", "Staff go door-to-door", "No mass communication system"],
      },
      {
        id: "cp4",
        question: "Can guests easily contact front desk 24/7?",
        options: ["Yes, multiple methods available", "Yes, phone only", "Limited hours", "No 24/7 contact"],
      },
      {
        id: "cp5",
        question: "Do you have contact information for guests medical conditions?",
        options: ["Yes, collected at check-in", "Yes, if volunteered", "No formal collection", "Do not collect this information"],
      },
      {
        id: "cp6",
        question: "Is there a protocol for communicating with guest emergency contacts?",
        options: ["Yes, established protocol", "Informal process", "Only in serious situations", "No protocol"],
      },
    ],
  },
}

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

  const moduleData = MODULE_DATA[moduleId]

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

      if (completedModules.size === Object.keys(MODULE_DATA).length) {
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
            score && score >= 70 
              ? "bg-green-100 dark:bg-green-900/30" 
              : "bg-yellow-100 dark:bg-yellow-900/30"
          }`}>
            {score && score >= 70 ? (
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
            {score && score >= 70 
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
