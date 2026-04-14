/**
 * Response Protocols
 *
 * Single source of truth for the live Emergency Response Console:
 * - Nature-of-emergency choices (the first tap on the Start screen)
 * - Ordered action checklist shown during the event
 * - Talk-to-the-caller reminders (concise, operator style)
 *
 * These are intentionally short and plain-English. During a real event,
 * staff should not be reading paragraphs.
 *
 * Clinical references: AHA 2020 BLS, ERC 2021, WHO First Aid Guidelines.
 * Nothing here replaces in-person training — it is a memory aid.
 */

export type IncidentNature =
  | "cardiac_arrest"
  | "chest_pain"
  | "anaphylaxis"
  | "choking"
  | "stroke"
  | "trauma"
  | "drowning"
  | "unresponsive"
  | "other"
  | "unknown"

export interface ActionStep {
  /** Stable key written into the event log */
  kind: string
  /** Button label */
  label: string
  /** One-line hint shown under the button */
  hint?: string
  /** Marks this as the highest priority action for the selected nature */
  critical?: boolean
}

export interface Protocol {
  nature: IncidentNature
  title: string
  /** Short pre-arrival instruction to give the caller / first staff on scene */
  preArrival: string
  /** Ordered action checklist */
  steps: ActionStep[]
  /** Whether to show the CPR metronome by default */
  showMetronome: boolean
}

/** Actions every incident supports — always shown at the bottom */
export const UNIVERSAL_ACTIONS: ActionStep[] = [
  { kind: "ems_called", label: "EMS called", hint: "Note number dialled & ETA given" },
  { kind: "ems_arrived", label: "EMS on scene" },
  { kind: "family_notified", label: "Next-of-kin notified" },
  { kind: "consular_notified", label: "Consulate / embassy notified" },
  { kind: "manager_notified", label: "Duty manager notified" },
  { kind: "note", label: "Add note…", hint: "Free-text timestamped entry" },
]

