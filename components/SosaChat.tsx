"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Send, Loader2, ArrowRight } from "lucide-react"

const MAX_MESSAGES = 20

/* ------------------------------------------------------------------ */
/*  Inline markdown: bold + links                                      */
/* ------------------------------------------------------------------ */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)
  return (
    <>
      {parts.map((part, i) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (linkMatch) {
          return (
            <Link
              key={i}
              href={linkMatch[2]}
              className="inline-flex items-center gap-0.5 text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors font-medium"
            >
              {linkMatch[1]}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )
        }
        const boldParts = part.split(/(\*\*[^*]+\*\*)/)
        return boldParts.map((bp, j) => {
          const boldMatch = bp.match(/^\*\*([^*]+)\*\*$/)
          if (boldMatch) {
            return (
              <strong key={`${i}-${j}`} className="font-semibold text-foreground">
                {boldMatch[1]}
              </strong>
            )
          }
          return <span key={`${i}-${j}`}>{bp}</span>
        })
      })}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Message type                                                       */
/* ------------------------------------------------------------------ */
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

/* ------------------------------------------------------------------ */
/*  Message bubble — matches SOSWEBSITE contact-sosa.tsx style          */
/* ------------------------------------------------------------------ */
function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const text = message.content

  if (isUser && text.includes("[SOS BUTTON PRESSED]")) return null
  if (!text) return null

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary/10 text-foreground rounded-br-sm"
            : "text-foreground"
        }`}
      >
        {text.split("\n").map((line, i) => {
          if (!line.trim()) return <br key={i} />
          const bulletMatch = line.match(/^[-*]\s+(.+)/)
          if (bulletMatch) {
            return (
              <div key={i} className="flex gap-2 mt-1 first:mt-0">
                <span className="text-primary mt-0.5 flex-shrink-0 text-xs">{"-->"}</span>
                <span><RichText text={bulletMatch[1]} /></span>
              </div>
            )
          }
          return (
            <p key={i} className={i > 0 ? "mt-1.5" : ""}>
              <RichText text={line} />
            </p>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Quick action chips                                                 */
/* ------------------------------------------------------------------ */
const CHIPS = [
  { label: "Hotel / Resort", text: "I manage a hotel or resort." },
  { label: "Tour Operator", text: "I run a tour operation." },
  { label: "What is SOS Safe?", text: "What is SOS Safe certification?" },
  { label: "How long does it take?", text: "How long does certification take?" },
  { label: "What does it cost?", text: "How much does certification cost?" },
  { label: "What's on the exam?", text: "What topics are covered in the modules?" },
]

/* ------------------------------------------------------------------ */
/*  Simulated responses (until Vercel AI is connected)                 */
/*  Aligned with lib/sosa-prompts.ts knowledge base & curriculum       */
/* ------------------------------------------------------------------ */
const R: Record<string, string> = {
  hotel: `Great to meet you! Hotels and resorts are exactly who we built **SOS Safe** for.

Here is how certification helps your property:
- Display the **SOS Safe badge** so guests know you are prepared
- Get direct access to our emergency coordination network
- Staff training on handling guest medical situations
- Connect guests instantly to vetted local medical providers
- Reduced liability through documented safety protocols

The process takes about 2-3 hours total (at your own pace), and most properties complete certification within 1-2 weeks.

Ready to start? [Create your account](/auth/sign-up) and I will guide you through each step.`,

  tour: `Absolutely! Tour operators are essential partners in our safety network, especially for adventure and outdoor activities.

**SOS Safe certification** for tour operators covers:
- Emergency protocols training for your guides
- Communication procedures when incidents happen in the field
- Access to our medical coordination network
- The SOS Safe badge for your marketing materials

Your guides will know exactly what to do if a guest has a medical issue during a tour — whether it is a remote hike or a city excursion.

[Start your certification](/auth/sign-up) — it takes about 2-3 hours to complete.`,

  what: `**SOS Safe** is a certification program by Tourist SOS that recognizes hotels, resorts, and tour operators who are prepared to handle guest medical emergencies.

When you are certified:
- Guests see a recognized **safety badge** on your listing
- You have verified, documented emergency response protocols
- Your staff knows how to handle medical situations confidently
- You get priority access to the Tourist SOS coordination network
- You can connect guests directly to vetted local medical providers

