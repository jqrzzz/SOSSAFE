"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useSosaChat, type ChatMessage } from "@/lib/use-sosa-chat"
import Link from "next/link"
import { Send, Loader2, ArrowRight } from "lucide-react"

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
/*  Message bubble                                                     */
/* ------------------------------------------------------------------ */
function Bubble({ message }: { message: ChatMessage }) {
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
/*  Simulated responses (fallback when API is not available)           */
/* ------------------------------------------------------------------ */
const SIMULATED: Record<string, string> = {
  hotel: `Great to meet you! Hotels and resorts are exactly who we built **SOS Safe** for.\n\nHere is how certification helps your property:\n- Display the **SOS Safe badge** so guests know you are prepared\n- Get direct access to our emergency coordination network\n- Staff training on handling guest medical situations\n- Connect guests instantly to vetted local medical providers\n- Reduced liability through documented safety protocols\n\nThe process takes about 2-3 hours total (at your own pace), and most properties complete certification within 1-2 weeks.\n\nReady to start? [Create your account](/auth/sign-up) and I will guide you through each step.`,
  tour: `Absolutely! Tour operators are essential partners in our safety network, especially for adventure and outdoor activities.\n\n**SOS Safe certification** for tour operators covers:\n- Emergency protocols training for your guides\n- Communication procedures when incidents happen in the field\n- Access to our medical coordination network\n- The SOS Safe badge for your marketing materials\n\nYour guides will know exactly what to do if a guest has a medical issue during a tour.\n\n[Start your certification](/auth/sign-up) — it takes about 2-3 hours to complete.`,
  what: `**SOS Safe** is a certification program by Tourist SOS that recognizes hotels, resorts, and tour operators who are prepared to handle guest medical emergencies.\n\nCertification involves three training modules — facility assessment, emergency preparedness, and communication protocols — each with a minimum **80% passing score**.\n\nWould you like to [get started](/auth/sign-up)?`,
  time: `Most partners complete certification within **1-2 weeks**. Here is the breakdown:\n\n- **Training modules**: About 2-3 hours total (3 modules, at your own pace)\n- **Passing score**: 80% per module — retake as many times as needed\n- **Our review**: 2-3 business days after all modules are passed\n\nReady? [Create your account](/auth/sign-up).`,
  cost: `We have different certification tiers:\n\n- **SOS Safe Basic** — Start the certification process for free\n- **SOS Safe Premium** — Coming soon\n- **SOS Safe Elite** — Coming soon\n\n[Create a free account](/auth/sign-up) and explore the dashboard.`,
  modules: `The certification covers **three modules** with a total of 30 questions:\n\n**1. Facility Assessment** (10 questions)\nCovers emergency exits, first aid, fire safety, AED availability, accessibility.\n\n**2. Emergency Preparedness** (12 questions)\nCovers staff training, emergency coordinators, response plans, drill frequency.\n\n**3. Communication Protocols** (8 questions)\nCovers check-in briefings, multilingual info, mass notification, 24/7 contact.\n\nYou need **80% or higher** on each module. Retakes are allowed.\n\nWant to [start now](/auth/sign-up)?`,
  emergency: `**If this is an active medical emergency, please call your local emergency services immediately.**\n\nTourist SOS cannot dispatch emergency services. Local EMS must be your first call.\n\nIf you are asking about emergency preparedness certification — that is exactly what SOS Safe helps you prepare for.`,
  default: `Hi! I am SOSA, your SOS Safety assistant.\n\nI can help you understand:\n- How **SOS Safe certification** works\n- What the training modules cover\n- Benefits for hotels, resorts, and tour operators\n- Requirements and the certification process\n\nWhat type of property or business do you have? Or feel free to ask me anything about the program.`,
}

type SimRule = { keys: string[]; response: string }
const SIM_RULES: SimRule[] = [
  { keys: ["emergency", "urgent", "ambulance", "911", "dying"], response: SIMULATED.emergency },
  { keys: ["cost", "price", "pricing", "how much", "fee", "free"], response: SIMULATED.cost },
  { keys: ["module", "exam", "question", "topic", "covered", "test"], response: SIMULATED.modules },
  { keys: ["hotel", "resort", "hostel", "accommodation", "property", "guesthouse"], response: SIMULATED.hotel },
  { keys: ["tour", "operator", "guide", "excursion", "adventure"], response: SIMULATED.tour },
  { keys: ["how long", "time", "duration", "takes", "quickly"], response: SIMULATED.time },
  { keys: ["what is", "what's", "sos safe", "certification", "about"], response: SIMULATED.what },
]

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const rule of SIM_RULES) {
    if (rule.keys.some((k) => lower.includes(k))) return rule.response
  }
  return SIMULATED.default
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface SosaChatProps {
  /** "public" for homepage, "dashboard" for authenticated users */
  context?: "public" | "dashboard"
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function SosaChat({ context = "public" }: SosaChatProps) {
  const [useAI, setUseAI] = useState(true)
  const [simMessages, setSimMessages] = useState<ChatMessage[]>([])
  const [simTyping, setSimTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Custom streaming chat hook
  const {
    messages: aiMessages,
    input: aiInput,
    setInput: setAiInput,
    handleSubmit: aiHandleSubmit,
    isLoading: aiLoading,
    error: aiError,
    append: aiAppend,
  } = useSosaChat({
    context,
    onError: () => {
      // If AI fails, fall back to simulated
      setUseAI(false)
    },
  })

  // Unified view of messages
  const messages: ChatMessage[] = useAI ? aiMessages : simMessages

  const isTyping = useAI ? aiLoading : simTyping
  const hasMessages = messages.length > 0
  const userCount = messages.filter((m) => m.role === "user").length
  const MAX_MESSAGES = 20
  const rateLimited = userCount >= MAX_MESSAGES

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500)
    return () => clearTimeout(t)
  }, [])

  // Switch to simulated if we detect an error
  useEffect(() => {
    if (aiError) setUseAI(false)
  }, [aiError])

  const sendSimulated = useCallback(
    (text: string) => {
      if (!text.trim() || simTyping || rateLimited) return
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      }
      setSimMessages((prev) => [...prev, userMsg])
      setSimTyping(true)
      setTimeout(() => {
        const response = getSimulatedResponse(text)
        setSimMessages((prev) => [
          ...prev,
          { id: `assistant-${Date.now()}`, role: "assistant", content: response },
        ])
        setSimTyping(false)
      }, 600 + Math.random() * 600)
    },
    [simTyping, rateLimited],
  )

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping || rateLimited) return
      if (useAI) {
        aiAppend(text.trim())
      } else {
        sendSimulated(text)
      }
    },
    [useAI, isTyping, rateLimited, aiAppend, sendSimulated],
  )

  const handleSOS = useCallback(() => {
    if (isTyping) return
    send("I need help — tell me about SOS Safe and how it protects guests.")
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

            <p className="text-[11px] text-muted-foreground/60 max-w-sm mb-5 leading-relaxed">
              SOSA is an AI assistant. Responses are for informational purposes only and may contain errors.
              This is not an emergency service and does not provide professional safety, legal, or medical advice.
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
        {isTyping && (
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

      {/* Input area */}
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
              onSubmit={(e) => {
                e.preventDefault()
                if (useAI) {
                  aiHandleSubmit(e)
                } else {
                  send(aiInput || "")
                  setAiInput("")
                }
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                value={aiInput}
                onChange={(e) => {
                  setAiInput(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (useAI) {
                      const form = e.currentTarget.closest("form")
                      if (form) form.requestSubmit()
                    } else {
                      send(aiInput || "")
                      setAiInput("")
                    }
                  }
                }}
                placeholder={
                  context === "dashboard"
                    ? "Ask SOSA about your certification, safety protocols, or local knowledge..."
                    : "Ask SOSA about certification..."
                }
                disabled={isTyping}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground py-1 max-h-[80px] disabled:opacity-50 leading-normal"
                aria-label="Chat with SOSA"
              />
              <button
                type="submit"
                disabled={!(aiInput || "").trim() || isTyping}
                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                  (aiInput || "").trim()
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
            {useAI ? "Powered by SOSA AI" : "Running in demo mode"} — not an emergency service.{" "}
            For travelers, visit{" "}
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
