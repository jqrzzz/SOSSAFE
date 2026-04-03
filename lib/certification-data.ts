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
    description: "Advanced certification proving your staff can respond to real medical emergencies with confidence — CPR, first aid, guest triage, and safety operations.",
    validity: "1 year",
    requirements: [
      "SOS Safe Basic certification (active)",
      "Complete First Aid & CPR Fundamentals module",
      "Complete Guest Medical Emergency Response module",
      "Complete Advanced Safety Operations module",
      "Score 80% or higher on each module",
    ],
    available: true,
  },
  {
    id: "sos_safe_elite",
    name: "SOS Safe Elite",
    label: "Elite",
    description: "Highest-tier certification for safety leaders — destination risk management, crisis command, and direct integration with the Tourist SOS emergency network.",
    validity: "2 years",
    requirements: [
      "SOS Safe Premium certification (active)",
      "Complete Destination Risk Management module",
      "Complete Crisis Leadership & Coordination module",
      "Complete Tourist SOS Network Integration module",
      "Score 80% or higher on each module",
    ],
    available: true,
  },
]

// ── Tier → Module Mapping ─────────────────────────────────────────
// Which modules belong to which tier. Used to determine which modules
// to show for a given certification and to gate progression.
export const TIER_MODULES: Record<string, string[]> = {
  sos_safe_basic: [
    "facility_assessment",
    "emergency_preparedness",
    "communication_protocols",
  ],
  sos_safe_premium: [
    "first_aid_cpr",
    "guest_medical_emergency",
    "advanced_safety_operations",
  ],
  sos_safe_elite: [
    "destination_risk_management",
    "crisis_leadership",
    "sos_network_integration",
  ],
}

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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  PREMIUM TIER MODULES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: "first_aid_cpr",
    title: "First Aid & CPR Fundamentals",
    description: "Learn life-saving techniques: CPR, AED use, choking response, wound management, and when to call emergency services.",
    icon: "heart",
    questions: [
      {
        id: "fac1",
        question: "A guest collapses and is unresponsive with no normal breathing. What is the correct order of actions?",
        options: [
          "Check for danger, call EMS, start CPR (30 compressions : 2 breaths), use AED as soon as available",
          "Call EMS, place in recovery position, wait for paramedics",
          "Start rescue breaths first, then check for a pulse",
          "Move the guest to their room and call the front desk",
        ],
        helpText: "The chain of survival: early recognition → early call → early CPR → early defibrillation. Every minute without CPR reduces survival by 7–10%.",
      },
      {
        id: "fac2",
        question: "What is the correct hand placement and depth for adult chest compressions?",
        options: [
          "Heel of one hand on the centre of the chest (lower sternum), other hand on top — compress 5–6 cm deep at 100–120 per minute",
          "Both hands on the left side of the chest — compress as deep as possible",
          "One hand on the stomach area — compress gently to avoid rib fracture",
          "Fingers interlocked over the throat area — compress until breathing resumes",
        ],
        helpText: "Push hard and fast on the centre of the chest. Rib fractures during CPR are common and acceptable — they heal, cardiac arrest does not reverse itself.",
      },
      {
        id: "fac3",
        question: "An AED has arrived. The guest has a wet chest from the pool. What do you do?",
        options: [
          "Dry the chest quickly, apply pads as shown in the diagram, follow the AED voice prompts — do not delay",
          "Do not use the AED near water under any circumstances",
          "Apply the pads over wet skin — the AED will compensate automatically",
          "Wait for paramedics since water makes AEDs dangerous",
        ],
        helpText: "AEDs are safe when used correctly. Dry the chest, ensure no standing water under the patient, and follow the prompts. A wet chest can prevent proper pad adhesion.",
      },
      {
        id: "fac4",
        question: "An adult guest is choking and cannot cough, speak, or breathe. What is the correct response?",
        options: [
          "Stand behind them, give up to 5 back blows between the shoulder blades, then up to 5 abdominal thrusts (Heimlich), alternate until clear or they become unconscious",
          "Perform a finger sweep of the mouth immediately",
          "Give them water to drink to wash the obstruction down",
          "Ask them to lie down and wait for it to clear naturally",
        ],
        helpText: "The international protocol alternates back blows and abdominal thrusts. If the person becomes unconscious, lower them to the ground and begin CPR.",
      },
      {
        id: "fac5",
        question: "A guest has a deep cut on their forearm that is bleeding heavily. What is the priority?",
        options: [
          "Apply direct pressure with a clean cloth, elevate the limb above the heart, call EMS if bleeding does not stop within 10 minutes",
          "Apply a tourniquet immediately above the wound",
          "Clean the wound thoroughly with alcohol before applying pressure",
          "Let it bleed freely to flush out bacteria, then bandage loosely",
        ],
        helpText: "Direct pressure is always first. Tourniquets are a last resort for life-threatening limb haemorrhage. Cleaning comes after bleeding is controlled.",
      },
      {
        id: "fac6",
        question: "What is the recovery position and when should you use it?",
        options: [
          "An unconscious person who IS breathing — rolled onto their side with head tilted back to keep the airway open and prevent choking on vomit",
          "A conscious person with chest pain — seated upright leaning slightly forward",
          "Anyone who has fainted — flat on their back with legs raised",
          "A person having a seizure — held on their side with something in their mouth",
        ],
        helpText: "Recovery position = breathing but unconscious. It prevents tongue obstruction and aspiration. Never place someone in recovery position if they are not breathing — they need CPR.",
      },
      {
        id: "fac7",
        question: "A guest is showing signs of a severe allergic reaction (anaphylaxis): swollen face, difficulty breathing, hives. What do you do?",
        options: [
          "Call EMS immediately, help the guest use their epinephrine auto-injector if they have one, keep them sitting upright if breathing is difficult, monitor until EMS arrives",
          "Give them antihistamines and monitor for 30 minutes",
          "Have them lie flat and elevate their legs",
          "Apply a cold compress to the swelling and offer water",
        ],
        helpText: "Anaphylaxis can kill within minutes. Epinephrine is the only effective first-line treatment. Antihistamines are too slow for anaphylaxis. Always call EMS — even if epi is given, a second reaction can occur.",
      },
      {
        id: "fac8",
        question: "A guest has been pulled from the pool unconscious. After checking the scene is safe, what is your first assessment?",
        options: [
          "Check for responsiveness (tap and shout), then check for normal breathing for no more than 10 seconds — if absent, call EMS and begin CPR starting with 5 rescue breaths",
          "Check their pulse first for 60 seconds to determine if CPR is needed",
          "Begin chest compressions immediately without any assessment",
          "Attempt to drain water from lungs by turning them upside down",
        ],
        helpText: "Drowning victims may benefit from initial rescue breaths (5 breaths before compressions) since the primary problem is oxygen deprivation. The 'turn upside down' myth wastes critical time.",
      },
      {
        id: "fac9",
        question: "A guest fell from a balcony (approximately 2 metres). They are conscious but complaining of neck pain. What do you do?",
        options: [
          "Keep them completely still, stabilise the head and neck manually, call EMS, cover them to prevent shock — do NOT move them unless there is immediate danger",
          "Help them stand up slowly to check if they can walk",
          "Roll them into the recovery position for comfort",
          "Carry them inside to a bed where they can rest",
        ],
        helpText: "Any fall from height + neck/back pain = potential spinal injury. Moving the patient can cause paralysis. Manual in-line stabilisation (hold the head still) until EMS arrives.",
      },
      {
        id: "fac10",
        question: "How often should first aid and CPR skills be refreshed to maintain competence?",
        options: [
          "Every 1–2 years, with brief practical refreshers every 6 months recommended for hospitality staff",
          "Once is enough — the skills are straightforward and don't change",
          "Every 5 years is sufficient for most staff",
          "Only after an actual incident occurs, to learn from the experience",
        ],
        helpText: "Studies show CPR skills degrade within 3–6 months without practice. Annual recertification is the global standard; 6-monthly refreshers keep skills sharp.",
      },
      {
        id: "fac11",
        question: "A guest is having a seizure. What should you do?",
        options: [
          "Clear the area of hazards, protect their head with something soft, time the seizure, call EMS if it lasts over 5 minutes — do NOT restrain them or put anything in their mouth",
          "Hold them down firmly to prevent injury",
          "Place a wallet or spoon in their mouth to prevent tongue-biting",
          "Pour cold water on their face to stop the seizure",
        ],
        helpText: "You cannot swallow your own tongue. Putting objects in the mouth causes broken teeth and injury. Time the seizure — over 5 minutes (status epilepticus) is a medical emergency.",
      },
      {
        id: "fac12",
        question: "A guest has a suspected broken arm after a fall. EMS is 20 minutes away. What do you do while waiting?",
        options: [
          "Immobilise the arm in the position found using a sling or padding, apply ice wrapped in cloth, monitor for shock, do not attempt to straighten the limb",
          "Straighten the arm and splint it tightly with rigid material",
          "Have the guest move the arm to check range of motion",
          "Give them painkillers from the first aid kit and wait",
        ],
        helpText: "Splint it as you find it. Attempting to realign a fracture can damage nerves and blood vessels. Ice reduces swelling. Watch for signs of shock (pale, clammy, rapid pulse).",
      },
    ],
  },
  {
    id: "guest_medical_emergency",
    title: "Guest Medical Emergency Response",
    description: "Handle real medical scenarios: chest pain, heat stroke, allergic reactions, intoxication, diabetic emergencies, and water incidents.",
    icon: "stethoscope",
    questions: [
      {
        id: "gme1",
        question: "A 55-year-old guest complains of crushing chest pain radiating to their left arm. They are sweating and nauseous. What do you do?",
        options: [
          "Call EMS immediately, sit the guest upright (or in the position most comfortable for them), ask if they carry aspirin or GTN spray, keep them calm, prepare AED",
          "Have them lie flat and elevate their legs to restore blood flow",
          "Give them an antacid in case it is heartburn and wait 30 minutes",
          "Walk them to their room so they can rest privately",
        ],
        helpText: "These are classic heart attack symptoms. Time is muscle — every minute of delay damages heart tissue. Sitting upright reduces cardiac workload. A single 300mg aspirin (chewed) can be life-saving if not allergic.",
      },
      {
        id: "gme2",
        question: "A guest returns from a full-day tour in 38°C heat. They are confused, have hot dry skin, and a rapid pulse. What is the likely condition and response?",
        options: [
          "Heat stroke — a life-threatening emergency. Call EMS, move to shade/air-con, cool aggressively (wet sheets, ice on neck/armpits/groin), do NOT give fluids if confused",
          "Heat exhaustion — have them drink lots of cold water and rest in their room",
          "Dehydration — give them a sports drink and they should recover within an hour",
          "Sunburn — apply aloe vera and keep them out of the sun",
        ],
        helpText: "Hot dry skin + confusion = heat stroke, not exhaustion. Core temp can exceed 40°C. It has a 50% mortality rate if untreated. Aggressive cooling is the priority. Do NOT give fluids to a confused patient (aspiration risk).",
      },
      {
        id: "gme3",
        question: "A guest at the bar becomes extremely intoxicated — slurred speech, cannot stand, vomiting. What is your duty of care?",
        options: [
          "Stop serving alcohol, move to a safe quiet area, place in recovery position if consciousness drops, monitor breathing, call EMS if they become unresponsive or breathing slows",
          "Help them to their room and check on them in the morning",
          "Call the police to remove them from the property",
          "It is not our responsibility — they chose to drink",
        ],
        helpText: "Alcohol poisoning kills. A BAC over 0.30 can be fatal. Vomiting while semi-conscious = aspiration risk (choking on vomit). Never leave an intoxicated person alone and unsupervised — you have a duty of care as the venue.",
      },
      {
        id: "gme4",
        question: "A guest with known diabetes is found confused, sweating, and shaking. Their companion says they haven't eaten since breakfast. What is happening and what should you do?",
        options: [
          "Likely hypoglycaemia (low blood sugar) — if conscious and able to swallow, give them sugary food or drink immediately (juice, sugar, candy). If they lose consciousness, call EMS, place in recovery position",
          "Likely high blood sugar — restrict food and give them water only",
          "They are having a panic attack — encourage slow breathing",
          "Give them their insulin injection from their bag to help stabilise them",
        ],
        helpText: "When in doubt, give sugar. Hypoglycaemia is immediately dangerous; hyperglycaemia develops slowly. NEVER give insulin — this could kill a hypoglycaemic patient. Sugar is the treatment.",
      },
      {
        id: "gme5",
        question: "A child at the pool is rescued from the water. They are coughing and crying but breathing. What ongoing risks should you monitor for?",
        options: [
          "Secondary drowning (delayed pulmonary oedema) — symptoms can appear 1–24 hours later. Advise parents to go to hospital for monitoring even if the child seems fine now",
          "The child is coughing and breathing, so they are fine — no further action needed",
          "Keep them by the pool so lifeguards can watch them for the next hour",
          "Give them warm fluids to prevent hypothermia and send them back to swimming",
        ],
        helpText: "Secondary drowning occurs when inhaled water causes delayed swelling in the lungs. A child who seems fine can deteriorate hours later. Medical evaluation is always warranted after a submersion incident.",
      },
      {
        id: "gme6",
        question: "A guest is stung by a jellyfish while swimming. The affected area is showing red welts and they are in significant pain. What is the correct first aid?",
        options: [
          "Rinse with seawater (not fresh water), remove visible tentacles with tweezers or a card edge (not bare hands), apply vinegar if box jellyfish area, immerse in hot water (45°C) for 20+ minutes for pain",
          "Rinse with fresh water and apply ice directly to the stings",
          "Urinate on the affected area to neutralise the venom",
          "Scrub the area with sand to remove the tentacles",
        ],
        helpText: "Fresh water causes unfired nematocysts to discharge more venom. The urine myth is false. Hot water (not scalding) denatures the protein-based venom and provides significant pain relief.",
      },
      {
        id: "gme7",
        question: "A guest tells you they feel like they are having a heart attack but are actually experiencing a panic attack (rapid breathing, tingling hands, chest tightness, terror). How do you respond?",
        options: [
          "Take it seriously — you cannot diagnose. Keep them calm, help slow their breathing, but call EMS if chest pain is present or you are uncertain. Never dismiss cardiac symptoms",
          "Tell them it is just anxiety and to calm down — this happens often",
          "Give them a paper bag to breathe into until symptoms stop",
          "Administer aspirin immediately as a precaution",
        ],
        helpText: "Panic attacks and heart attacks share symptoms. Staff should NEVER diagnose — that is the role of paramedics. Treat every chest pain as potentially cardiac until proven otherwise.",
      },
      {
        id: "gme8",
        question: "A guest on a tour is bitten by a snake. You don't know if it is venomous. What do you do?",
        options: [
          "Keep the guest calm and still, immobilise the bitten limb below heart level, mark the edge of swelling with a pen and time, call EMS, try to photograph the snake. Do NOT cut, suck, or tourniquet",
          "Apply a tight tourniquet above the bite to stop venom spreading",
          "Cut the wound and attempt to suck out the venom",
          "Apply ice and give antihistamines while driving to the hospital",
        ],
        helpText: "Cutting and sucking does not work and causes infection. Tourniquets cause tissue death. Pressure immobilisation bandage (PIT) is used for some species (Australia) but not universally. Keep calm, immobilise, and get to hospital.",
      },
      {
        id: "gme9",
        question: "A guest who takes blood-thinning medication (warfarin) has a nosebleed that won't stop after 20 minutes. What should you do?",
        options: [
          "Call EMS — prolonged bleeding in a patient on anticoagulants can be serious. Keep them sitting upright, pinching the soft part of the nose, leaning slightly forward",
          "Have them tilt their head back to prevent blood from dripping",
          "Pack the nose with cotton and tell them to rest — it will stop eventually",
          "This is normal for blood-thinning medication — no action needed",
        ],
        helpText: "Anticoagulants mean bleeding can be difficult to stop and blood loss can be significant. Head back = blood flows into the throat (aspiration/nausea risk). Forward lean + pinch is correct. 20+ minutes = medical attention needed.",
      },
      {
        id: "gme10",
        question: "A guest in their 70s falls in the bathroom and cannot put weight on their hip. They are in severe pain. What should you do?",
        options: [
          "Do not attempt to move them. Call EMS, keep them warm and comfortable where they are, monitor for shock (pale skin, rapid pulse), support the injured leg with pillows without moving it",
          "Help them stand up to test if they can walk — it might just be bruised",
          "Carry them to the bed so they are more comfortable",
          "Give them strong painkillers and reassess in an hour",
        ],
        helpText: "Hip fractures in elderly guests are common and serious. Moving a fractured hip can worsen the injury and cause fat embolism. Mortality within 1 year of hip fracture is 20–30% — this needs hospital treatment urgently.",
      },
      {
        id: "gme11",
        question: "A guest travelling with a young child tells you the child accidentally swallowed cleaning product from the minibar area. The child is conscious but crying. What do you do?",
        options: [
          "Call Poison Control and EMS immediately, identify the product and read the label, do NOT induce vomiting (caustic substances burn twice), keep the child calm and monitor breathing",
          "Make the child vomit immediately to get the substance out",
          "Give them milk or water to dilute the substance, then wait and see",
          "This is not serious for small amounts — monitor and reassess tomorrow",
        ],
        helpText: "Inducing vomiting with caustic substances (bleach, drain cleaner) causes oesophageal burns on the way back up. Poison Control will advise specific treatment based on the product. Time and product ID are critical.",
      },
      {
        id: "gme12",
        question: "What is the most important thing to document after any medical emergency on your property?",
        options: [
          "Date, time, what happened, who was involved, what actions staff took, who was called, timeline of events, and any guest statements — documented as soon as possible while details are fresh",
          "Only the guest's name and room number for the incident log",
          "A brief verbal summary to the manager on duty",
          "Documentation is not necessary unless the guest files a complaint",
        ],
        helpText: "Thorough documentation protects the guest (continuity of care), protects the property (liability), and enables learning. Write it within 1 hour while memory is accurate. This is also critical for insurance claims.",
      },
    ],
  },
  {
    id: "advanced_safety_operations",
    title: "Advanced Safety Operations",
    description: "Master evacuation leadership, incident command, multi-casualty triage, post-incident reporting, and insurance/liability documentation.",
    icon: "shield",
    questions: [
      {
        id: "aso1",
        question: "During an evacuation, a guest on the 4th floor refuses to leave their room because they are collecting their passport and valuables. What do you do?",
        options: [
          "Firmly instruct them to leave immediately — explain that their life is the priority, record their room number, report to the assembly point coordinator that a guest may still be inside",
          "Help them gather their belongings so they leave faster",
          "Lock them in for their own safety until fire services arrive",
          "Skip them and continue evacuating — they made their choice",
        ],
        helpText: "Staff cannot physically force evacuation but must firmly communicate danger. Documenting their room number is critical — fire services need to know where to search. Never help gather valuables during an active emergency.",
      },
      {
        id: "aso2",
        question: "What is the Incident Command System (ICS) and why is it relevant to hospitality?",
        options: [
          "A standardised management structure for emergencies — it defines clear roles (commander, operations, logistics, communications) so that response is organised rather than chaotic, even before EMS arrives",
          "A government system only used by fire departments and police",
          "A software tool for logging incidents after they happen",
          "A legal requirement only applicable to properties with over 500 rooms",
        ],
        helpText: "ICS was developed after failures in multi-agency disaster response. Hotels can adopt a simplified version: one person commands, one manages operations, one handles communications. It prevents the 'everyone does everything' chaos.",
      },
      {
        id: "aso3",
        question: "A tour bus accident has occurred near your property. Multiple injured people are arriving at your entrance. How do you prioritise who gets help first?",
        options: [
          "Use START triage: assess each person in under 30 seconds — can they walk? Are they breathing? Check pulse. Categorise as Immediate (red), Delayed (yellow), Minor (green), or Deceased (black). Treat red first",
          "Help whoever is screaming the loudest — they are probably the most injured",
          "Treat people in the order they arrive at the entrance",
          "Wait for ambulances — staff are not trained for mass casualty events",
        ],
        helpText: "START (Simple Triage and Rapid Treatment) is used worldwide. Walking wounded = green (minor). Not breathing after airway opening = black. Breathing but rapid pulse/altered mental status = red (immediate). The quiet patients are often the sickest.",
      },
      {
        id: "aso4",
        question: "After a serious medical incident, who should be notified and in what order?",
        options: [
          "1) EMS (already called), 2) Duty manager/incident commander, 3) Guest's emergency contact (with consent), 4) Insurance/legal team, 5) Senior management — all documented with timestamps",
          "Only senior management — they will decide who else needs to know",
          "Local police first, then the guest's embassy, then management",
          "No notifications until the guest explicitly requests them",
        ],
        helpText: "The notification chain should be predefined in your ERP. Delay in notifying insurers can void coverage. Guest consent matters for personal contacts but EMS and management notification is automatic. Document every call and its time.",
      },
      {
        id: "aso5",
        question: "A guest slips by the pool and breaks their wrist. They mention they might sue the hotel. What should staff do regarding documentation?",
        options: [
          "Document everything factually: exact location, conditions (wet floor, signage present?), witness names, photos of the scene, what first aid was given, timeline — do NOT admit fault or make promises",
          "Immediately have the guest sign a waiver releasing the hotel from liability",
          "Remove any 'wet floor' signs so there is no evidence of known hazard",
          "Tell the guest this has never happened before and offer a room upgrade",
        ],
        helpText: "Factual documentation protects everyone. Admitting fault or tampering with evidence (removing signs) creates massive legal liability. Witnesses and photos captured immediately are the most valuable evidence. Let legal/insurance handle fault determination.",
      },
      {
        id: "aso6",
        question: "Your property experiences a power outage during a full-occupancy evening. Emergency generators fail to start. What is the protocol?",
        options: [
          "Activate emergency lighting (battery backup), mobilise all staff with torches, account for guests in elevators (call fire services for extraction), secure kitchens (gas), guard stairwells, communicate calmly via megaphone or door-to-door",
          "Wait for the power company to restore electricity — it usually comes back within an hour",
          "Evacuate the entire building immediately",
          "Send a WhatsApp message to all guest contacts if you have their numbers",
        ],
        helpText: "Full evacuation in darkness with panicked guests causes more injuries than the outage itself. Trapped elevator passengers are priority. Kitchen gas lines must be shut off. Staff with torches on every floor provides reassurance and prevents panic.",
      },
      {
        id: "aso7",
        question: "What information does your insurance company typically require after a guest injury incident?",
        options: [
          "Incident report (who/what/when/where/how), witness statements, photos, medical response timeline, proof of safety compliance (signage, maintenance logs, staff training records), and guest correspondence",
          "Just the guest's name and a brief description of what happened",
          "Nothing until the guest formally makes a claim",
          "Only the medical bills if the hotel paid for treatment",
        ],
        helpText: "Insurers assess both the incident AND your preparedness. Properties with documented safety training, maintenance logs, and proper signage are in a far stronger position. Report within 24 hours — late reports raise red flags.",
      },
      {
        id: "aso8",
        question: "After a serious incident, several staff members are visibly shaken and upset. What is the correct response?",
        options: [
          "Provide immediate support — debrief the team factually (not blame), acknowledge the emotional impact, offer professional counselling access, rotate affected staff off frontline duty if needed",
          "Tell them to be professional and focus on the guests who witnessed it",
          "Give them the rest of the shift off and don't bring it up again",
          "Have each staff member write an individual report immediately while it is fresh",
        ],
        helpText: "Secondary trauma in responders is real and common. A structured debrief within 24–72 hours reduces PTSD risk. 'Push through it' culture causes long-term staff burnout, poor performance, and high turnover. Care for your carers.",
      },
      {
        id: "aso9",
        question: "How should emergency drills be conducted to be most effective?",
        options: [
          "Scheduled AND unannounced drills throughout the year, with different scenarios each time, followed by documented debriefs identifying gaps, and tracked corrective actions",
          "One annual fire drill that all staff know about in advance",
          "Tabletop discussions only — practical drills disrupt guests",
          "Only after a real incident, to practice the response that failed",
        ],
        helpText: "Announced drills test procedures; unannounced drills test readiness. Vary scenarios (fire, medical, earthquake, active threat). Post-drill debriefs are where learning happens. Track improvements over time.",
      },
      {
        id: "aso10",
        question: "What is a 'hot debrief' and when should it happen?",
        options: [
          "A brief team discussion immediately after (or within hours of) an incident — covers what happened, what went well, what needs improvement. Not about blame, but about learning while details are fresh",
          "An emergency meeting called by senior management to assign responsibility for failures",
          "A formal written review conducted 30 days after the incident for legal purposes",
          "A training session where staff re-enact the emergency to practice their response",
        ],
        helpText: "Hot debriefs capture perishable information. 'What happened? What did we do well? What would we change?' — three questions, answered quickly. Formal reviews come later. Blame shuts people down; learning keeps them engaged.",
      },
      {
        id: "aso11",
        question: "A tour guide leading a hiking group radios that a participant has a leg injury 2 hours into a remote trail. They cannot walk. What coordination is needed?",
        options: [
          "Base contacts mountain rescue/EMS with GPS coordinates, keeps radio open with guide, deploys second team with first aid and stretcher if terrain allows, notifies the injured person's emergency contact, logs all timeline events",
          "Tell the guide to have the group carry the injured person back to the trailhead",
          "Send another guide to assess — it might not be serious enough for a rescue",
          "Wait for the group to return at the scheduled time and assess then",
        ],
        helpText: "Remote incidents need coordinated rescue. GPS coordinates save critical time for helicopter or ground rescue teams. Keeping the radio channel open enables real-time medical guidance. A leg injury in remote terrain can become life-threatening without evacuation.",
      },
      {
        id: "aso12",
        question: "What is the purpose of an 'After Action Review' (AAR) following a significant safety incident?",
        options: [
          "A structured review held within 1–2 weeks to analyse the full incident response, identify systemic strengths and weaknesses, update protocols, and share lessons across the organisation",
          "A legal proceeding to determine who was at fault for the incident",
          "A guest-facing report apologising for the incident and outlining compensation",
          "A one-time meeting that replaces the need for ongoing training improvements",
        ],
        helpText: "AARs are standard in military, aviation, and healthcare for good reason — they turn incidents into organisational learning. Key sections: timeline reconstruction, what worked, what didn't, specific action items with owners and deadlines.",
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  ELITE TIER MODULES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: "destination_risk_management",
    title: "Destination Risk Management",
    description: "Proactively assess regional hazards, seasonal risks, local medical infrastructure, transport safety, and cultural safety considerations.",
    icon: "map",
    questions: [
      {
        id: "drm1",
        question: "How should your property build a regional hazard profile?",
        options: [
          "Map all natural hazards (earthquakes, floods, tsunamis, storms), disease risks (dengue, malaria), infrastructure gaps (nearest hospital capability, helicopter access), and cultural risks — update seasonally",
          "Check the government travel advisory website once a year",
          "Rely on long-term staff knowledge of the area",
          "Hazard profiles are only needed for properties in developing countries",
        ],
        helpText: "A hazard profile is a living document. The nearest hospital may not have an ICU. The rainy season changes flood risk. Disease outbreaks are seasonal. This knowledge saves lives when an emergency happens at 2 AM.",
      },
      {
        id: "drm2",
        question: "Your property is in a coastal area with a history of tsunamis. What preparedness measures are essential?",
        options: [
          "Mapped evacuation routes to high ground, signage in multiple languages, staff trained on warning signs (earthquake + ocean withdrawal), guest briefing at check-in, regular drills, emergency supplies at the evacuation point",
          "A sign at reception noting the property is in a tsunami zone",
          "Reliance on the national warning system — sirens will give enough time",
          "Tsunami risk is too rare to justify specific preparedness",
        ],
        helpText: "The 2004 Indian Ocean tsunami killed 230,000 people. Many hotels had no evacuation plan. Natural warning signs (strong earthquake, ocean receding) can precede waves by 10–30 minutes. That is enough time IF you have a plan.",
      },
      {
        id: "drm3",
        question: "What should your property know about the nearest medical facilities?",
        options: [
          "Name, location, travel time by day and night, capabilities (trauma, cardiac, paediatric, ICU), accepted insurance, English-speaking staff, ambulance availability, and helicopter landing capability",
          "The phone number of the nearest hospital is sufficient",
          "Guests should research medical facilities themselves before travelling",
          "Tour operators are not responsible for medical facility knowledge",
        ],
        helpText: "A clinic 10 minutes away may not have an X-ray. The hospital 45 minutes away may be the only one with blood bank and surgery. Know the difference. Ambulance response times vary massively — in rural areas, you may need to arrange transport yourself.",
      },
      {
        id: "drm4",
        question: "A region-specific disease outbreak (e.g. dengue fever) is affecting your area. What should your property do?",
        options: [
          "Alert guests proactively at check-in with prevention advice, enhance mosquito control (fogging, nets, standing water removal), stock repellent, train staff on symptom recognition, identify treatment facilities",
          "Wait for the government to issue an official travel advisory",
          "This is a public health matter, not a hospitality concern",
          "Only inform guests if they specifically ask about health risks",
        ],
        helpText: "Tourists are more vulnerable than locals — no immunity, unfamiliar with prevention, may dismiss early symptoms. Proactive communication is a duty of care. Dengue, for example, kills 22,000 people annually.",
      },
      {
        id: "drm5",
        question: "Your tour operation runs activities in areas with limited mobile phone coverage. How do you manage this risk?",
        options: [
          "Carry satellite communicators or PLBs (Personal Locator Beacons), share itineraries with base including check-in times, carry extended first aid kits, brief guests on communication limitations before departure",
          "Mobile coverage is not our responsibility — guests are informed it is a remote area",
          "Carry a spare mobile phone battery in case the primary one dies",
          "Radio is unnecessary — most areas have coverage these days",
        ],
        helpText: "A PLB sends GPS coordinates to rescue services via satellite with one button press. Cost: $200–400. It can be the difference between a 30-minute rescue and a 12-hour search. Satellite communicators (inReach, SPOT) allow two-way messaging.",
      },
      {
        id: "drm6",
        question: "How should road transport risks be assessed for guest transfers and tours?",
        options: [
          "Vet drivers and vehicles (insurance, maintenance, safety equipment), assess route conditions seasonally, use seatbelts policy, set fatigue/speed limits for drivers, have contingency for breakdowns in remote areas",
          "Use licensed taxi services — their standards are sufficient",
          "Road safety is the driver's responsibility, not the property's",
          "Guest transfers are low-risk and don't need formal assessment",
        ],
        helpText: "Road traffic injuries are the #1 killer of tourists worldwide, ahead of drowning and disease combined. WHO reports 1.35 million road deaths annually. A property that arranges transport has a duty to vet the safety of that transport.",
      },
      {
        id: "drm7",
        question: "A guest wants to participate in a local adventure activity (e.g. scuba diving, zip-lining, motorbike rental) that your property doesn't operate. What is your responsibility?",
        options: [
          "Only recommend operators you have vetted for safety (insurance, equipment maintenance, guide qualifications, incident history). If you cannot vet them, be transparent about the limitations rather than recommending blindly",
          "Recommend whatever operator offers the best commission",
          "No responsibility — the guest makes their own choices",
          "Tell them all local operators are safe to avoid discouraging tourism",
        ],
        helpText: "If a hotel concierge recommends an uninsured dive operator and a guest dies, the hotel may share liability. 'We recommend' implies vetting. Either vet or clearly state you are providing information only, not endorsement.",
      },
      {
        id: "drm8",
        question: "How should cultural safety considerations be integrated into your safety planning?",
        options: [
          "Brief guests on local customs, laws, dress codes, and taboos that could create safety risks (e.g. disrespecting religious sites, illegal substances, LGBTQ+ safety in certain regions, photography restrictions)",
          "Culture is a personal matter — we should not tell guests how to behave",
          "A general 'respect local customs' sign at reception is sufficient",
          "Cultural considerations are only relevant for backpacker hostels",
        ],
        helpText: "Cultural ignorance creates real safety risks. Tourists have been arrested, assaulted, or deported for cultural violations. Drug penalties vary dramatically by country. LGBTQ+ safety varies by region. A 2-minute briefing can prevent a crisis.",
      },
      {
        id: "drm9",
        question: "Your property operates in an area prone to seasonal flooding. How should this be managed?",
        options: [
          "Maintain a seasonal risk calendar, pre-position flood supplies (sandbags, pumps), establish evacuation triggers (water level thresholds), communicate flood risk to guests during season, have alternate route plans",
          "Cancel bookings during flood season — it's not worth the risk",
          "Monitor weather forecasts and react if a flood warning is issued",
          "Flooding is unpredictable — there is no way to prepare effectively",
        ],
        helpText: "Seasonal flooding is predictable. Historical data tells you when and how high. Pre-positioning is cheap. A property that operates through flood season without preparation is negligent. Guest communication builds trust — surprises destroy it.",
      },
      {
        id: "drm10",
        question: "What is a 'risk register' and how should it be maintained?",
        options: [
          "A documented list of all identified risks, their likelihood and impact, existing controls, gaps, and action plans — reviewed quarterly and after any incident or significant change",
          "A list of past incidents kept in a filing cabinet for insurance purposes",
          "A mental checklist that experienced managers carry in their heads",
          "A government document that inspectors might request during an audit",
        ],
        helpText: "A risk register turns vague worry into specific, actionable items. Likelihood × Impact = Priority. Review triggers: quarterly, after incidents, after changes (new activities, construction, staff changes). A living register is your single most powerful safety tool.",
      },
      {
        id: "drm11",
        question: "How should your property prepare for a guest who arrives with a serious pre-existing medical condition (e.g. heart disease, severe allergy, dialysis requirement)?",
        options: [
          "Offer optional pre-arrival medical information sharing, identify nearest specialist facilities, brief duty staff on the condition, ensure relevant first aid supplies are accessible, have the guest's emergency contacts readily available",
          "We cannot ask guests about medical conditions — it violates their privacy",
          "Guests with serious conditions should not travel to remote destinations",
          "This only matters if the guest specifically requests medical support",
        ],
        helpText: "Voluntary pre-arrival health forms (GDPR-compliant, opt-in) enable preparation without violating privacy. Knowing that a guest in Room 302 is severely allergic to peanuts or requires dialysis twice a week can save their life.",
      },
      {
        id: "drm12",
        question: "Your competitor property recently had a serious safety incident that made international news. How should you respond?",
        options: [
          "Review your own readiness against the same scenario, conduct a relevant drill, brief staff, verify your protocols would have performed better — use it as a learning opportunity without exploiting the competitor's misfortune",
          "Use it in marketing to show you are safer than competitors",
          "It happened to them, not us — no action needed",
          "Wait for regulators to issue new requirements before making changes",
        ],
        helpText: "Industry incidents are free lessons. Aviation safety improved by studying every crash. If a competitor's fire evacuation failed, audit yours this week. If their guest drowned, check your pool safety today. Proactive properties learn from others' mistakes.",
      },
    ],
  },
  {
    id: "crisis_leadership",
    title: "Crisis Leadership & Coordination",
    description: "Lead under pressure: incident command, multi-agency coordination, media handling, family liaison, staff welfare, and legal obligations during crises.",
    icon: "command",
    questions: [
      {
        id: "cl1",
        question: "As Incident Commander during a fire evacuation, your night manager reports that two guests are unaccounted for and the fire is spreading. What is your priority?",
        options: [
          "Relay the unaccounted room numbers and last known locations to fire services immediately, ensure the assembly point headcount is being cross-referenced with the guest manifest, do NOT send staff back into the building",
          "Send staff to check the missing guests' rooms",
          "Assume they left the property and were not in their rooms",
          "Wait until the fire is extinguished to conduct a thorough search",
        ],
        helpText: "Staff re-entering a burning building die in hotel fires. Fire services have PPE, BA (breathing apparatus), and thermal imaging. Your job: accurate information to them. Their job: search and rescue. Clear role separation saves lives.",
      },
      {
        id: "cl2",
        question: "Multiple agencies are responding to an incident at your property: police, fire, ambulance, and your hotel team. Who has overall command?",
        options: [
          "The statutory emergency services take overall command. Your role shifts to supporting them — providing building plans, guest information, master keys, and staff assistance as requested",
          "The hotel General Manager always retains command of their property",
          "Whoever arrives first takes command of the entire response",
          "There is no clear command structure — everyone works independently",
        ],
        helpText: "When statutory services arrive, they assume command. This is the law in most jurisdictions. Your role is to be the best support they could ask for: building expertise, access, guest data, and staff labour. Do not compete with or obstruct emergency services.",
      },
      {
        id: "cl3",
        question: "A journalist calls your property after a guest death, asking for details. What is the correct response?",
        options: [
          "Direct all media enquiries to a single designated spokesperson (usually GM or PR). Confirm only what authorities have released publicly. Express sympathy without admitting fault. Never speculate on cause of death",
          "Give a full honest account to build trust and transparency",
          "Refuse to comment entirely — say 'no comment' to everything",
          "Deny that any incident occurred to protect the hotel's reputation",
        ],
        helpText: "One spokesperson. Consistent message. 'Our thoughts are with the family. We are cooperating fully with authorities.' Never speculate on cause. Never name the deceased before police and family consent. 'No comment' sounds evasive; a prepared statement does not.",
      },
      {
        id: "cl4",
        question: "A guest has died on your property. The family is on their way. How do you prepare?",
        options: [
          "Assign a dedicated senior staff member as family liaison, prepare a private space, coordinate with police on what can be shared, secure the guest's belongings, arrange accommodation for the family, have grief support contact information ready",
          "Let the police handle all communication with the family",
          "Have the front desk greet them and escort them to management",
          "Prepare a written incident report to hand to the family on arrival",
        ],
        helpText: "This is the hardest moment in hospitality. A designated, empathetic liaison changes the family's experience fundamentally. Privacy, dignity, and practical support (where to stay, how to navigate local systems, repatriation logistics) are what families need.",
      },
      {
        id: "cl5",
        question: "Social media posts about a safety incident at your property are going viral with inaccurate information. What is your response strategy?",
        options: [
          "Prepare a factual, brief official statement. Post it on your channels. Do not engage with or argue individual posts. Correct dangerous misinformation (e.g. false safety claims) calmly and factually. Monitor but do not escalate",
          "Respond to every post correcting the misinformation in detail",
          "Delete all negative comments and reviews about the incident",
          "Ignore social media entirely — it will blow over",
        ],
        helpText: "Social media crises follow predictable patterns: outrage peaks in 24–48 hours, then fades IF you don't fuel it. Arguing online adds fuel. Deleting comments causes backlash. One clear, factual, empathetic statement — then monitor. Let lawyers handle defamation.",
      },
      {
        id: "cl6",
        question: "During an extended crisis (e.g. natural disaster requiring multi-day shelter-in-place), how do you manage staff welfare?",
        options: [
          "Rotate shifts to prevent exhaustion, ensure staff eat and rest, provide regular honest updates, separate staff welfare from guest-facing duties, acknowledge the personal impact — some staff may have families affected too",
          "Staff must work continuously until the crisis is over — that is the job",
          "Send non-essential staff home and rely on a skeleton crew",
          "Focus entirely on guests — staff welfare can be addressed after the crisis",
        ],
        helpText: "Exhausted, hungry, worried staff make poor decisions that endanger guests. 12-hour shift maximums, enforced rest, food, and honest communication maintain performance. Staff whose own families are affected need accommodation or they will leave.",
      },
      {
        id: "cl7",
        question: "What are your legal obligations when a serious injury or death occurs on your property?",
        options: [
          "Preserve the scene for investigation, notify authorities (police, health dept as required), cooperate with official investigations, notify your insurer within required timeframes, retain all documentation and CCTV, do not destroy any evidence",
          "Clean up the scene to restore normal operations for other guests as quickly as possible",
          "Wait for a court order before providing information to anyone",
          "Legal obligations vary so much by country that no general approach applies",
        ],
        helpText: "Scene preservation is universal law. Destroying or cleaning evidence (even accidentally) can result in criminal charges. CCTV typically overwrites in 7–30 days — download and preserve immediately. Your insurer's notification deadline is often 24–48 hours.",
      },
      {
        id: "cl8",
        question: "You need to make a critical decision during an emergency but cannot reach senior management. What principle should guide you?",
        options: [
          "Act on the principle of 'preservation of life first, then property, then reputation' — document your decision and reasoning. Well-intentioned decisions made in good faith under time pressure are legally defensible",
          "Do not act until management authorises the decision",
          "Call an all-staff meeting to reach a group consensus",
          "Follow the standard operating procedure even if it doesn't fit the specific situation",
        ],
        helpText: "Life > Property > Reputation. This priority order is universal in emergency management. If spending $10,000 on emergency transport saves a life, do it. Document why you made the call. No reasonable court or insurer will punish a good-faith life-saving decision.",
      },
      {
        id: "cl9",
        question: "After a major incident, staff morale is low and some are considering leaving. What leadership approach is most effective?",
        options: [
          "Acknowledge what happened honestly, share what is being improved as a result, offer trauma counselling, recognise the staff who performed well during the incident, demonstrate that safety improvements are being implemented — not just promised",
          "Offer financial bonuses to prevent staff departures",
          "Avoid discussing the incident to help everyone move forward",
          "Replace staff who want to leave — it is natural turnover",
        ],
        helpText: "Post-incident staff retention depends on whether people feel heard, valued, and safe. 'We learned and we improved' builds loyalty. 'Let's not talk about it' builds resentment. Recognising heroes publicly shows that good performance is noticed.",
      },
      {
        id: "cl10",
        question: "A guest's embassy contacts your property requesting information about a citizen involved in an incident. What is the correct response?",
        options: [
          "Verify the identity of the caller independently (call the embassy main number), share only what the guest or their family has consented to share or what local authorities have authorised. Refer them to police for investigation details",
          "Give the embassy everything they request — they have diplomatic authority",
          "Refuse all communication — only the guest can authorise information release",
          "Refer them to your property's legal department and say nothing",
        ],
        helpText: "Embassies assist citizens abroad but do not have automatic access to private medical or incident data. Verify the caller. Share what is appropriate. Police are the primary information source for investigations. GDPR and privacy laws still apply to diplomatic requests.",
      },
      {
        id: "cl11",
        question: "Your property is developing its Crisis Management Team (CMT). Who should be on it?",
        options: [
          "GM (Incident Commander), Operations Manager, Chief Engineer, Head of Security, Head of Housekeeping, Communications/PR lead, HR representative — with clear deputies for each role and 24/7 contact list",
          "The General Manager only — they can delegate as needed during a crisis",
          "All department heads — more people means better coverage",
          "An external crisis management consultant on retainer",
        ],
        helpText: "Each CMT member has a specific crisis function: Engineering knows the building systems, Security controls access, Housekeeping knows room status, HR manages staff welfare. Deputies ensure coverage during holidays and nights. A 24/7 phone tree is essential.",
      },
      {
        id: "cl12",
        question: "What distinguishes a good crisis leader from a good day-to-day manager?",
        options: [
          "Decisive under uncertainty, clear communicator, delegates effectively, remains visibly calm, prioritises lives over procedures, accepts imperfect information, debriefs after for learning rather than blame",
          "Makes all decisions personally to maintain control and consistency",
          "Follows established procedures exactly, regardless of the specific situation",
          "Keeps all information to themselves to prevent staff panic",
        ],
        helpText: "Crisis leadership is a trainable skill. The best crisis leaders are calm (not panicked), clear (not verbose), decisive (not paralysed by imperfect data), and human (acknowledge fear, show empathy). Practice through drills builds these skills.",
      },
    ],
  },
  {
    id: "sos_network_integration",
    title: "Tourist SOS Network Integration",
    description: "Master the Tourist SOS ecosystem: real-time case reporting via WhatsApp/LINE, working with SOS Pro medical providers, insurance coordination, and data-driven safety improvement.",
    icon: "network",
    questions: [
      {
        id: "sni1",
        question: "How does a guest emergency at your property enter the Tourist SOS system?",
        options: [
          "Guest or staff contacts Tourist SOS via WhatsApp/LINE → SOS Command creates a case → your property is linked as a case party → you receive real-time updates and can provide information through the platform",
          "You email Tourist SOS headquarters and they create a case manually",
          "The guest must download the SOS Travel app before an emergency can be reported",
          "Only certified Elite properties can access the Tourist SOS case system",
        ],
        helpText: "The Tourist SOS intake system is built on WhatsApp and LINE because they are the messaging apps tourists already have. No app download required. SOS Command operates 24/7 and creates structured cases from unstructured messages.",
      },
      {
        id: "sni2",
        question: "What information should your property provide when a case is opened involving your guest?",
        options: [
          "Guest name, room number, any known medical info (allergies, conditions, medications), what first aid has been given, current status of the guest, your property's location and access instructions for EMS",
          "Only the guest's name — everything else is private information",
          "A full medical diagnosis of the guest's condition",
          "Nothing until the guest explicitly requests your involvement",
        ],
        helpText: "Speed and accuracy save lives. The coordination team needs to match your on-ground information with incoming medical providers. Knowing 'Guest in Room 415, possible cardiac event, CPR started 3 mins ago, AED applied, pool area' lets them dispatch the right resources.",
      },
      {
        id: "sni3",
        question: "SOS Pro medical providers are arriving at your property to assist an injured guest. What is your role?",
        options: [
          "Meet them at the entrance, escort to the patient quickly, provide building access, share any first aid given so far, keep corridors clear, stay available for logistics (translations, transport, family communication)",
          "Step back completely — medical providers handle everything from arrival",
          "Brief them extensively on the guest's full medical history before allowing access",
          "Have them wait at reception while you check if the guest wants to see them",
        ],
        helpText: "Your role shifts from first responder to logistics support when medical providers arrive. Fast access (meet, escort, clear the way) saves minutes. Handover: 'This is [name], we found them at [time], we did [actions], here is the AED readout.' Then support.",
      },
      {
        id: "sni4",
        question: "How does the Tourist SOS Local Knowledge system benefit your property and the wider network?",
        options: [
          "Staff contribute verified local safety intel (hospitals, pharmacies, hazards, transport) that helps Tourist SOS coordinate better and helps your staff give better safety advice — it is a shared intelligence asset that improves with every contribution",
          "It is a database we can use to look up local phone numbers",
          "It replaces the need for staff to have local area knowledge themselves",
          "It is only useful for Tourist SOS headquarters, not for individual properties",
        ],
        helpText: "Local Knowledge is your competitive advantage. A hotel whose staff knows that Hospital A has no blood bank but Hospital B (10 mins further) does — that knowledge can save a life. Contributing it makes the whole network smarter and makes YOUR property the local expert.",
      },
      {
        id: "sni5",
        question: "A guest's travel insurance company contacts you requesting incident details for a claim. What is the correct process?",
        options: [
          "Verify the insurer's identity and the guest's written consent for information release, then share your factual incident report (not opinions or diagnoses), CCTV timestamps if relevant, and your property's safety compliance documentation",
          "Share everything immediately to help the guest's claim get processed faster",
          "Refuse all contact — insurers should work through their own channels",
          "Provide a brief summary verbally and do not put anything in writing",
        ],
        helpText: "Insurance claims are the guest's lifeline for medical costs abroad. Your cooperation accelerates their claim. BUT: always verify identity, require written consent, share facts not opinions, and keep copies of everything you provide. Written records protect everyone.",
      },
      {
        id: "sni6",
        question: "How can your property use case data and incident analytics to improve safety?",
        options: [
          "Analyse patterns: which incidents recur, what times and locations are highest risk, which staff responses were most effective. Use this data to update training, modify facility design, and allocate safety resources where they are needed most",
          "Case data is confidential and should not be analysed",
          "Only look at data if an insurer or regulator requests it",
          "Analytics are for large hotel chains — individual properties don't have enough data",
        ],
        helpText: "Even a small property generates patterns. If 3 guests slip in the same corridor in 6 months, that is a facility issue. If medical emergencies peak on full-moon party nights, staffing should match. Data turns reactive safety into proactive prevention.",
      },
      {
        id: "sni7",
        question: "Your SOS Safe certification is expiring in 30 days. What should you do?",
        options: [
          "Begin the recertification process now — update any modules that have changed, ensure all staff training records are current, review and update your Local Knowledge entries, and verify your emergency contacts and protocols are still accurate",
          "Wait until it expires and then renew — there is a grace period",
          "Certification is a one-time process — once certified, it does not expire",
          "Only the property owner needs to recertify, not the full team",
        ],
        helpText: "Recertification is not just paperwork — it is an opportunity to reassess. Has your staff changed? Has the local medical infrastructure changed? Have you had incidents that revealed gaps? Recertification with a fresh eye catches drift before it becomes danger.",
      },
      {
        id: "sni8",
        question: "A Guarantee of Payment (GOP) is being arranged for your guest's emergency hospital treatment. What is your role?",
        options: [
          "Facilitate communication between the insurer, hospital, and Tourist SOS coordination team. Provide any documentation they need from your side (incident report, timeline). Your property does not need to guarantee payment but can help bridge communication gaps",
          "Your property must guarantee payment on behalf of the guest",
          "No involvement — this is entirely between the insurer and hospital",
          "Advance cash from the guest's minibar deposit to cover initial costs",
        ],
        helpText: "GOPs are how insurers authorise hospital treatment without the patient paying upfront. The process can stall due to language barriers, missing paperwork, or timezone differences. A property that helps bridge communication can be the difference between treatment and delay.",
      },
      {
        id: "sni9",
        question: "How does contributing Local Knowledge entries help SOSA (the AI assistant) serve your guests better?",
        options: [
          "SOSA uses your Local Knowledge to give contextual, location-specific safety advice — for example, recommending the nearest hospital with English-speaking staff, warning about seasonal hazards, or advising on local emergency numbers. Your data makes SOSA smarter for your destination",
          "SOSA does not use Local Knowledge — it only uses its own training data",
          "Local Knowledge is stored separately and never connected to the AI",
          "Only Tourist SOS headquarters can access AI features",
        ],
        helpText: "SOSA is grounded in YOUR data. When a guest on your dashboard asks 'Where is the nearest hospital?', SOSA can answer with your verified Local Knowledge — not generic web results. This makes your property's safety assistant uniquely valuable.",
      },
      {
        id: "sni10",
        question: "What does 'network effect' mean in the context of the Tourist SOS safety ecosystem?",
        options: [
          "Every certified property makes the entire network stronger — shared Local Knowledge, faster coordination, established protocols between properties and medical providers. A guest moving between certified properties has consistent, reliable safety coverage",
          "Properties in the network get discounts on insurance premiums",
          "It means more properties equals more revenue for Tourist SOS",
          "Network effect only applies to large technology platforms, not safety networks",
        ],
        helpText: "When Hospital A knows Tourist SOS protocol, and your property knows Tourist SOS protocol, and the insurance company knows Tourist SOS protocol — handoffs are seamless. A guest transferred from your hotel to Hospital A via SOS Pro transport moves through a coordinated system, not a series of disconnected phone calls.",
      },
      {
        id: "sni11",
        question: "Your property wants to showcase its SOS Safe Elite certification. What are you permitted and encouraged to do?",
        options: [
          "Display the SOS Safe Elite badge on your website, booking platforms, and property entrance. Include it in marketing materials. Brief travel agents and corporate partners. Most importantly — live up to it by maintaining the standards daily",
          "Use the certification logo but modify it to match your brand colours",
          "Claim Elite certification status before completing all requirements",
          "Certification is internal only — it should not be marketed to guests",
        ],
        helpText: "The SOS Safe badge is your signal to safety-conscious travellers that your property takes emergencies seriously. Corporate travel managers, insurers, and OTAs increasingly look for safety credentials. But the badge is only as valuable as the reality behind it.",
      },
      {
        id: "sni12",
        question: "What is the ultimate goal of the SOS Safe certification program?",
        options: [
          "That every tourist, everywhere, has access to coordinated emergency response through a network of trained, prepared properties and providers — turning fragmented local responses into a global safety standard",
          "To generate revenue for Tourist SOS through certification fees",
          "To create a ranking system so tourists avoid uncertified properties",
          "To replace local emergency services with a private alternative",
        ],
        helpText: "Tourist SOS exists because a tourist having a medical emergency at 2 AM in a foreign country, with no local language skills, no idea which hospital to trust, and travel insurance they do not know how to use — deserves better. Every certified property closes that gap.",
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

/** Returns module summaries for a specific tier */
export function getModuleSummariesForTier(tierId: string) {
  const moduleIds = TIER_MODULES[tierId] ?? []
  return MODULES
    .filter((m) => moduleIds.includes(m.id))
    .map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      icon: m.icon,
      questions: m.questions.length,
    }))
}

/** Returns the tier that a module belongs to */
export function getTierForModule(moduleId: string): string | null {
  for (const [tierId, moduleIds] of Object.entries(TIER_MODULES)) {
    if (moduleIds.includes(moduleId)) return tierId
  }
  return null
}

/** Returns the prerequisite tier needed before starting this tier */
export function getPrerequisiteTier(tierId: string): string | null {
  const tierOrder = ["sos_safe_basic", "sos_safe_premium", "sos_safe_elite"]
  const idx = tierOrder.indexOf(tierId)
  return idx > 0 ? tierOrder[idx - 1] : null
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
