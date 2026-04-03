"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { StandardInput } from "@/components/StandardInput"
import { Header } from "@/components/Header"
import { ContactSkeleton } from "@/components/ContactSkeleton"
import { SearchLoadingState } from "@/components/SearchLoadingState"
import { Sidebar } from "@/components/Sidebar"
import { ProfilePopout } from "@/components/ProfilePopout"

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
  // Hospitality
  {
    id: "hotel-1",
    name: "Maria Santos",
    role: "Hotel Manager",
    category: "Hospitality",
    status: "online",
    avatar: "MS",
    phone: "+1-555-0123",
    location: "Grand Resort",
    isFavorite: true,
  },
  {
    id: "hotel-2",
    name: "James Wilson",
    role: "Front Desk",
    category: "Hospitality",
    status: "online",
    avatar: "JW",
    phone: "+1-555-0124",
    location: "Grand Resort",
    isFavorite: false,
  },
  // Medical (combined Public and Private EMS)
  {
    id: "medical-1",
    name: "Dr. Carlos Rodriguez",
    role: "Paramedic",
    category: "Medical",
    status: "online",
    avatar: "CR",
    phone: "+52-998-123-4567",
    location: "Emergency Services",
    isFavorite: true,
  },
  {
    id: "medical-2",
    name: "Ana Gutierrez",
    role: "EMT",
    category: "Medical",
    status: "offline",
    avatar: "AG",
    phone: "+52-998-123-4568",
    location: "Emergency Services",
    isFavorite: false,
  },
  {
    id: "medical-3",
    name: "Dr. Sarah Chen",
    role: "Emergency Physician",
    category: "Medical",
    status: "online",
    avatar: "SC",
    phone: "+52-998-987-6543",
    location: "Medical Center",
    isFavorite: true,
  },
  {
    id: "medical-4",
    name: "Dr. Miguel Torres",
    role: "General Practitioner",
    category: "Medical",
    status: "online",
    avatar: "MT",
    phone: "+52-998-987-6544",
    location: "Plaza Clinic",
    isFavorite: false,
  },
  // Tour
  {
    id: "tour-1",
    name: "Roberto Mendez",
    role: "Tour Guide",
    category: "Tour",
    status: "online",
    avatar: "RM",
    phone: "+52-998-555-7890",
    location: "Adventure Tours",
    isFavorite: false,
  },
  {
    id: "tour-2",
    name: "Sofia Martinez",
    role: "Tour Coordinator",
    category: "Tour",
    status: "online",
    avatar: "SM",
    phone: "+52-998-555-7891",
    location: "Coastal Excursions",
    isFavorite: true,
  },
]

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "Medical":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    case "Hospitality":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    case "Tour":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export default function ContactsPage() {
  const router = useRouter()

  const [userActiveStatus, setUserActiveStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userActiveStatus")
      return stored ? JSON.parse(stored) : true
    }
    return true
  })

  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all") // Added filter option
  const [showProfilePopout, setShowProfilePopout] = useState(false)
  const [profileTab, setProfileTab] = useState<"my-code" | "scan-code">("my-code")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [showAddContactModal, setShowAddContactModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode")
      if (stored) return JSON.parse(stored)
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return true
  })
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [newContact, setNewContact] = useState({
    name: "",
    role: "",
    category: "Hospitality",
    phone: "",
    location: "",
  })
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formError, setFormError] = useState("")
  const [expandedContacts, setExpandedContacts] = useState<Set<string>>(new Set()) // Track expanded contacts instead of categories

  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("userActiveStatus")
        if (stored) {
          setUserActiveStatus(JSON.parse(stored))
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", isDarkMode)
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
    }
  }, [isDarkMode])

  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setContacts(mockContacts)
      setIsLoading(false)
    }
    loadContacts()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true)
      const searchTimeout = setTimeout(() => {
        setIsSearching(false)
      }, 800)
      return () => clearTimeout(searchTimeout)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen])

  const navigateToHome = () => {
    router.push("/")
  }

  const navigateToActiveCases = () => {
    router.push("/?view=active")
  }

  const navigateToCompletedCases = () => {
    router.push("/?view=completed")
  }

  const navigateToContacts = () => {
    // Already on contacts page
  }

  const navigateToTrainSosa = () => {
    router.push("/demo?view=train-sosa")
  }

  const navigateToCertification = () => {
    router.push("/demo?view=certification")
  }

  const navigateToSettings = () => {
    router.push("/dashboard/settings")
  }

  const selectCase = (caseId: string) => {
    router.push(`/?case=${caseId}`)
  }

  const setViewState = (view: string) => {
    // Handle view state changes if needed
  }

  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name))

  const filteredContacts = sortedContacts.filter((contact) => {
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

  const handleMessageContact = (contact: Contact) => {
    // Create a new case with this contact
    const newCase = {
      id: `case-${Date.now()}`,
      title: `Chat with ${contact.name}`,
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: Date.now(),
          content: `Hi ${contact.name}, I need assistance.`,
          sender: "Tourist",
          role: "tourist",
          timestamp: new Date().toISOString(),
          status: "sent" as const,
        },
        {
          id: Date.now() + 1,
          content: `Hello! I'm ${contact.name}, ${contact.role}. How can I help you today?`,
          sender: contact.name,
          role: contact.role.toLowerCase().replace(/\s+/g, "_"),
          timestamp: new Date().toISOString(),
          status: "delivered" as const,
        },
      ],
      status: "active" as const,
      unreadCount: 0,
      participants: [contact.id],
      createdBy: "tourist-001",
    }

    // Store the new case in localStorage for the main app to pick up
    const existingCases = JSON.parse(localStorage.getItem("demo-cases") || "[]")
    const updatedCases = [newCase, ...existingCases]
    localStorage.setItem("demo-cases", JSON.stringify(updatedCases))
    localStorage.setItem("demo-selected-case", newCase.id)

    // Navigate to main app
    router.push("/")
  }

  const handleCreateCase = (contact: Contact) => {
    // Create an emergency case with this contact
    const emergencyTypes = [
      "Medical Emergency",
      "Tourist Assistance",
      "Translation Needed",
      "Hotel Issue",
      "Transportation Help",
    ]
    const randomType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)]

    const newCase = {
      id: `case-${Date.now()}`,
      title: `${randomType} - ${contact.name}`,
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: Date.now(),
          content: `New ${randomType.toLowerCase()} case created. ${contact.name} has been notified.`,
          sender: "System",
          role: "system",
          timestamp: new Date().toISOString(),
          status: "delivered" as const,
        },
        {
          id: Date.now() + 1,
          content: `I've received the case notification. I'm ${contact.name}, ${contact.role}. What's the situation?`,
          sender: contact.name,
          role: contact.role.toLowerCase().replace(/\s+/g, "_"),
          timestamp: new Date().toISOString(),
          status: "delivered" as const,
        },
      ],
      status: "active" as const,
      unreadCount: 1,
      participants: [contact.id],
      createdBy: "tourist-001",
      priority: Math.random() > 0.5 ? "urgent" : "routine",
    }

    // Store the new case
    const existingCases = JSON.parse(localStorage.getItem("demo-cases") || "[]")
    const updatedCases = [newCase, ...existingCases]
    localStorage.setItem("demo-cases", JSON.stringify(updatedCases))
    localStorage.setItem("demo-selected-case", newCase.id)

    // Navigate to main app
    router.push("/")
  }

  const handleCallContact = (contact: Contact) => {
    window.open(`tel:${contact.phone.replace(/\s/g, "")}`, "_self")
  }

  const handleAddContact = () => {
    if (!newContact.name || !newContact.role || !newContact.phone) {
      setFormError("Please fill in all required fields.")
      return
    }

    const contact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      role: newContact.role,
      category: newContact.category,
      status: "online",
      avatar: newContact.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      phone: newContact.phone,
      location: newContact.location || "Unknown",
      isFavorite: false,
    }

    setContacts((prev) => [contact, ...prev])
    setShowAddContactModal(false)
    setNewContact({
      name: "",
      role: "",
      category: "Hospitality",
      phone: "",
      location: "",
    })
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setNewContact({
      name: contact.name,
      role: contact.role,
      category: contact.category,
      phone: contact.phone,
      location: contact.location,
    })
    setShowAddContactModal(true)
  }

  const handleUpdateContact = () => {
    if (!newContact.name || !newContact.role || !newContact.phone || !editingContact) {
      setFormError("Please fill in all required fields.")
      return
    }

    const updatedContact: Contact = {
      ...editingContact,
      name: newContact.name,
      role: newContact.role,
      category: newContact.category,
      phone: newContact.phone,
      location: newContact.location || "Unknown",
      avatar: newContact.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    }

    setContacts((prev) => prev.map((c) => (c.id === editingContact.id ? updatedContact : c)))
    setShowAddContactModal(false)
    setEditingContact(null)
    setNewContact({
      name: "",
      role: "",
      category: "Hospitality",
      phone: "",
      location: "",
    })
  }

  const toggleContactExpansion = (contactId: string) => {
    const newExpanded = new Set(expandedContacts)
    if (newExpanded.has(contactId)) {
      newExpanded.delete(contactId)
    } else {
      newExpanded.add(contactId)
    }
    setExpandedContacts(newExpanded)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        sidebarOpen={sidebarOpen}
        sidebarRef={sidebarRef}
        viewState="CONTACTS"
        cases={[]}
        searchQuery=""
        navigateToActiveCases={navigateToActiveCases}
        navigateToCompletedCases={navigateToCompletedCases}
        navigateToContacts={navigateToContacts}
        navigateToTrainSosa={navigateToTrainSosa}
        navigateToCertification={navigateToCertification}
        setSidebarOpen={setSidebarOpen}
        selectCase={selectCase}
        setViewState={setViewState}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        userActiveStatus={userActiveStatus}
        setUserActiveStatus={setUserActiveStatus}
      />

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

      <Header
        setSidebarOpen={setSidebarOpen}
        navigateToHome={navigateToHome}
        setShowProfilePopout={setShowProfilePopout}
        currentCase={undefined}
        setShowAddPeople={() => {}}
        showNotifications={false}
        showMyId={true}
        showSearch={false}
        showCallButtons={false}
      />

      <div className="p-3 md:p-6">
        <div className="mb-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-sm">
          Preview mode — contact management will be connected in a future update.
        </div>
        <div className="mb-4">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">Contacts</h1>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="btn-primary-gradient px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 premium-hover text-white"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <StandardInput
                  variant="search"
                  placeholder="Search by name, role, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  showIcons={false}
                  className="w-full"
                />
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[120px]"
              >
                <option value="all">All Contacts</option>
                <option value="favorites">Favorites</option>
                <option value="online">Online</option>
                <option value="medical">Medical</option>
                <option value="hospitality">Hospitality</option>
                <option value="tour">Tour</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContactSkeleton key={i} />
            ))}
          </div>
        ) : isSearching ? (
          <SearchLoadingState />
        ) : (
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="glass-card rounded-lg border border-border/50 overflow-hidden">
                <div className="p-3 flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {contact.avatar || contact.name.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                        contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                      {contact.isFavorite && (
                        <svg className="w-3 h-3 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryBadge(contact.category)}`}
                      >
                        {contact.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleMessageContact(contact)}
                      className="p-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleContactExpansion(contact.id)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedContacts.has(contact.id) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {expandedContacts.has(contact.id) && (
                  <div className="border-t border-border/30 p-3 bg-muted/20">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[60px]">Category:</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryBadge(contact.category)}`}
                        >
                          {contact.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[60px]">Phone:</span>
                        <span className="text-foreground">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[60px]">Location:</span>
                        <span className="text-foreground">{contact.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[60px]">Status:</span>
                        <span
                          className={`text-sm font-medium ${contact.status === "online" ? "text-green-600" : "text-gray-500"}`}
                        >
                          {contact.status === "online" ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="flex-1 px-3 py-2 text-xs bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCallContact(contact)}
                        className="flex-1 px-3 py-2 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                      >
                        Call
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isSearching && filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No contacts found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or add new contacts</p>
            <button
              onClick={() => setShowAddContactModal(true)}
              className="btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 premium-hover text-white"
            >
              Add First Contact
            </button>
          </div>
        )}

        {showAddContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg glass-card border border-border/50 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold gradient-text">
                    {editingContact ? "Edit Contact" : "Add New Contact"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddContactModal(false)
                      setEditingContact(null)
                      setNewContact({
                        name: "",
                        role: "",
                        category: "Hospitality",
                        phone: "",
                        location: "",
                      })
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {formError && (
                  <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Name *</label>
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) => { setFormError(""); setNewContact((prev) => ({ ...prev, name: e.target.value })) }}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Role *</label>
                    <input
                      type="text"
                      value={newContact.role}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. Hotel Manager, Doctor, Tour Guide"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Category</label>
                    <select
                      value={newContact.category}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="Medical">Medical</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Tour">Tour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Phone *</label>
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="+1-555-0123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Location</label>
                    <input
                      type="text"
                      value={newContact.location}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. Grand Resort, Medical Center"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddContactModal(false)
                      setEditingContact(null)
                      setNewContact({
                        name: "",
                        role: "",
                        category: "Hospitality",
                        phone: "",
                        location: "",
                      })
                    }}
                    className="flex-1 px-4 py-2 rounded-lg glass-card text-muted-foreground text-sm font-medium hover:bg-muted/70 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingContact ? handleUpdateContact : handleAddContact}
                    className="flex-1 px-4 py-2 text-sm btn-primary-gradient rounded-lg transition-all duration-300 premium-hover text-white"
                  >
                    {editingContact ? "Update Contact" : "Add Contact"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ProfilePopout
          showProfilePopout={showProfilePopout}
          setShowProfilePopout={setShowProfilePopout}
          profileTab={profileTab}
          setProfileTab={setProfileTab}
        />
      </div>
    </div>
  )
}
