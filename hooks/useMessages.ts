"use client"

import { useState } from "react"
import type { Message } from "../lib/types"

export function useMessages() {
  const [message, setMessage] = useState("")
  const [attachedImages, setAttachedImages] = useState<string[]>([])
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([])
  const [messageReactions, setMessageReactions] = useState<Record<string, Record<string, string[]>>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const clearMessage = () => {
    setMessage("")
    setAttachedImages([])
    setReplyingTo(null)
  }

  const addAttachment = (image: string) => {
    setAttachedImages((prev) => [...prev, image])
  }

  const removeAttachment = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const performSearch = (query: string, cases: any[], contacts: any[]) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: any[] = []
    const lowerQuery = query.toLowerCase()

    // Search in cases
    cases.forEach((case_) => {
      if (case_.title.toLowerCase().includes(lowerQuery) || case_.id.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "case",
          id: case_.id,
          title: case_.title,
          timestamp: case_.timestamp,
          status: case_.status,
        })
      }
    })

    // Search in contacts
    contacts.forEach((contact) => {
      if (
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.role.toLowerCase().includes(lowerQuery) ||
        contact.location.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: "contact",
          id: contact.id,
          name: contact.name,
          role: contact.role,
          location: contact.location,
        })
      }
    })

    setSearchResults(results)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
  }

  return {
    message,
    setMessage,
    attachedImages,
    setAttachedImages,
    addAttachment,
    removeAttachment,
    replyingTo,
    setReplyingTo,
    pinnedMessages,
    setPinnedMessages,
    messageReactions,
    setMessageReactions,
    clearMessage,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    performSearch,
    clearSearch,
  }
}
