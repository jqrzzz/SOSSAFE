/**
 * Local Knowledge Categories — Single Source of Truth
 *
 * Staff contribute local safety intel across these categories.
 * This data feeds into SOSA for smarter emergency triage.
 */

export type KnowledgeCategory =
  | "medical_facility"
  | "transport"
  | "hazard"
  | "emergency_contact"
  | "local_tip"

export type KnowledgeImportance = "critical" | "high" | "normal" | "low"

export interface CategoryDefinition {
  id: KnowledgeCategory
  label: string
  description: string
  /** What to ask for in the form — guides staff on what's useful */
  prompt: string
  /** SVG path data for the icon (24x24 viewBox) */
  iconPath: string
  /** Whether to show location/contact fields */
  showLocationFields: boolean
  showContactFields: boolean
  showResponseTime: boolean
  /** Example entries to inspire staff */
  examples: string[]
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "medical_facility",
    label: "Medical Facilities",
    description: "Hospitals, clinics, pharmacies, dentists nearby",
    prompt: "Share what you know about nearby medical facilities — real travel times, quality of care, English-speaking staff, specialties.",
    iconPath: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    showLocationFields: true,
    showContactFields: true,
    showResponseTime: true,
    examples: [
      "Bangkok Hospital Phuket — 25 min drive, not 10 min like Google says. English-speaking ER. Accepts international insurance.",
      "Wattana Pharmacy on Beach Rd — open until midnight, stocks common antibiotics. Staff speaks basic English.",
    ],
  },
  {
    id: "transport",
    label: "Transport & Access",
    description: "Ambulance times, road conditions, access routes",
    prompt: "Share real-world transport info — actual ambulance response times, road conditions that affect access, alternative routes.",
    iconPath: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    showLocationFields: true,
    showContactFields: true,
    showResponseTime: true,
    examples: [
      "Ambulance from Patong to Vachira Hospital is 30-40 min in high season traffic, not 15 min. Better to use hotel van.",
      "Road to Kata Noi floods during heavy rain (Oct-Nov). Alternative route via Chalong adds 20 min.",
    ],
  },
  {
    id: "hazard",
    label: "Local Hazards",
    description: "Flood zones, wildlife, unsafe areas, seasonal risks",
    prompt: "What hazards should guests and emergency responders know about? Seasonal risks, dangerous areas, wildlife, environmental issues.",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    showLocationFields: true,
    showContactFields: false,
    showResponseTime: false,
    examples: [
      "Strong riptides at north end of beach Nov-Feb. No lifeguard after 5pm. Nearest rescue: call coast guard.",
      "Jellyfish season March-May. Hotel should stock vinegar. Nearest hospital with anti-venom: 45 min.",
    ],
  },
  {
    id: "emergency_contact",
    label: "Emergency Contacts",
    description: "Local police, coast guard, fire, tourist police",
    prompt: "Share local emergency numbers and contacts that differ from national ones. Include the actual response you can expect.",
    iconPath: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    showLocationFields: false,
    showContactFields: true,
    showResponseTime: true,
    examples: [
      "Tourist Police Phuket: 1155 (English-speaking, much faster response than 191 for tourist incidents)",
      "Local volunteer rescue (Por Tek Tung): 076-246301. Faster than government ambulance in Patong area.",
    ],
  },
  {
    id: "local_tip",
    label: "Local Tips",
    description: "Cultural considerations, language help, local customs",
    prompt: "What local knowledge helps in an emergency? Language tips, cultural considerations, things that catch foreigners off guard.",
    iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    showLocationFields: false,
    showContactFields: false,
    showResponseTime: false,
    examples: [
      "Thai hospitals require passport copy + deposit before treatment. Keep color copies at front desk for guests.",
      "Most local clinics close by 8pm. After hours, only hospital ER is available — plan accordingly.",
    ],
  },
]

export const IMPORTANCE_LEVELS: { value: KnowledgeImportance; label: string; color: string }[] = [
  { value: "critical", label: "Critical", color: "text-red-500" },
  { value: "high", label: "High", color: "text-orange-500" },
  { value: "normal", label: "Normal", color: "text-foreground" },
  { value: "low", label: "Low", color: "text-muted-foreground" },
]

export function getCategoryById(id: KnowledgeCategory): CategoryDefinition {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}

export function getImportanceLabel(value: KnowledgeImportance): string {
  return IMPORTANCE_LEVELS.find((i) => i.value === value)?.label ?? "Normal"
}
