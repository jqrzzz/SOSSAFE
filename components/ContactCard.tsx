"use client"

import type { Contact } from "@/lib/types"
import { StarIcon } from "@/components/icons"

interface ContactCardProps {
  contact: Contact
  onStartCase: (contact: Contact) => void
  onToggleFavorite: (contactId: string) => void
}

export function ContactCard({ contact, onStartCase, onToggleFavorite }: ContactCardProps) {
  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-primary">{contact.avatar}</span>
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
                contact.status === "online" ? "bg-[var(--status-online)]" : "bg-[var(--status-offline)]"
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{contact.name}</h3>
              {contact.isFavorite && <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />}
            </div>
            <p className="text-sm text-muted-foreground">{contact.role}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">📍</span>
          <span>{contact.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">📞</span>
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">🟢</span>
          <span
            className={contact.status === "online" ? "text-[var(--status-online)]" : "text-[var(--status-offline)]"}
          >
            {contact.status === "online" ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="btn-primary-gradient flex-1 px-4 py-2 rounded-lg text-sm font-medium"
          onClick={() => onStartCase(contact)}
        >
          Start Case
        </button>
        <button
          className="px-3 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          onClick={() => onToggleFavorite(contact.id)}
        >
          <StarIcon className={`w-4 h-4 ${contact.isFavorite ? "text-[var(--warning-amber)] fill-current" : ""}`} />
        </button>
      </div>
    </div>
  )
}