export const PROTOCOLS: Record<IncidentNature, Protocol> = {
  cardiac_arrest: {
    nature: "cardiac_arrest",
    title: "Cardiac arrest / unresponsive + not breathing",
    preArrival:
      "Call EMS now. Start chest compressions — centre of chest, 5–6 cm, 100–120/min. Send someone for the AED.",
    showMetronome: true,
    steps: [
      { kind: "cpr_started", label: "CPR started", critical: true },
      { kind: "aed_fetched", label: "AED fetched" },
      { kind: "aed_attached", label: "AED pads attached" },
      { kind: "shock_delivered", label: "Shock delivered", hint: "Record each shock separately" },
      { kind: "rosc", label: "Pulse / breathing returned (ROSC)" },
      { kind: "cpr_handover", label: "Compressions handed over", hint: "Rotate every 2 min" },
    ],
  },
  chest_pain: {
    nature: "chest_pain",
    title: "Chest pain / suspected heart attack",
    preArrival:
      "Sit patient upright, loosen tight clothing. Call EMS. If conscious & not allergic, offer one adult aspirin (300 mg) to chew. Keep AED nearby.",
    showMetronome: false,
    steps: [
      { kind: "aspirin_given", label: "Aspirin given (300 mg)", critical: true, hint: "Chewed, not swallowed" },
      { kind: "gtn_given", label: "GTN / nitroglycerin given", hint: "Patient's own, if prescribed" },
      { kind: "aed_nearby", label: "AED brought to scene" },
      { kind: "oxygen_given", label: "Oxygen given" },
      { kind: "lost_consciousness", label: "Patient lost consciousness", hint: "Switch to cardiac arrest protocol" },
    ],
  },
  anaphylaxis: {
    nature: "anaphylaxis",
    title: "Anaphylaxis / severe allergic reaction",
    preArrival:
      "Give adrenaline (epinephrine) auto-injector into outer thigh immediately if available. Call EMS. Lay patient flat, legs raised. Repeat dose after 5 min if no improvement.",
    showMetronome: false,
    steps: [
      { kind: "epi_given", label: "Epinephrine given (1st dose)", critical: true, hint: "Outer mid-thigh, through clothing OK" },
      { kind: "epi_given_2", label: "Epinephrine given (2nd dose)", hint: "After 5 min if no improvement" },
      { kind: "antihistamine_given", label: "Antihistamine given" },
      { kind: "inhaler_given", label: "Inhaler given (wheeze)" },
      { kind: "position_supine", label: "Laid flat, legs raised" },
    ],
  },
  choking: {
    nature: "choking",
    title: "Choking",
    preArrival:
      "If patient cannot cough, speak or breathe: 5 back blows between shoulder blades, then 5 abdominal thrusts. Alternate until object clears or patient collapses.",
    showMetronome: false,
    steps: [
      { kind: "back_blows", label: "Back blows (5)" },
      { kind: "abdominal_thrusts", label: "Abdominal thrusts (5)" },
      { kind: "obstruction_cleared", label: "Obstruction cleared", critical: true },
      { kind: "lost_consciousness", label: "Patient lost consciousness", hint: "Start CPR, check mouth between cycles" },
    ],
  },
  stroke: {
    nature: "stroke",
    title: "Suspected stroke (FAST)",
    preArrival:
      "FAST check: Face droop, Arm weakness, Speech slurred, Time to call EMS. Note the exact time symptoms started — thrombolysis depends on it. Do NOT give food, drink or aspirin.",
    showMetronome: false,
    steps: [
      { kind: "symptom_onset_noted", label: "Time of symptom onset noted", critical: true },
      { kind: "fast_positive", label: "FAST signs confirmed" },
      { kind: "position_recovery", label: "Placed in recovery position" },
    ],
  },
  trauma: {
    nature: "trauma",
    title: "Trauma / serious injury",
    preArrival:
      "Do not move the patient unless in immediate danger. Control bleeding with direct pressure. Keep warm. Call EMS.",
    showMetronome: false,
    steps: [
      { kind: "bleeding_controlled", label: "Bleeding controlled", critical: true },
      { kind: "tourniquet_applied", label: "Tourniquet applied", hint: "Note limb & time" },
      { kind: "spine_protected", label: "Head/spine stabilised" },
      { kind: "kept_warm", label: "Patient kept warm" },
    ],
  },
  drowning: {
    nature: "drowning",
    title: "Drowning / water rescue",
    preArrival:
      "Remove from water only if safe. If not breathing: 5 rescue breaths, then standard CPR 30:2. Call EMS. Even a recovered patient needs hospital assessment.",
    showMetronome: true,
    steps: [
      { kind: "rescue_breaths", label: "5 rescue breaths", critical: true },
      { kind: "cpr_started", label: "CPR started (30:2)" },
      { kind: "water_cleared", label: "Airway cleared of water" },
      { kind: "kept_warm", label: "Patient kept warm" },
    ],
  },
  unresponsive: {
    nature: "unresponsive",
    title: "Unresponsive (breathing normally)",
    preArrival:
      "Check breathing for 10 seconds. If breathing: recovery position, monitor continuously. If not breathing or only gasping: start CPR.",
    showMetronome: false,
    steps: [
      { kind: "airway_open", label: "Airway opened" },
      { kind: "breathing_checked", label: "Breathing confirmed (10 s)", critical: true },
      { kind: "position_recovery", label: "Placed in recovery position" },
      { kind: "lost_breathing", label: "Breathing stopped — start CPR", hint: "Switch to cardiac arrest protocol" },
    ],
  },
  other: {
    nature: "other",
    title: "Other medical emergency",
    preArrival:
      "Keep patient calm and comfortable. Call EMS. Do not give food or drink. Collect meds, allergies, medical conditions to hand over.",
    showMetronome: false,
    steps: [],
  },
  unknown: {
    nature: "unknown",
    title: "Unknown — gathering information",
    preArrival:
      "Stay on the phone with whoever reported it. Send a staff member to the scene. Classify as soon as possible.",
    showMetronome: false,
    steps: [],
  },
}

export const NATURE_CHOICES: { nature: IncidentNature; label: string; blurb: string }[] = [
  { nature: "cardiac_arrest", label: "Cardiac arrest", blurb: "Unresponsive, not breathing" },
  { nature: "chest_pain", label: "Chest pain", blurb: "Suspected heart attack" },
  { nature: "anaphylaxis", label: "Anaphylaxis", blurb: "Severe allergic reaction" },
  { nature: "choking", label: "Choking", blurb: "Airway obstruction" },
  { nature: "stroke", label: "Stroke (FAST)", blurb: "Face / arm / speech" },
  { nature: "drowning", label: "Drowning", blurb: "Water rescue" },
  { nature: "trauma", label: "Trauma", blurb: "Serious injury / bleed" },
  { nature: "unresponsive", label: "Unresponsive", blurb: "Breathing normally" },
  { nature: "other", label: "Other medical", blurb: "Not listed" },
  { nature: "unknown", label: "Not sure yet", blurb: "Classify later" },
]

export function protocolFor(nature: string | null | undefined): Protocol {
  if (!nature) return PROTOCOLS.unknown
  return PROTOCOLS[nature as IncidentNature] ?? PROTOCOLS.unknown
}

export function natureLabel(nature: string | null | undefined): string {
  return protocolFor(nature).title
}
