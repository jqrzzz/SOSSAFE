"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Send, Loader2, ArrowRight, X, MessageCircle } from "lucide-react"

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

  if (!text) return null

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-[fadeIn_0.4s_ease-out_both]`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
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
  { label: "Hotel / Resort", text: "I manage a hotel or resort. How can SOS Safety certification help us protect our guests?" },
  { label: "Tour Operator", text: "I run a tour operation. How do I get SOS Safe certified?" },
  { label: "What is SOS Safe?", text: "What is SOS Safe certification and why should my property get certified?" },
  { label: "Pricing", text: "What does SOS Safety certification cost?" },
]

/* ------------------------------------------------------------------ */
/*  Simulated responses (until AI backend is connected)                */
/* ------------------------------------------------------------------ */
const SIMULATED_RESPONSES: Record<string, string> = {
  "hotel": `Great question! **SOS Safety certification** helps hotels and resorts:

- Demonstrate commitment to guest safety with the **SOS Safe** badge
- Get direct access to Tourist SOS emergency response network
- Receive staff training on emergency protocols
- Connect guests to immediate medical and evacuation assistance

Ready to get started? [Sign up for certification](/auth/sign-up) and we will guide you through the process.`,

  "tour": `Tour operators are essential partners in our safety network! Here is how to get **SOS Safe certified**:

- Complete our online assessment (about 15 minutes)
- Review emergency preparedness protocols
- Train your guides on Tourist SOS procedures
- Display your SOS Safe badge on marketing materials

[Start your certification](/auth/sign-up) today and show travelers you prioritize their safety.`,

  "what": `**SOS Safe** is the industry standard certification for travel safety.

When your property is certified:
- Guests know you have verified emergency protocols
- You get priority access to our 24/7 response network
- Staff receive training on handling medical emergencies
- Your property joins a trusted network of safety-conscious partners

It is like a seal of approval that says: "We take your safety seriously."

[Learn more about certification](/auth/sign-up)`,

  "pricing": `Our certification is designed to be accessible:

- **Basic Certification** - Included with partnership
- **Premium Certification** - Enhanced training and support
- **Elite Certification** - Full integration with emergency services

[Contact us](/auth/sign-up) to discuss which tier is right for your property. We offer flexible options based on your size and needs.`,

  "default": `I am SOSA, your SOS Safety assistant! I can help you understand:

- How **SOS Safe certification** works
- Benefits for hotels, resorts, and tour operators
- The certification process and requirements
- How we help protect your guests

What would you like to know?`
}

function getSimulatedResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes("hotel") || lower.includes("resort") || lower.includes("accommodation")) {
    return SIMULATED_RESPONSES["hotel"]
  }
  if (lower.includes("tour") || lower.includes("operator") || lower.includes("guide")) {
    return SIMULATED_RESPONSES["tour"]
  }
  if (lower.includes("what") || lower.includes("sos safe") || lower.includes("certification")) {
    return SIMULATED_RESPONSES["what"]
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing")) {
    return SIMULATED_RESPONSES["pricing"]
  }
  return SIMULATED_RESPONSES["default"]
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function SosaChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const hasMessages = messages.length > 0
  const userMessageCount = messages.filter((m) => m.role === "user").length
  const rateLimited = userMessageCount >= MAX_MESSAGES

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(t)
    }
  }, [isOpen])

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
      }, 1000 + Math.random() * 1000)
    },
    [isTyping, rateLimited],
  )

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
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        aria-label="Open chat with SOSA"
      >
        <img
          src="/sosa-avatar.png"
          alt="SOSA"
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-[420px] sm:bottom-6 sm:right-6 sm:rounded-2xl bg-background border border-border shadow-2xl transition-all duration-300 ${
          isOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full sm:translate-y-8 opacity-0 pointer-events-none"
        }`}
        style={{ maxHeight: "min(600px, calc(100dvh - 2rem))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="/sosa-avatar.png"
              alt="SOSA"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <div>
              <h3 className="font-semibold text-foreground">SOSA</h3>
              <p className="text-xs text-muted-foreground">SOS Safety Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4" style={{ height: "calc(min(600px, calc(100dvh - 2rem)) - 140px)" }}>
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <img
                src="/sosa-avatar.png"
                alt="SOSA"
                width={120}
                height={120}
                className="w-24 h-24 object-contain mb-4"
              />
              <h4 className="font-semibold text-foreground mb-2">Hi, I am SOSA!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                I can help you learn about SOS Safe certification for your property.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
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
            </div>
          )}
          
          {hasMessages && (
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <TypingIndicator show={isTyping} />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className={`flex items-end gap-2 rounded-full border px-4 py-2.5 transition-all duration-300 bg-background ${
              input.trim()
                ? "border-primary/50 shadow-sm ring-1 ring-primary/20"
                : "border-border/80 hover:border-primary/30"
            }`}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Ask about certification..."
              disabled={isTyping || rateLimited}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-foreground placeholder:text-muted-foreground py-1 max-h-[120px] disabled:opacity-50 leading-normal"
              aria-label="Chat message"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                input.trim()
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95"
                  : "text-muted-foreground/40"
              } disabled:pointer-events-none`}
              aria-label="Send message"
            >
              {isTyping ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Send className="w-[18px] h-[18px]" />}
            </button>
          </form>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
