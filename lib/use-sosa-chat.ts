"use client"

import { useState, useCallback, useRef } from "react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface UseSosaChatOptions {
  context?: "public" | "dashboard"
  onError?: () => void
}

/**
 * Custom hook for SOSA chat — streams from /api/chat.
 * Built for AI SDK v6 text stream responses.
 */
export function useSosaChat({ context = "public", onError }: UseSosaChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const append = useCallback(
    async (userContent: string) => {
      if (!userContent.trim() || isLoading) return

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userContent.trim(),
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setIsLoading(true)
      setError(null)

      // Prepare assistant message placeholder
      const assistantId = `assistant-${Date.now()}`
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])

      try {
        abortRef.current = new AbortController()

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context,
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          throw new Error(`Chat API returned ${res.status}`)
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error("No response body")

        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          accumulated += decoder.decode(value, { stream: true })

          // Update the assistant message with accumulated text
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m,
            ),
          )
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        const error = err instanceof Error ? err : new Error("Chat failed")
        setError(error)
        // Remove empty assistant message on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        onError?.()
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [messages, isLoading, context, onError],
  )

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      if (input.trim()) {
        const text = input
        setInput("")
        append(text)
      }
    },
    [input, append],
  )

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    append,
    handleSubmit,
  }
}
