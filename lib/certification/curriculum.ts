export interface CertificationQuestion {
  id: string
  question: string
  options: string[]
  helpText?: string
}

export interface CertificationModule {
  id: string
  title: string
  description: string
  questions: CertificationQuestion[]
}

export const CERTIFICATION_CURRICULUM: Record<string, CertificationModule> = {
  facility_assessment: {
    id: "facility_assessment",
    title: "Facility Assessment",
    description: "Evaluate your property safety features and emergency equipment",
    questions: [
      {
        id: "fa1",
        question: "Does your property have clearly marked emergency exits?",
        options: ["Yes, all exits are clearly marked and lit", "Yes, most exits are marked", "Some exits are marked", "No marked emergency exits"],
        helpText: "Emergency exits should be clearly visible with illuminated signs.",
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
    id: "emergency_preparedness",
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
    id: "communication_protocols",
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

export const CERTIFICATION_MODULE_ORDER = [
  "facility_assessment",
  "emergency_preparedness",
  "communication_protocols",
] as const

export function getCertificationModule(moduleId: string) {
  return CERTIFICATION_CURRICULUM[moduleId]
}
