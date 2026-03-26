export const CERTIFICATION_RULES = {
  minModuleScore: 70,
  minOverallScore: 75,
  moduleWeights: {
    facility_assessment: 0.4,
    emergency_preparedness: 0.4,
    communication_protocols: 0.2,
  },
} as const

export type ModuleId = keyof typeof CERTIFICATION_RULES.moduleWeights

type Submission = {
  submission_type: string
  score: number | null
  responses?: Record<string, number> | null
}

const CRITICAL_FAIL_CONFIG: Partial<Record<ModuleId, Record<string, number[]>>> = {
  facility_assessment: {
    fa1: [3], // No marked emergency exits
    fa3: [3], // No fire extinguishers
  },
  emergency_preparedness: {
    ep3: [3], // No written emergency plan
  },
  communication_protocols: {
    cp4: [3], // No 24/7 contact
  },
}

const MODULE_LABELS: Record<ModuleId, string> = {
  facility_assessment: "Facility Assessment",
  emergency_preparedness: "Emergency Preparedness",
  communication_protocols: "Communication Protocols",
}

export function evaluateCertificationReadiness(submissions: Submission[]) {
  const moduleScores = Object.keys(CERTIFICATION_RULES.moduleWeights).map((moduleId) => {
    const submission = submissions.find((entry) => entry.submission_type === moduleId)
    return {
      moduleId: moduleId as ModuleId,
      score: submission?.score ?? null,
      responses: submission?.responses ?? null,
    }
  })

  const completedModules = moduleScores.filter((module) => module.score !== null).length
  const weightedOverallScore = calculateWeightedOverall(moduleScores)

  const belowThresholdModules = moduleScores
    .filter(
      (module) =>
        module.score !== null && module.score < CERTIFICATION_RULES.minModuleScore,
    )
    .map((module) => ({
      moduleId: module.moduleId,
      title: MODULE_LABELS[module.moduleId],
      score: module.score as number,
    }))

  const criticalFails = findCriticalFails(moduleScores)

  const reasons: string[] = []
  if (completedModules < moduleScores.length) {
    reasons.push("Complete all certification modules.")
  }
  if (belowThresholdModules.length > 0) {
    reasons.push(
      `Raise module scores to at least ${CERTIFICATION_RULES.minModuleScore}%.`,
    )
  }
  if (
    weightedOverallScore !== null &&
    weightedOverallScore < CERTIFICATION_RULES.minOverallScore
  ) {
    reasons.push(
      `Raise weighted overall score to at least ${CERTIFICATION_RULES.minOverallScore}%.`,
    )
  }
  if (criticalFails.length > 0) {
    reasons.push("Resolve all critical safety items before approval.")
  }

  const isEligible =
    completedModules === moduleScores.length &&
    belowThresholdModules.length === 0 &&
    weightedOverallScore !== null &&
    weightedOverallScore >= CERTIFICATION_RULES.minOverallScore &&
    criticalFails.length === 0

  return {
    isEligible,
    completedModules,
    totalModules: moduleScores.length,
    weightedOverallScore,
    belowThresholdModules,
    criticalFails,
    reasons,
  }
}

function calculateWeightedOverall(
  modules: Array<{ moduleId: ModuleId; score: number | null }>,
) {
  const scoredModules = modules.filter((module) => module.score !== null)
  if (scoredModules.length === 0) return null

  const weightedTotal = scoredModules.reduce((sum, module) => {
    return (
      sum +
      (module.score as number) * CERTIFICATION_RULES.moduleWeights[module.moduleId]
    )
  }, 0)

  const weightTotal = scoredModules.reduce((sum, module) => {
    return sum + CERTIFICATION_RULES.moduleWeights[module.moduleId]
  }, 0)

  if (weightTotal === 0) return null
  return Math.round(weightedTotal / weightTotal)
}

function findCriticalFails(
  modules: Array<{
    moduleId: ModuleId
    responses: Record<string, number> | null
  }>,
) {
  const fails: Array<{ moduleId: ModuleId; questionId: string }> = []

  for (const module of modules) {
    const criticalQuestions = CRITICAL_FAIL_CONFIG[module.moduleId]
    if (!criticalQuestions || !module.responses) continue

    for (const [questionId, failIndexes] of Object.entries(criticalQuestions)) {
      const answerIndex = module.responses[questionId]
      if (answerIndex !== undefined && failIndexes.includes(answerIndex)) {
        fails.push({ moduleId: module.moduleId, questionId })
      }
    }
  }

  return fails
}
