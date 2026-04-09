"use client"

import { useState } from "react"
import { useSosaChat } from "@/lib/use-sosa-chat"

/* ------------------------------------------------------------------ */
/*  Inline markdown: bold                                              */
/* ------------------------------------------------------------------ */
function RichLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        const boldMatch = part.match(/^\*\*([^*]+)\*\*$/)
        if (boldMatch) {
          return <strong key={i} className="font-semibold text-foreground">{boldMatch[1]}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Floating chat widget for authenticated dashboard users             */
/* ------------------------------------------------------------------ */
export function SosaChatWidget() {
  const [open, setOpen] = useState(false)

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
  } = useSosaChat({
    context: "dashboard",
  })

  return (
    <div className="print:hidden">
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Open SOSA assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] max-h-[80vh] glass-card rounded-xl border border-border/50 shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">SOSA</p>
                <p className="text-xs text-muted-foreground">Safety Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Ask me about certification, safety protocols, or your local knowledge.
                </p>
                <p className="text-[10px] text-muted-foreground/50 mb-3 leading-relaxed px-2">
                  SOSA is an AI assistant. Responses are informational only and may contain errors.
                  Not a substitute for professional safety advice.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {[
                    "How do I improve my score?",
                    "What should our emergency plan include?",
                    "What local knowledge should we add?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q)
                        // Small delay to let state update then submit
                        setTimeout(() => {
                          const form = document.getElementById("sosa-widget-form") as HTMLFormElement
                          if (form) form.requestSubmit()
                        }, 50)
                      }}
                      className="px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/10 text-foreground rounded-br-sm"
                      : "text-foreground"
                  }`}
                >
                  {msg.content.split("\n").map((line, i) => {
                    if (!line.trim()) return <br key={i} />
                    const bulletMatch = line.match(/^[-*]\s+(.+)/)
                    if (bulletMatch) {
                      return (
                        <div key={i} className="flex gap-2 mt-1 first:mt-0">
                          <span className="text-primary mt-0.5 flex-shrink-0 text-xs">{"-->"}</span>
                          <span className="text-sm"><RichLine text={bulletMatch[1]} /></span>
                        </div>
                      )
                    }
                    return (
                      <p key={i} className={i > 0 ? "mt-1" : ""}>
                        <RichLine text={line} />
                      </p>
                    )
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-muted-foreground">
                <span>SOSA is thinking</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0.3s]" />
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-2">
            <form
              id="sosa-widget-form"
              onSubmit={handleSubmit}
              className="flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 60)}px`
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    const form = e.currentTarget.closest("form")
                    if (form) form.requestSubmit()
                  }
                }}
                placeholder="Ask SOSA..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground py-1 max-h-[60px] disabled:opacity-50 leading-normal"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground/40"
                } disabled:pointer-events-none`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <p className="text-[10px] text-muted-foreground text-center mt-1.5 opacity-40">
              AI-powered — not an emergency service
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
