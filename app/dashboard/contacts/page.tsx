"use client"

import { useState } from "react"

interface Contact {
  id: string
  name: string
  role: string
  category: string
  status: "online" | "offline"
  avatar: string
  phone: string
  location: string
  isFavorite: boolean
}

const mockContacts: Contact[] = [
  { id: "hotel-1", name: "Maria Santos", role: "Hotel Manager", category: "Hospitality", status: "online", avatar: "MS", phone: "+1-555-0123", location: "Grand Resort", isFavorite: true },
  { id: "hotel-2", name: "James Wilson", role: "Front Desk", category: "Hospitality", status: "online", avatar: "JW", phone: "+1-555-0124", location: "Grand Resort", isFavorite: false },
  { id: "medical-1", name: "Dr. Carlos Rodriguez", role: "Paramedic", category: "Medical", status: "online", avatar: "CR", phone: "+52-998-123-4567", location: "Emergency Services", isFavorite: true },
  { id: "medical-2", name: "Ana Gutierrez", role: "EMT", category: "Medical", status: "offline", avatar: "AG", phone: "+52-998-123-4568", location: "Emergency Services", isFavorite: false },
  { id: "medical-3", name: "Dr. Sarah Chen", role: "Emergency Physician", category: "Medical", status: "online", avatar: "SC", phone: "+52-998-987-6543", location: "Medical Center", isFavorite: true },
  { id: "medical-4", name: "Dr. Miguel Torres", role: "General Practitioner", category: "Medical", status: "online", avatar: "MT", phone: "+52-998-987-6544", location: "Plaza Clinic", isFavorite: false },
  { id: "tour-1", name: "Roberto Mendez", role: "Tour Guide", category: "Tour", status: "online", avatar: "RM", phone: "+52-998-555-7890", location: "Adventure Tours", isFavorite: false },
  { id: "tour-2", name: "Sofia Martinez", role: "Tour Coordinator", category: "Tour", status: "online", avatar: "SM", phone: "+52-998-555-7891", location: "Coastal Excursions", isFavorite: true },
]

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "Medical": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    case "Hospitality": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    case "Tour": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export default function DashboardContactsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [expandedContacts, setExpandedContacts] = useState<Set<string>>(new Set())

  const filteredContacts = mockContacts
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "favorites" && contact.isFavorite) ||
        (filterBy === "online" && contact.status === "online") ||
        contact.category.toLowerCase() === filterBy.toLowerCase()
      return matchesSearch && matchesFilter
    })

  const toggleExpand = (id: string) => {
    const next = new Set(expandedContacts)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedContacts(next)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Contacts</h1>
        <p className="text-muted-foreground text-sm mt-1">Your SOS network contacts</p>
      </div>

      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-sm">
        Preview mode — contact management will be connected in a future update.
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by name, role, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm min-w-[130px]"
        >
          <option value="all">All Contacts</option>
          <option value="favorites">Favorites</option>
          <option value="online">Online</option>
          <option value="medical">Medical</option>
          <option value="hospitality">Hospitality</option>
          <option value="tour">Tour</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="glass-card rounded-lg border border-border/50 overflow-hidden">
            <div className="p-3 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                  {contact.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${contact.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                  {contact.isFavorite && (
                    <svg className="w-3 h-3 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryBadge(contact.category)}`}>
                    {contact.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{contact.role} &middot; {contact.location}</p>
              </div>

              <button
                onClick={() => toggleExpand(contact.id)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className={`w-4 h-4 transition-transform ${expandedContacts.has(contact.id) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {expandedContacts.has(contact.id) && (
              <div className="border-t border-border/30 p-3 bg-muted/20 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[60px]">Phone:</span>
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[60px]">Location:</span>
                  <span>{contact.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[60px]">Status:</span>
                  <span className={contact.status === "online" ? "text-green-600" : "text-gray-500"}>
                    {contact.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="pt-2 border-t border-border/20">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="inline-block px-4 py-2 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                  >
                    Call
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No contacts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
