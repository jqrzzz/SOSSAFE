"use client"

import React from "react"
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
/*  Message bubble                                                     */
/* ------------------------------------------------------------------ */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const text = message.content

  if (isUser && text.includes("[SOS BUTTON PRESSED]")) return null
  if (!text) return null

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-[fadeIn_0.4s_ease-out_both]`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "bg-foreground/[0.06] dark:bg-white/[0.08] text-foreground rounded-br-md"
            : "text-foreground"
        }`}
      >
        {text.split("\n").map((line, i) => {
          if (!line.trim()) return <br key={i} />
          const bulletMatch = line.match(/^[-*]\s+(.+)/)
          if (bulletMatch) {
            return (
              <div key={i} className="flex gap-2 mt-1.5 first:mt-0">
                <span className="text-primary mt-0.5 flex-shrink-0 text-xs">{"-->"}</span>
                <span><RichText text={bulletMatch[1]} /></span>
              </div>
            )
          }
          return (
            <p key={i} className={i > 0 ? "mt-2" : ""}>
              <RichText text={line} />
            </p>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Typing indicator                                                   */
/* ------------------------------------------------------------------ */
function TypingIndicator({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="flex justify-start animate-[fadeIn_0.3s_ease-out_both]">
      <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
        <span className="font-medium">SOSA is thinking</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[bounce_1.2s_ease-in-out_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[bounce_1.2s_ease-in-out_0.15s_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[bounce_1.2s_ease-in-out_0.3s_infinite]" />
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Quick action chips                                                 */
/* ------------------------------------------------------------------ */
const QUICK_ACTIONS = [
  { label: "Hotel / Resort", text: "I manage a hotel or resort." },
  { label: "Tour Operator", text: "I run a tour operation." },
]

/* ------------------------------------------------------------------ */
/*  Simulated responses (until AI backend is connected)                */
/* ------------------------------------------------------------------ */
const SIMULATED_RESPONSES: Record<string, string> = {
  "hotel": `Great to meet you! Hotels and resorts are exactly who we built **SOS Safe** for.

Here is how certification helps your property:
- Display the **SOS Safe badge** so guests know you are prepared
- Get direct access to our emergency coordination network
- Complete staff training on handling medical situations
- Connect guests instantly to vetted local medical providers

The process takes about 2-3 hours total (you can do it at your own pace), and most properties complete certification within 1-2 weeks.

Ready to start? [Create your account](/auth/sign-up) and I will guide you through each step.`,

  "tour": `Absolutely! Tour operators are essential partners in our safety network, especially for adventure and outdoor activities.

**SOS Safe certification** for tour operators includes:
- Emergency protocols training for your guides
- Communication procedures when incidents happen
- Access to our medical coordination network
- The SOS Safe badge for your marketing materials

Your guides will know exactly what to do if a guest has a medical issue during a tour. That peace of mind is valuable for both you and your customers.

[Start your certification](/auth/sign-up) - it takes about 2-3 hours to complete.`,

  "what": `**SOS Safe** is a certification that shows travelers your property or tour company is prepared for medical emergencies.

When you are certified:
- Guests see a trusted safety badge on your listing
- You have verified emergency response protocols
- Your staff knows how to handle medical situations
- You get priority access to Tourist SOS coordination services

Think of it as a seal of approval that says: "We take your safety seriously." It helps you stand out and builds guest confidence.

Certification involves three training modules covering facility assessment, emergency preparedness, and communication protocols.

Would you like to [get started](/auth/sign-up)?`,

  "time": `Most partners complete certification within **1-2 weeks**. Here is the breakdown:

- **Training modules**: About 2-3 hours total (do it at your own pace)
- **Our review**: 2-3 business days after you submit
- **Certificate issued**: Same day after approval

You do not need to do everything in one sitting. Many partners complete one module per day between other tasks.

Ready to begin? [Create your account](/auth/sign-up) and start whenever you are ready.`,

  "sos": `Hi there! I am SOSA, your safety assistant.

**SOS Safe certification** helps hotels, resorts, and tour operators protect their guests and their business.

When emergencies happen during a guest's stay or tour, being prepared makes all the difference. Our certification gives you:
- Verified emergency protocols your staff can follow
- Reduced liability through documented safety training  
- The **SOS Safe badge** that builds guest trust
- Direct access to our coordination network when incidents occur

Are you a **hotel/resort** or a **tour operator**? I can tell you more about how we can help.`,

  "default": `Hi! I am SOSA, your SOS Safety assistant.

I can help you understand:
- How **SOS Safe certification** works
- Benefits for hotels, resorts, and tour operators  
- The certification process and requirements
- How we help you protect your guests

What type of property or business do you have?`
}

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase()
  
  // SOS button pressed
  if (lower.includes("[sos button pressed]")) {
    return SIMULATED_RESPONSES["sos"]
  }
  
  // Accommodation providers
  if (lower.includes("hotel") || lower.includes("resort") || lower.includes("hostel") || lower.includes("accommodation") || lower.includes("airbnb") || lower.includes("property")) {
    return SIMULATED_RESPONSES["hotel"]
  }
  
  // Tour operators
  if (lower.includes("tour") || lower.includes("operator") || lower.includes("guide") || lower.includes("excursion") || lower.includes("adventure")) {
    return SIMULATED_RESPONSES["tour"]
  }
  
  // Time/duration questions
  if (lower.includes("how long") || lower.includes("time") || lower.includes("duration") || lower.includes("takes")) {
    return SIMULATED_RESPONSES["time"]
  }
  
  // What is SOS Safe
  if (lower.includes("what") || lower.includes("sos safe") || lower.includes("certification") || lower.includes("certified") || lower.includes("curious") || lower.includes("overview") || lower.includes("browsing")) {
    return SIMULATED_RESPONSES["what"]
  }
  
  return SIMULATED_RESPONSES["default"]
}

/* ------------------------------------------------------------------ */
/*  Rate limit notice                                                  */
/* ------------------------------------------------------------------ */
function RateLimitNotice() {
  return (
    <div className="rounded-2xl border border-border/60 bg-foreground/[0.03] dark:bg-white/[0.04] px-5 py-4 text-center">
      <p className="text-sm text-foreground mb-2 font-medium">
        You seem really interested -- that is great!
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        To keep the conversation going, reach out to our team or create an account for full access.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/auth/sign-up" className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
          Get Certified <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link href="/support" className="inline-flex items-center gap-1.5 rounded-xl border border-border text-foreground px-4 py-2 text-sm font-medium hover:bg-foreground/[0.04] transition-colors">
          Contact Team <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function SosaChat() {
  const [input, setInput] = useState("")
  const [welcomeVisible, setWelcomeVisible] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const lastMsgRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const hasMessages = messages.length > 0
  const userMessageCount = messages.filter((m) => m.role === "user").length
  const rateLimited = userMessageCount >= MAX_MESSAGES

  // Fade welcome on first message
  useEffect(() => {
    if (hasMessages && welcomeVisible) {
      setWelcomeVisible(false)
    }
  }, [hasMessages, welcomeVisible])

  // Scroll last message into view
  useEffect(() => {
    if (hasMessages && lastMsgRef.current) {
      const el = lastMsgRef.current
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      if (rect.bottom > viewportH - 280) {
        window.scrollTo({
          top: window.scrollY + rect.top - 80,
          behavior: "smooth",
        })
      }
    }
  }, [messages, isTyping, hasMessages])

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
        content: text.trim()
      }
      
      setMessages(prev => [...prev, userMessage])
      setInput("")
      setIsTyping(true)
      
      if (inputRef.current) inputRef.current.style.height = "auto"
      
      // Simulate response delay
      setTimeout(() => {
        const response = getSimulatedResponse(text)
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)
      }, 800 + Math.random() * 800)
    },
    [isTyping, rateLimited],
  )

  const handleSOS = useCallback(() => {
    if (isTyping) return
    send("[SOS BUTTON PRESSED]")
  }, [isTyping, send])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        send(input)
      }
    },
    [send, input],
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
      const el = e.target
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    },
    [],
  )

  return (
    <>
      {/* ============================================================ */}
      {/*  Welcome state -- fades via opacity                          */}
      {/* ============================================================ */}
      <div
        className={`flex flex-col items-center justify-center px-4 transition-all duration-700 ease-out ${
          welcomeVisible && !hasMessages
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute inset-0 -z-10"
        }`}
        style={{ minHeight: welcomeVisible && !hasMessages ? "calc(100dvh - 18rem)" : undefined }}
      >
        {/* SOS Button */}
        <div className="relative mb-6">
          <button
            onClick={handleSOS}
            disabled={isTyping}
            className="group relative w-36 h-36 md:w-44 md:h-44 rounded-full disabled:opacity-40 disabled:pointer-events-none focus:outline-none active:scale-[0.92] transition-transform duration-300 ease-out"
            aria-label="Press SOS to start"
          >
            {/* Beacon ripples */}
            <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-[beacon_3.5s_ease-out_infinite]" />
            <span className="absolute inset-0 rounded-full border border-red-500/25 animate-[beacon_3.5s_ease-out_0.8s_infinite]" />
            <span className="absolute inset-0 rounded-full border border-red-500/15 animate-[beacon_3.5s_ease-out_1.6s_infinite]" />
            <span className="absolute inset-0 rounded-full border border-red-400/10 animate-[beacon_3.5s_ease-out_2.4s_infinite]" />
            {/* Soft glow */}
            <span className="absolute -inset-8 rounded-full bg-red-500/8 blur-3xl animate-[breathe_4s_ease-in-out_infinite]" />
            {/* Button face */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-red-400 via-red-500 to-red-700 shadow-[inset_0_-4px_12px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.2),0_4px_24px_rgba(239,68,68,0.35)] transition-shadow duration-300 group-hover:shadow-[inset_0_-4px_12px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.2),0_8px_40px_rgba(239,68,68,0.5)]" />
            <span className="absolute inset-4 rounded-full bg-gradient-to-b from-red-400/40 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-3xl md:text-4xl tracking-wider drop-shadow-lg">
              SOS
            </span>
          </button>
        </div>
        

      </div>

      {/* ============================================================ */}
      {/*  Chat messages                                                */}
      {/* ============================================================ */}
      {hasMessages && (
        <div className="max-w-2xl mx-auto px-4 md:px-6 pt-4 pb-2 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={msg.id} ref={i === messages.length - 1 ? lastMsgRef : undefined}>
              <MessageBubble message={msg} />
            </div>
          ))}
          <TypingIndicator show={isTyping} />
        </div>
      )}

      {/* ============================================================ */}
      {/*  Sticky bottom: SOSA + chips + input                          */}
      {/* ============================================================ */}
      <div className="sticky bottom-0 z-30 pt-4 pb-3 px-4 md:px-6" style={{ background: "linear-gradient(to top, var(--background) 70%, transparent)" }}>
        <div className="max-w-2xl mx-auto">

          {/* Quick action chips */}
          <div className="flex flex-col items-center mb-1 min-h-[1.5rem]">
            {!hasMessages && (
              <div className="mb-2 flex flex-wrap justify-center gap-2 animate-[fadeIn_0.5s_ease-out_both]">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => send(action.text)}
                    disabled={isTyping}
                    className="px-3 py-1.5 text-xs rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/[0.06] transition-all duration-300 disabled:opacity-30"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SOSA avatar */}
          <div className="flex justify-center mb-2 pointer-events-none">
            <img
              src="/sosa-avatar.png"
              alt="SOSA"
              width={192}
              height={192}
              loading="eager"
              className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-lg"
            />
          </div>

          {/* Rate limit or input */}
          {rateLimited ? (
            <RateLimitNotice />
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); send(input) }}
              className={`flex items-end gap-2 rounded-full border px-4 py-2.5 transition-all duration-500 ease-out bg-background ${
                input.trim()
                  ? "border-primary/50 shadow-sm ring-1 ring-primary/20"
                  : "border-border/80 shadow-sm hover:border-primary/30"
              }`}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                placeholder="Talk to SOSA..."
                disabled={isTyping}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-foreground placeholder:text-muted-foreground py-1 max-h-[120px] disabled:opacity-50 leading-normal"
                aria-label="Chat message"
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out ${
                    input.trim()
                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95"
                      : "text-muted-foreground/40"
                  } disabled:pointer-events-none`}
                  aria-label="Send message"
                >
                  {isTyping ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Send className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-muted-foreground text-center mt-2 opacity-40">
            Website demo only. In a real emergency, call local services. For travelers, visit{" "}
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
