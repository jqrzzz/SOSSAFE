/**
 * SOS Safe Certification — Module Data & Configuration
 *
 * All certification constants, tier definitions, and module questions
 * live here so they can be updated without touching UI components.
 */

// ── Constants ──────────────────────────────────────────────────────
export const PASSING_SCORE = 80 // Industry-standard threshold for safety certifications
export const MAX_POINTS_PER_QUESTION = 3 // Best answer = 3, worst = 0

// ── Tier Definitions ───────────────────────────────────────────────
export interface CertificationTier {
  id: string
  name: string
  label: string
  description: string
  validity: string
  requirements: string[]
  available: boolean
}

export const CERTIFICATION_TIERS: CertificationTier[] = [
  {
    id: "sos_safe_basic",
    name: "SOS Safe Basic",
    label: "Basic",
    description: "Entry-level certification demonstrating core emergency preparedness for your property or tour company.",
    validity: "1 year",
    requirements: [
      "Complete Facility Assessment module",
      "Complete Emergency Preparedness module",
      "Complete Communication Protocols module",
      "Score 80% or higher on each module",
    ],
    available: true,
  },
  {
    id: "sos_safe_premium",
    name: "SOS Safe Premium",
    label: "Premium",
    description: "Enhanced certification with staff training verification and emergency equipment audits.",
    validity: "1 year",
    requirements: [
      "All Basic requirements",
      "Staff first-aid training verification",
      "Emergency equipment audit",
      "Priority support access",
    ],
    available: false, // Coming soon
  },
  {
    id: "sos_safe_elite",
    name: "SOS Safe Elite",
    label: "Elite",
    description: "Highest-tier certification with on-site assessment and direct Tourist SOS network integration.",
    validity: "2 years",
    requirements: [
      "All Premium requirements",
      "On-site safety assessment",
      "Direct integration with Tourist SOS network",
      "Dedicated account manager",
    ],
    available: false, // Coming soon
  },
]

// ── Question / Module Types ────────────────────────────────────────
export interface Question {
  id: string
  question: string
  options: string[] // Index 0 = best (3 pts), Index 3 = worst (0 pts)
  helpText?: string
}

export interface ModuleDef {
  id: string
  title: string
  description: string
  icon: string
  questions: Question[]
}