Certification involves three training modules — facility assessment, emergency preparedness, and communication protocols — each with a minimum **80% passing score**.

Would you like to [get started](/auth/sign-up)?`,

  time: `Most partners complete certification within **1-2 weeks**. Here is the breakdown:

- **Training modules**: About 2-3 hours total (3 modules, do them at your own pace)
- **Passing score**: 80% per module — you can retake as many times as needed
- **Our review**: 2-3 business days after all modules are passed
- **Certificate issued**: Same day after approval

You do not need to do everything in one sitting. Many partners complete one module per day between other tasks.

Ready to begin? [Create your account](/auth/sign-up) and start whenever you are ready.`,

  cost: `We have different certification tiers designed to fit different needs:

- **SOS Safe Basic** — Available now. You can start the certification process for free to see if it is right for you. Pricing details are available in your dashboard after creating an account.
- **SOS Safe Premium** — Coming soon. Includes staff training verification and priority support.
- **SOS Safe Elite** — Coming soon. Includes on-site assessment and dedicated account manager.

The best way to see what works for you is to [create a free account](/auth/sign-up) and explore the dashboard. No commitment required.`,

  modules: `The certification covers **three modules** with a total of 30 questions:

**1. Facility Assessment** (10 questions)
Covers emergency exits, first aid provisions, fire safety, AED availability, accessibility, smoke detection, emergency lighting, water safety, and medication storage.

**2. Emergency Preparedness** (12 questions)
Covers staff training, emergency coordinators, written response plans, drill frequency, first-aid certifications, natural disaster procedures, guest accounting, backup power, emergency supplies, local EMS relationships, medical incident protocols, and incident logging.

**3. Communication Protocols** (8 questions)
Covers check-in safety briefings, multilingual emergency info, mass notification systems, 24/7 guest contact, medical info collection, emergency contact protocols, language barrier solutions, and post-incident follow-up.

You need **80% or higher** on each module to pass. You can retake any module as many times as needed.

Want to [start now](/auth/sign-up)?`,

  benefits: `Here is why partners choose **SOS Safe certification**:

- **Guest trust**: The SOS Safe badge tells travelers you take their safety seriously — a real competitive differentiator
- **Emergency support**: When a guest has a medical issue, you are not on your own. Access our coordination network to connect with vetted local providers
- **Reduced liability**: Documented safety training and protocols demonstrate due diligence
- **AI triage**: Our SOSA assistant can help assess situations before escalating
- **Staff confidence**: Your team knows exactly what to do in an emergency — no hesitation
- **Marketing value**: Use the badge on your website, OTA listings, and marketing materials

[Get certified](/auth/sign-up) and stand out from the competition.`,

  requirements: `To earn **SOS Safe Basic** certification, you need to:

1. **Create an account** and complete your organization profile
2. **Pass three modules** with 80% or higher on each:
   - Facility Assessment (10 questions)
   - Emergency Preparedness (12 questions)
   - Communication Protocols (8 questions)
3. **Submit for review** — our team verifies your responses (2-3 business days)

The modules are sequential — complete them in order. You can retake any module as many times as needed. There is no time limit.

Certification is valid for **1 year** and can be renewed.

Ready? [Create your account](/auth/sign-up).`,

  emergency: `**If this is an active medical emergency, please call your local emergency services immediately:**

- Most countries: **911**
- Thailand: **1669**
- Mexico: **911**

Tourist SOS cannot dispatch emergency services. Local EMS must be your first call.

