/**
 * Facility Assessment Interview — Question Bank
 *
 * SOSA uses these questions to interview property owners/managers about
 * their specific facility, equipment, capabilities, and protocols.
 * Answers are stored and used to generate custom Policies & Procedures.
 *
 * This is NOT the certification quiz — this is a conversational data
 * collection tool that builds a facility profile over time.
 */

export interface AssessmentQuestion {
  id: string
  category: AssessmentCategory
  question: string
  /** Follow-up context SOSA can use to probe deeper */
  followUps: string[]
  /** What a good answer includes */
  lookFor: string[]
  /** Used to generate the P&P document section */
  policySection: string
}

export type AssessmentCategory =
  | "equipment"
  | "medical_capability"
  | "evacuation"
  | "staffing"
  | "guest_protocols"
  | "external_coordination"

export interface CategoryMeta {
  id: AssessmentCategory
  label: string
  description: string
  icon: string
}

export const ASSESSMENT_CATEGORIES: CategoryMeta[] = [
  {
    id: "equipment",
    label: "Emergency Equipment",
    description: "AEDs, first aid kits, stretchers, epi-pens, oxygen, fire equipment",
    icon: "briefcase",
  },
  {
    id: "medical_capability",
    label: "Medical Capability",
    description: "Staff certifications, CPR-trained personnel, medical supplies",
    icon: "heart",
  },
  {
    id: "evacuation",
    label: "Evacuation & Access",
    description: "Evacuation chairs, routes, assembly points, mobility assistance",
    icon: "arrow-up-right",
  },
  {
    id: "staffing",
    label: "Safety Staffing",
    description: "Emergency coordinators, shift coverage, training schedules",
    icon: "users",
  },
  {
    id: "guest_protocols",
    label: "Guest Protocols",
    description: "Check-in briefings, medical info collection, room safety cards",
    icon: "clipboard",
  },
  {
    id: "external_coordination",
    label: "External Coordination",
    description: "Hospital contacts, ambulance agreements, police liaison",
    icon: "phone",
  },
]

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ── Equipment ───────────────────────────────────────────────────
  {
    id: "eq1",
    category: "equipment",
    question: "How many AEDs (Automated External Defibrillators) do you have on the property, and where are they located?",
    followUps: [
      "When were the pads last replaced?",
      "Are they checked monthly?",
      "Can guests access them or only staff?",
    ],
    lookFor: ["count", "locations", "pad expiry dates", "accessibility"],
    policySection: "AED Deployment & Maintenance",
  },
  {
    id: "eq2",
    category: "equipment",
    question: "Do you stock epinephrine auto-injectors (EpiPens) for allergic reactions? If so, how many and where?",
    followUps: [
      "Are they prescription-only in your country or can the property stock them?",
      "Which staff are trained to administer them?",
      "What is your protocol if a guest has anaphylaxis and you don't have one?",
    ],
    lookFor: ["count", "storage location", "expiry tracking", "administration policy"],
    policySection: "Anaphylaxis Response",
  },
  {
    id: "eq3",
    category: "equipment",
    question: "Describe your first aid kit setup — how many kits, where are they, and how often are they checked?",
    followUps: [
      "Who is responsible for restocking?",
      "Do you have kits near the pool, kitchen, and activity areas specifically?",
      "Do they include burn dressings, splints, and eye wash?",
    ],
    lookFor: ["count", "locations", "inventory schedule", "specialized contents"],
    policySection: "First Aid Equipment",
  },
  {
    id: "eq4",
    category: "equipment",
    question: "Do you have equipment for moving an immobile guest — stretcher, evacuation chair, or wheelchair?",
    followUps: [
      "Can a single staff member operate the evacuation chair?",
      "Where is it stored relative to upper floors?",
      "What do you do if a guest cannot walk and the elevator is out during a fire?",
    ],
    lookFor: ["equipment type", "location", "staff training on use"],
    policySection: "Patient Movement & Evacuation Equipment",
  },
  {
    id: "eq5",
    category: "equipment",
    question: "Do you have supplemental oxygen available on the property?",
    followUps: [
      "What type — portable cylinder or concentrator?",
      "Who is trained to administer it?",
      "Is it available 24/7 or only when certain staff are on duty?",
    ],
    lookFor: ["type", "location", "trained operators", "availability hours"],
    policySection: "Supplemental Oxygen",
  },

  // ── Medical Capability ──────────────────────────────────────────
  {
    id: "mc1",
    category: "medical_capability",
    question: "How many staff on each shift are currently CPR-certified? When were they last trained?",
    followUps: [
      "Is there always at least one CPR-certified person on the overnight shift?",
      "Do you track certification expiry dates?",
      "Who provides the training — external provider or in-house?",
    ],
    lookFor: ["count per shift", "overnight coverage", "expiry tracking", "training provider"],
    policySection: "CPR Certification & Coverage",
  },
  {
    id: "mc2",
    category: "medical_capability",
    question: "Do any staff members have advanced first aid, paramedic, or nursing qualifications?",
    followUps: [
      "Are they scheduled to ensure coverage, or is it coincidental?",
      "Do they have a specific role during medical emergencies?",
    ],
    lookFor: ["qualifications", "scheduled coverage", "designated role"],
    policySection: "Advanced Medical Personnel",
  },
  {
    id: "mc3",
    category: "medical_capability",
    question: "What medications can your property legally store and administer? Do you keep a stock of common over-the-counter medications for guests?",
    followUps: [
      "Aspirin for suspected cardiac events?",
      "Antihistamines for allergic reactions?",
      "Paracetamol/ibuprofen?",
      "Who authorises dispensing?",
    ],
    lookFor: ["medication list", "storage conditions", "dispensing policy", "legal constraints"],
    policySection: "Medication Storage & Dispensing",
  },

  // ── Evacuation & Access ─────────────────────────────────────────
  {
    id: "ev1",
    category: "evacuation",
    question: "Walk me through your fire evacuation procedure — from alarm trigger to all-clear. Who does what?",
    followUps: [
      "Who checks rooms to ensure they are empty?",
      "How do you handle guests with mobility limitations?",
      "Where is the assembly point and who manages the headcount?",
      "How do you account for guests who may be off-property?",
    ],
    lookFor: ["role assignments", "room clearance procedure", "assembly point", "headcount method", "mobility plan"],
    policySection: "Fire Evacuation Procedure",
  },
  {
    id: "ev2",
    category: "evacuation",
    question: "If a guest has a medical emergency in their room on an upper floor, how does your team get them out and to an ambulance?",
    followUps: [
      "Do you have a stretcher that fits in the elevator?",
      "What if the elevator is out?",
      "Who meets the ambulance and directs them?",
    ],
    lookFor: ["room-to-ambulance route", "equipment used", "elevator backup plan", "ambulance liaison"],
    policySection: "Medical Emergency Room Extraction",
  },
  {
    id: "ev3",
    category: "evacuation",
    question: "Do you have guests with disabilities or mobility limitations currently or regularly? How do you identify and plan for them?",
    followUps: [
      "Do you ask at check-in about mobility needs?",
      "Are accessible rooms near exits?",
      "Do you assign a specific staff member to assist them during evacuation?",
    ],
    lookFor: ["identification method", "room assignment strategy", "personal evacuation plan"],
    policySection: "Accessible Evacuation Planning",
  },

  // ── Staffing ────────────────────────────────────────────────────
  {
    id: "st1",
    category: "staffing",
    question: "Is there a designated Emergency Coordinator on every shift? What is their specific role?",
    followUps: [
      "What happens during shift handover — how is safety status communicated?",
      "Do they have a distinct identifier (vest, badge)?",
      "What authority do they have to make decisions (spend money, call EMS, evacuate)?",
    ],
    lookFor: ["named role", "shift coverage", "handover procedure", "decision authority"],
    policySection: "Emergency Coordinator Role",
  },
  {
    id: "st2",
    category: "staffing",
    question: "How often do you run emergency drills? What scenarios do you practice?",
    followUps: [
      "Do you run unannounced drills?",
      "Do you debrief after each drill and track improvements?",
      "Do guests participate or are drills staff-only?",
    ],
    lookFor: ["frequency", "scenario types", "debrief process", "improvement tracking"],
    policySection: "Emergency Drill Schedule",
  },
  {
    id: "st3",
    category: "staffing",
    question: "What is your overnight staffing level? Can your overnight team handle a medical emergency without calling in additional staff?",
    followUps: [
      "Is there a CPR-certified person on every overnight shift?",
      "How long would it take to get a manager on-site overnight?",
      "What is the minimum staffing that still allows effective emergency response?",
    ],
    lookFor: ["overnight headcount", "CPR coverage", "manager call-in time", "minimum safe staffing"],
    policySection: "Overnight Emergency Staffing",
  },

  // ── Guest Protocols ─────────────────────────────────────────────
  {
    id: "gp1",
    category: "guest_protocols",
    question: "What safety information do guests receive at check-in? How is it delivered?",
    followUps: [
      "Is it verbal, written, digital, or all three?",
      "Is it available in the languages your top guest nationalities speak?",
      "Do guests actually read/engage with it, or is it routinely ignored?",
    ],
    lookFor: ["format", "languages", "content coverage", "engagement level"],
    policySection: "Guest Safety Briefing at Check-in",
  },
  {
    id: "gp2",
    category: "guest_protocols",
    question: "Do you collect any medical information from guests — allergies, conditions, medications, emergency contacts?",
    followUps: [
      "Is it opt-in and GDPR-compliant?",
      "Where is it stored? Who can access it during an emergency?",
      "How quickly can a duty manager access a specific guest's medical info at 3 AM?",
    ],
    lookFor: ["opt-in process", "data storage", "access speed", "privacy compliance"],
    policySection: "Guest Medical Information Collection",
  },
  {
    id: "gp3",
    category: "guest_protocols",
    question: "If a guest dies on your property, what is your protocol? Walk me through the steps.",
    followUps: [
      "Who is trained for this scenario?",
      "Do you have a private space for family members?",
      "How do you handle other guests in the vicinity?",
      "Who contacts the embassy if the guest is a foreign national?",
    ],
    lookFor: ["notification chain", "scene management", "family support", "legal steps", "other guest management"],
    policySection: "Guest Death Protocol",
  },

  // ── External Coordination ───────────────────────────────────────
  {
    id: "ec1",
    category: "external_coordination",
    question: "Which hospital would you send a guest to for a cardiac emergency right now? How long does it take to get there?",
    followUps: [
      "Does it have a cardiac catheterisation lab (for stent procedures)?",
      "What about for a child emergency — same hospital or different?",
      "Do you have a direct contact number for the ER, not just the main line?",
    ],
    lookFor: ["hospital name", "travel time by time of day", "capabilities", "direct contacts"],
    policySection: "Primary Hospital Coordination",
  },
  {
    id: "ec2",
    category: "external_coordination",
    question: "What is the actual ambulance response time to your property? Have you timed it?",
    followUps: [
      "Does it change significantly during high season or rush hour?",
      "Do you have a backup plan if the ambulance is delayed (own transport, private ambulance)?",
      "Is there a specific entrance for ambulances that is always accessible?",
    ],
    lookFor: ["measured response time", "seasonal variation", "backup transport", "ambulance access route"],
    policySection: "Ambulance Response & Access",
  },
  {
    id: "ec3",
    category: "external_coordination",
    question: "Do you have a relationship with local police and fire services? Have they visited your property?",
    followUps: [
      "Do they have your building plans on file?",
      "Have you done a joint drill?",
      "Do you have a direct contact (not just emergency number)?",
    ],
    lookFor: ["relationship level", "building plans shared", "joint drills", "direct contacts"],
    policySection: "Emergency Services Liaison",
  },
]

/** Get questions for a specific category */
export function getQuestionsByCategory(category: AssessmentCategory): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter((q) => q.category === category)
}

/** Get all unique policy sections for document generation */
export function getAllPolicySections(): string[] {
  return [...new Set(ASSESSMENT_QUESTIONS.map((q) => q.policySection))]
}
