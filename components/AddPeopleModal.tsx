"use client"

import { useState } from "react"
import type { Contact } from "../lib/types"
import { mockContacts } from "../lib/data"
import { XIcon, CheckIcon } from "@/components/icons"

interface AddPeopleModalProps {
  showAddPeople: boolean
  setShowAddPeople: (show: boolean) => void
  selectedContacts: string[]
  toggleContactSelection: (contactId: string) => void
  addSelectedParticipants: () => void
}

export function AddPeopleModal({
  showAddPeople,
  setShowAddPeople,
  selectedContacts,
  toggleContactSelection,
  addSelectedParticipants,
}: AddPeopleModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  if (!showAddPeople) return null

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedContacts = [...filteredContacts].sort((a, b) => a.name.localeCompare(b.name))

  const favoriteIds = ["1", "2", "3"] // Demo favorites
  const favoriteContacts = sortedContacts.filter((contact) => favoriteIds.includes(contact.id))
  const regularContacts = sortedContacts.filter((contact) => !favoriteIds.includes(contact.id))

  const renderContact = (contact: Contact) => {
    const isSelected = selectedContacts.includes(contact.id)
    return (
      <button
        key={contact.id}
        onClick={() => toggleContactSelection(contact.id)}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30 border border-transparent"
        }`}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
            {contact.avatar || contact.name.charAt(0)}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
              contact.status === "online" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        {/* Contact Info */}
        <div className="flex-1 text-left">
          <div className="font-medium text-sm">{contact.name}</div>
          <div className="text-xs text-muted-foreground">
            {contact.role}, {contact.location}
          </div>
        </div>

        {/* Selection Indicator */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? "bg-primary border-primary text-white" : "border-border/50 hover:border-primary/50"
          }`}
        >
          {isSelected && <CheckIcon className="w-3 h-3" />}
        </div>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden ai-card-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold gradient-text">Add People</h2>
          <button
            onClick={() => setShowAddPeople(false)}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border/50">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {favoriteContacts.length > 0 && (
            <div className="p-4 border-b border-border/30">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1">
                ⭐ Favorites
              </h3>
              <div className="space-y-2">{favoriteContacts.map(renderContact)}</div>
            </div>
          )}

          <div className="p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">All Contacts</h3>
            <div className="space-y-2">{regularContacts.map(renderContact)}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-card/30">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">{selectedContacts.length} selected</div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddPeople(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addSelectedParticipants}
                disabled={selectedContacts.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedContacts.length > 0
                    ? "btn-primary-gradient premium-hover"
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                }`}
              >
                Add to Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
