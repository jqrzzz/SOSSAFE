"use client"

import { useState, useCallback, useRef } from "react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

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

export function AdminChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return

      const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: text.trim() }
      const updated = [...messages, userMsg]
      setMessages(updated)
      setIsLoading(true)

      const assistantId = `assistant-${Date.now()}`
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])

      try {
        abortRef.current = new AbortController()
        const res = await fetch("/api/admin/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updated.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) throw new Error(`API returned ${res.status}`)

        const reader = res.body?.getReader()
        if (!reader) throw new Error("No response body")

        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
          )
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [messages, isLoading],
  )

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (input.trim()) {
      const text = input
      setInput("")
      sendMessage(text)
    }
  }

  return (
    <div className="print:hidden">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Open SOSA Admin"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[440px] h-[540px] max-h-[85vh] glass-card rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-orange-500/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">SOSA Admin</p>
                <p className="text-xs text-muted-foreground">Operations Agent</p>
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
                  Ask me anything about the business.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {[
                    "How's the business doing?",
                    "Who signed up this week?",
                    "Any trials expiring soon?",
                    "Show me all hostels",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-orange-500/40 transition-all"
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
                      ? "bg-orange-500/10 text-foreground rounded-br-sm"
                      : "text-foreground"
                  }`}
                >
                  {msg.content.split("\n").map((line, i) => {
                    if (!line.trim()) return <br key={i} />
                    const bulletMatch = line.match(/^[-*]\s+(.+)/)
                    if (bulletMatch) {
                      return (
                        <div key={i} className="flex gap-2 mt-1 first:mt-0">
                          <span className="text-orange-500 mt-0.5 flex-shrink-0 text-xs">{"-->"}</span>
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
                <span>Working</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-orange-500/60 animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-orange-500/60 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-1 rounded-full bg-orange-500/60 animate-bounce [animation-delay:0.3s]" />
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-2">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
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
                    handleSubmit()
                  }
                }}
                placeholder="Ask SOSA Admin..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground py-1 max-h-[60px] disabled:opacity-50 leading-normal"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                  input.trim()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "text-muted-foreground/40"
                } disabled:pointer-events-none`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