Once the situation is stable, your guests can use [sostravel.app](https://sostravel.app) for follow-up coordination, or you can reach us at **emergency@tourist-sos.com**.

If you are asking about emergency preparedness certification — that is exactly what SOS Safe helps you prepare for.`,

  traveler: `Thanks for reaching out! This portal is specifically for **hotels and tour operators** who want to get SOS Safe certified.

If you are a **traveler** looking for emergency assistance or medical support while abroad, please visit:
- **[sostravel.app](https://sostravel.app)** — our traveler app for emergency coordination
- **[tourist-sos.com](https://tourist-sos.com)** — our main website

Is there anything else I can help with?`,

  medical: `For **clinics, hospitals, and medical transport companies**, we have a dedicated portal called **SOS Professional**.

Please email **partners@tourist-sos.com** to get started with medical provider onboarding.

This portal (SOS Safety) is specifically for hotels, resorts, and tour operators. Can I help you with anything else?`,

  support: `I am happy to help with what I can! For anything beyond my scope, our partnerships team is ready:

- **Email**: partners@tourist-sos.com
- **Support page**: [/support](/support)

They can help with billing, technical issues, custom arrangements for large properties, and staff training coordination.

Is there something specific I can help you with first?`,

  renew: `SOS Safe Basic certification is valid for **1 year**. When it is time to renew:

- You will receive a reminder email before your certification expires
- Renewal involves retaking the modules to ensure your protocols are current
- If you have maintained your safety measures, renewal should be straightforward

Premium and Elite tiers (coming soon) have different renewal periods — Elite is valid for **2 years**.

Need to check your status? [Log in to your dashboard](/auth/login).`,

  sos: `Hi there! I am SOSA, your safety assistant for SOS Safe.

**SOS Safe certification** helps hotels, resorts, and tour operators protect their guests and their business.

When medical emergencies happen during a guest's stay or tour, being prepared makes all the difference. Our certification gives you:
- Verified emergency protocols your staff can follow
- Documented safety training that reduces liability
- The **SOS Safe badge** that builds guest trust
- Direct access to our coordination network when incidents occur

Are you a **hotel/resort** or a **tour operator**? I can tell you more about how we can help.`,

  default: `Hi! I am SOSA, your SOS Safety assistant.

I can help you understand:
- How **SOS Safe certification** works
- What the training modules cover
- Benefits for hotels, resorts, and tour operators
- Pricing and certification tiers
- Requirements and the certification process

What type of property or business do you have? Or feel free to ask me anything about the program.`,
}

/* ------------------------------------------------------------------ */
/*  Response matching — checks keywords in priority order               */
/* ------------------------------------------------------------------ */
type Rule = { keys: string[]; response: string }

const RULES: Rule[] = [
  // Emergencies first
  { keys: ["emergency", "urgent", "ambulance", "911", "dying", "heart attack", "choking", "unconscious"], response: R.emergency },
  // Redirect: travelers
  { keys: ["i am a traveler", "i'm a traveler", "i need help abroad", "travel insurance", "i'm traveling"], response: R.traveler },
  // Redirect: medical providers
  { keys: ["clinic", "hospital", "doctor", "ambulance service", "medical provider", "medical transport"], response: R.medical },
  // SOS button
  { keys: ["[sos button pressed]"], response: R.sos },
  // Specific topics
  { keys: ["cost", "price", "pricing", "how much", "fee", "payment", "free", "charge"], response: R.cost },
  { keys: ["module", "exam", "question", "topic", "covered", "curriculum", "test", "quiz", "assess"], response: R.modules },
  { keys: ["benefit", "advantage", "why should", "why get", "worth it", "value", "roi"], response: R.benefits },
  { keys: ["require", "need to", "prerequisite", "eligibility", "qualify", "criteria", "pass"], response: R.requirements },
  { keys: ["renew", "expir", "valid for", "how long is it valid", "annual"], response: R.renew },
  { keys: ["support", "help me", "contact", "email", "phone number", "talk to someone", "human", "person"], response: R.support },
  // Org types
  { keys: ["hotel", "resort", "hostel", "accommodation", "airbnb", "property", "b&b", "guesthouse", "villa", "rooms"], response: R.hotel },
  { keys: ["tour", "operator", "guide", "excursion", "adventure", "activity", "agency"], response: R.tour },
  // General topics
  { keys: ["how long", "time", "duration", "takes", "quickly", "fast"], response: R.time },
  { keys: ["what is", "what's", "sos safe", "certification", "certified", "about", "overview", "explain", "tell me"], response: R.what },
]

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const rule of RULES) {
    if (rule.keys.some((k) => lower.includes(k))) return rule.response
  }
  return R.default
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function SosaChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const hasMessages = messages.length > 0
  const userCount = messages.filter((m) => m.role === "user").length
  const rateLimited = userCount >= MAX_MESSAGES
  const lastRole = messages.length > 0 ? messages[messages.length - 1]?.role : undefined

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500)
    return () => clearTimeout(t)
  }, [])

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping || rateLimited) return

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsTyping(true)
      if (inputRef.current) inputRef.current.style.height = "auto"

      setTimeout(() => {
        const response = getSimulatedResponse(text)
        setMessages((prev) => [
          ...prev,
          { id: `assistant-${Date.now()}`, role: "assistant", content: response },
        ])
        setIsTyping(false)
      }, 800 + Math.random() * 800)
    },
    [isTyping, rateLimited],
  )

  const handleSOS = useCallback(() => {
    if (isTyping) return
    send("[SOS BUTTON PRESSED]")
  }, [isTyping, send])

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)]">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3">
        {/* Empty state: SOS button + chips */}
        {!hasMessages && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            {/* SOS Button */}
            <div className="relative mb-8">
              <button
                onClick={handleSOS}
                disabled={isTyping}
                className="group relative w-36 h-36 md:w-44 md:h-44 rounded-full disabled:opacity-40 disabled:pointer-events-none focus:outline-none active:scale-[0.92] transition-transform duration-300 ease-out"
                aria-label="Press SOS to start"
              >
                <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-[beacon_3.5s_ease-out_infinite]" />
                <span className="absolute inset-0 rounded-full border border-red-500/25 animate-[beacon_3.5s_ease-out_0.8s_infinite]" />
                <span className="absolute inset-0 rounded-full border border-red-500/15 animate-[beacon_3.5s_ease-out_1.6s_infinite]" />
                <span className="absolute -inset-8 rounded-full bg-red-500/8 blur-3xl animate-[breathe_4s_ease-in-out_infinite]" />
                <span className="absolute inset-0 rounded-full bg-gradient-to-b from-red-400 via-red-500 to-red-700 shadow-[inset_0_-4px_12px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.2),0_4px_24px_rgba(239,68,68,0.35)] transition-shadow duration-300 group-hover:shadow-[inset_0_-4px_12px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.2),0_8px_40px_rgba(239,68,68,0.5)]" />
                <span className="absolute inset-4 rounded-full bg-gradient-to-b from-red-400/40 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-3xl md:text-4xl tracking-wider drop-shadow-lg">
                  SOS
                </span>
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-5 max-w-sm">
              Press the SOS button or tell me about your business. I can help you understand SOS Safe certification.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => send(chip.text)}
                  disabled={isTyping}
                  className="px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all disabled:opacity-30"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg) => (
          <div key={msg.id} className="max-w-2xl mx-auto w-full">
            <Bubble message={msg} />
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && lastRole === "user" && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <span>SOSA is thinking</span>
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce" />
                <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0.3s]" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input area — matches SOSWEBSITE contact-sosa.tsx */}
      <div className="border-t border-border px-4 py-3 bg-surface-2">
        <div className="max-w-2xl mx-auto">
          {/* SOSA avatar */}
          <div className="flex justify-center mb-2 pointer-events-none">
            <img
              src="/sosa-avatar.png"
              alt="SOSA"
              width={160}
              height={160}
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
            />
          </div>

          {rateLimited ? (
            <div className="rounded-2xl border border-border/60 bg-foreground/[0.03] dark:bg-white/[0.04] px-5 py-4 text-center">
              <p className="text-sm text-foreground mb-2 font-medium">
                You seem really interested -- that is great!
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Create an account for full access to SOSA and the certification portal.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/auth/sign-up" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                  Get Certified <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/support" className="inline-flex items-center gap-1.5 rounded-full border border-border text-foreground px-4 py-2 text-sm font-medium hover:bg-foreground/[0.04] transition-colors">
                  Contact Team <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); send(input) }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                placeholder="Ask SOSA about certification..."
                disabled={isTyping}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground py-1 max-h-[80px] disabled:opacity-50 leading-normal"
                aria-label="Chat with SOSA"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground/40"
                } disabled:pointer-events-none`}
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          )}

          <p className="text-[11px] text-muted-foreground text-center mt-2 opacity-40">
            Not an emergency service. For travelers, visit{" "}
            <a href="https://sostravel.app" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">sostravel.app</a>.
          </p>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.3); opacity: 0.15; }
        }
        @keyframes beacon {
          0% { transform: scale(1); opacity: 0.4; }
          70% { opacity: 0.05; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
