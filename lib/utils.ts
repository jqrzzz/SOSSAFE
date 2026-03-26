import type { Case, Contact } from "./types"

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60)
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

export const generateCaseId = () => {
  return `CASE-${Date.now().toString().slice(-6)}`
}

export const createNewCase = (caseId: string): Case => {
  return {
    id: caseId,
    timestamp: new Date().toLocaleString(),
    messages: [],
    title: `Emergency ${caseId}`,
    status: "active",
    unreadCount: 0,
  }
}

export const getReactionEmojis = () => [
  { emoji: "✅", label: "Confirmed" },
  { emoji: "👍", label: "Understood" },
  { emoji: "❤️", label: "Support" },
  { emoji: "🚨", label: "Urgent" },
  { emoji: "👀", label: "Reviewing" },
  { emoji: "⚡", label: "Action Needed" },
]

export const filterCasesByStatus = (cases: Case[], status: string, searchQuery: string) => {
  return cases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (status === "active") {
      return matchesSearch && case_.status === "active"
    } else if (status === "completed") {
      return matchesSearch && case_.status === "completed"
    }
    return matchesSearch
  })
}

export const filterContacts = (contacts: Contact[], searchQuery: string) => {
  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )
}

export const groupContactsByCategory = (contacts: Contact[]) => {
  return contacts.reduce(
    (groups, contact) => {
      const category = contact.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(contact)
      return groups
    },
    {} as Record<string, Contact[]>,
  )
}

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ")
}

export const getRoleStyle = (role: string) => {
  if (!role) {
    return {
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
      avatar: "U",
      roleLabel: "User",
    }
  }

  switch (role.toLowerCase()) {
    case "hotel":
      return {
        bgColor: "bg-[var(--hotel-color)]",
        textColor: "text-white",
        avatar: "H",
        roleLabel: "Hotel",
      }
    case "ems":
      return {
        bgColor: "bg-[var(--ems-color)]",
        textColor: "text-white",
        avatar: "E",
        roleLabel: "EMS",
      }
    case "clinic":
      return {
        bgColor: "bg-[var(--clinic-color)]",
        textColor: "text-white",
        avatar: "C",
        roleLabel: "Clinic",
      }
    case "tourist":
      return {
        bgColor: "bg-[var(--tourist-color)]",
        textColor: "text-white",
        avatar: "T",
        roleLabel: "Tourist",
      }
    case "translator":
      return {
        bgColor: "bg-[var(--translator-color)]",
        textColor: "text-white",
        avatar: "🌐",
        roleLabel: "Translator",
      }
    case "system":
      return {
        bgColor: "bg-[var(--system-color)]",
        textColor: "text-white",
        avatar: "S",
        roleLabel: "System",
      }
    default:
      return {
        bgColor: "bg-muted",
        textColor: "text-muted-foreground",
        avatar: "U",
        roleLabel: "User",
      }
  }
}