// ── Module Data ────────────────────────────────────────────────────
export const MODULES: ModuleDef[] = [
  {
    id: "facility_assessment",
    title: "Facility Assessment",
    description: "Evaluate your property's safety features, emergency equipment, and guest accessibility.",
    icon: "building",
    questions: [
      {
        id: "fa1",
        question: "Are emergency exits clearly marked and illuminated throughout your property?",
        options: [
          "Yes — all exits have illuminated signage, tested monthly",
          "Yes — most exits are marked with standard signage",
          "Some exits are marked but signage is inconsistent",
          "No marked or illuminated emergency exits",
        ],
        helpText: "International fire codes require illuminated exit signs visible from 30m. Battery-backed lighting must activate during power failures.",
      },
      {
        id: "fa2",
        question: "What first-aid provisions are available on the premises?",
        options: [
          "Multiple stocked kits in public areas, kitchens, and activity zones — inventoried quarterly",
          "One well-stocked kit at a central, accessible location",
          "A kit exists but supplies are incomplete or expired",
          "No first-aid kit available on-site",
        ],
        helpText: "WHO recommends one kit per 50 guests/staff, checked every 3 months. Kits near pools and kitchens are critical for hospitality.",
      },
      {
        id: "fa3",
        question: "Are fire extinguishers present, correctly rated, and regularly inspected?",
        options: [
          "Yes — inspected within the last 6 months, staff trained on use",
          "Yes — inspected within the last 12 months",
          "Present but not recently inspected or staff untrained",
          "No fire extinguishers on the property",
        ],
        helpText: "NFPA standards require annual inspection. Kitchen areas need Class K extinguishers; general areas need ABC-rated units.",
      },
      {
        id: "fa4",
        question: "Does your property have an AED (Automated External Defibrillator)?",
        options: [
          "Yes — AED on-site with at least 2 staff trained in its use per shift",
          "Yes — AED on-site but staff need refresher training",
          "AED procurement is planned within 6 months",
          "No AED available on the property",
        ],
        helpText: "AEDs can increase cardiac arrest survival rates from 10% to over 70%. Most tourism-safety regulators recommend them for properties over 50 rooms.",
      },
      {
        id: "fa5",
        question: "Are local emergency contact numbers posted in guest-visible locations?",
        options: [
          "Yes — in every guest room, at reception, and in common areas (multilingual)",
          "Yes — in common areas and at reception",
          "Only at the front desk or on request",
          "Emergency numbers are not posted",
        ],
      },
      {
        id: "fa6",
        question: "How accessible is your property for guests with mobility limitations?",
        options: [
          "Fully accessible — ramps, lifts, accessible rooms, and evacuation chairs available",
          "Partially accessible — ground-floor access and some adapted rooms",
          "Limited — main entrance accessible but upper floors are not",
          "Not accessible for guests with mobility limitations",
        ],
        helpText: "Accessibility directly affects evacuation safety. Guests who cannot self-evacuate need pre-planned assistance.",
      },
      {
        id: "fa7",
        question: "What smoke/fire detection systems are installed?",
        options: [
          "Smoke detectors in all rooms and common areas, connected to a central alarm, tested regularly",
          "Smoke detectors in all rooms with standalone alarms",
          "Detectors in common areas or corridors only",
          "No smoke detection system installed",
        ],
      },
      {
        id: "fa8",
        question: "Is there emergency lighting along all evacuation routes?",
        options: [
          "Yes — battery-backed emergency lighting tested monthly on all exit routes",
          "Yes — standard emergency lighting on main routes",
          "Partial coverage in some corridors",
          "No dedicated emergency lighting",
        ],
      },
      {
        id: "fa9",
        question: "Does your property have a swimming pool, beach, or water features?",
        options: [
          "Yes — lifeguard or trained watcher on duty, rescue equipment in place, depth markers visible",
          "Yes — rescue equipment in place and safety signage displayed",
          "Yes — but no dedicated safety measures for water areas",
          "No water features on the property",
        ],
        helpText: "Drowning is a leading cause of tourist fatalities. WHO guidelines recommend rescue equipment within 4m of any pool edge.",
      },
      {
        id: "fa10",
        question: "Is there a secure area for storing guest medications that require refrigeration (e.g. insulin)?",
        options: [
          "Yes — dedicated refrigerated storage with controlled access, available 24/7",
          "Yes — staff can store medications in a staff-area refrigerator on request",
          "No dedicated storage but front desk can assist informally",
          "No provision for guest medication storage",
        ],
      },
    ],
  },
  {
    id: "emergency_preparedness",
    title: "Emergency Preparedness",
    description: "Assess your team's readiness, emergency protocols, and response procedures.",
    icon: "alert",
    questions: [
      {
        id: "ep1",
        question: "How often does your staff receive emergency-response training?",
        options: [
          "Quarterly sessions with practical drills and refresher courses",
          "Annual formal training with documented attendance",
          "Informal on-the-job guidance only",
          "No structured emergency training provided",
        ],
      },
      {
        id: "ep2",
        question: "Is there a designated emergency coordinator on every shift?",
        options: [
          "Yes — a trained coordinator is assigned on every shift, with clear handover procedures",
          "Yes — but coverage gaps exist on night or low-occupancy shifts",
          "Informal arrangement — senior staff are expected to lead",
          "No designated emergency coordinator",
        ],
        helpText: "A single point of accountability per shift dramatically reduces response confusion in a crisis.",
      },
      {
        id: "ep3",
        question: "Do you maintain a written Emergency Response Plan (ERP)?",
        options: [
          "Yes — comprehensive, reviewed and updated at least annually, accessible to all staff",
          "Yes — a plan exists but hasn't been reviewed in over a year",
          "A basic outline exists but is incomplete",
          "No written emergency plan",
        ],
      },
      {
        id: "ep4",
        question: "How frequently do you conduct emergency drills (fire, evacuation, medical)?",
        options: [
          "Quarterly or more often, with documented outcomes and improvement actions",
          "Twice per year",
          "Once per year",
          "Drills have never been conducted",
        ],
      },
      {
        id: "ep5",
        question: "What proportion of your staff hold current first-aid / CPR certification?",
        options: [
          "Majority of guest-facing staff are certified (refreshed within 2 years)",
          "Several staff members certified across different shifts",
          "One certified person on the team",
          "No staff hold current first-aid certification",
        ],
      },
      {
        id: "ep6",
        question: "Do you have procedures for natural disasters and regional hazards (earthquakes, hurricanes, tsunamis, flooding)?",
        options: [
          "Yes — hazard-specific procedures for all regional risks, with guest communication plan",
          "Yes — for the most likely hazards in our area",
          "General awareness only, no documented procedures",
          "No specific procedures for natural disasters",
        ],
        helpText: "Procedures should be region-specific. A beach resort in the Caribbean needs hurricane and tsunami plans; a mountain lodge needs earthquake and landslide protocols.",
      },
      {
        id: "ep7",
        question: "Can you account for all guests during an emergency evacuation?",
        options: [
          "Yes — real-time guest manifest system with designated assembly points",
          "Yes — manual register cross-referenced at assembly points",
          "Informal headcount at reception or exit",
          "No system to account for guests during emergencies",
        ],
      },
      {
        id: "ep8",
        question: "Do you have backup power for essential safety systems?",
        options: [
          "Generator covers full property with automatic failover, tested monthly",
          "Generator covers essential systems (lighting, elevators, communications)",
          "Battery or UPS backup for emergency lighting only",
          "No backup power source",
        ],
      },
      {
        id: "ep9",
        question: "Are emergency supplies stocked for extended incidents (water, blankets, basic food)?",
        options: [
          "Yes — 72-hour supply for full occupancy, inventoried quarterly",
          "Yes — basic supplies for 24 hours",
          "Minimal supplies, not formally managed",
          "No emergency supplies stocked",
        ],
        helpText: "72-hour readiness is the international standard for disaster preparedness in the hospitality sector.",
      },
      {
        id: "ep10",
        question: "Do you have established relationships with local emergency services?",
        options: [
          "Yes — direct contacts, mutual-aid agreements, and joint drills with local EMS/fire",
          "Yes — direct phone numbers and familiarity with dispatch",
          "General awareness of how to call emergency services",
          "No established relationship with local responders",
        ],
      },
      {
        id: "ep11",
        question: "How do you handle a guest reporting symptoms of a potentially serious illness (chest pain, difficulty breathing, allergic reaction)?",
        options: [
          "Documented triage protocol: stabilise, call EMS, assign staff escort, notify management, record incident",
          "Staff call emergency services and stay with the guest until help arrives",
          "Staff direct the guest to call emergency services themselves",
          "No defined procedure for medical emergencies",
        ],
        helpText: "The first 5 minutes of a cardiac or anaphylactic event are critical. A clear protocol removes hesitation.",
      },
      {
        id: "ep12",
        question: "Do you maintain an incident log for all safety and medical events?",
        options: [
          "Yes — digital log with date, time, details, actions taken, and follow-up — reviewed monthly",
          "Yes — written log maintained at reception",
          "Incidents are reported verbally to management",
          "No formal incident logging",
        ],
      },
    ],
  },
  {
    id: "communication_protocols",
    title: "Communication Protocols",
    description: "Review your guest communication, emergency contacts, and coordination systems.",
    icon: "message",
    questions: [
      {
        id: "cp1",
        question: "Do you provide safety and emergency information to guests at check-in?",
        options: [
          "Yes — verbal briefing plus written/in-room guide covering exits, contacts, and local hazards",
          "Yes — written information card or in-room folder",
          "Only if a guest specifically asks",
          "No safety information provided at check-in",
        ],
      },
      {
        id: "cp2",
        question: "Is emergency information available in languages your guests commonly speak?",
        options: [
          "Yes — 3 or more languages including the local language and top guest nationalities",
          "Yes — 2 languages (e.g. local + English)",
          "English only",
          "Local language only",
        ],
        helpText: "Tourist properties should cover at minimum: English, the local language, and the top 1-2 guest nationalities (e.g. Mandarin, German, Spanish).",
      },
      {
        id: "cp3",
        question: "Can you broadcast an urgent message to all guests quickly?",
        options: [
          "Yes — PA system, in-room alerts, and mobile/SMS notification system",
          "Yes — PA system or in-room phone broadcast",
          "Staff go door-to-door or shout from corridors",
          "No method for mass guest communication",
        ],
      },
      {
        id: "cp4",
        question: "Can guests reach a staff member 24/7 in an emergency?",
        options: [
          "Yes — multiple channels: front desk, room phone, WhatsApp/mobile, and emergency button",
          "Yes — front desk staffed and phone available 24/7",
          "Limited — reduced staffing overnight, response may be delayed",
          "No 24/7 guest-to-staff communication channel",
        ],
      },
      {
        id: "cp5",
        question: "Do you collect relevant medical information from guests (allergies, conditions, emergency contacts)?",
        options: [
          "Yes — optional health form at check-in, stored securely, accessible to duty manager",
          "Yes — we ask and record if a guest volunteers the information",
          "No formal collection, but staff note anything mentioned",
          "We do not collect or record medical information",
        ],
        helpText: "Collection must be voluntary and GDPR/privacy-compliant. Even a simple opt-in form can save critical minutes during an emergency.",
      },
      {
        id: "cp6",
        question: "Is there a protocol for contacting a guest's emergency contacts or next of kin?",
        options: [
          "Yes — documented protocol with consent-based contact info collected at check-in",
          "Informal process — senior staff decide case by case",
          "Only in life-threatening situations, handled ad hoc",
          "No protocol for contacting guest emergency contacts",
        ],
      },
      {
        id: "cp7",
        question: "How do you communicate with non-English-speaking guests during an emergency?",
        options: [
          "Multilingual staff on every shift plus access to a translation service or app",
          "Some multilingual staff; visual/pictogram emergency guides available",
          "Rely on other guests or online translation tools",
          "No provisions for language barriers during emergencies",
        ],
        helpText: "Language barriers are one of the leading causes of delayed emergency response for international tourists.",
      },
      {
        id: "cp8",
        question: "Do you have a post-incident communication process for affected guests?",
        options: [
          "Yes — follow-up contact within 24 hours, incident report shared if requested, support resources provided",
          "Yes — staff check in with the guest before checkout",
          "Only if the guest raises concerns after the incident",
          "No post-incident follow-up process",
        ],
      },
    ],
  },
]

// ── Helpers ─────────────────────────────────────────────────────────

/** Returns the module summary used by the overview page (without full question data) */
export function getModuleSummaries() {
  return MODULES.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    icon: m.icon,
    questions: m.questions.length,
  }))
}

/** Calculate percentage score from an answers map */
export function calculateModuleScore(
  moduleId: string,
  answers: Record<string, number>,
): number {
  const mod = MODULES.find((m) => m.id === moduleId)
  if (!mod) return 0

  const maxScore = mod.questions.length * MAX_POINTS_PER_QUESTION
  let totalScore = 0

  Object.values(answers).forEach((answerIndex) => {
    totalScore += Math.max(0, MAX_POINTS_PER_QUESTION - answerIndex)
  })

  return Math.round((totalScore / maxScore) * 100)
}

/** Did the user pass? */
export function didPass(score: number): boolean {
  return score >= PASSING_SCORE
}
