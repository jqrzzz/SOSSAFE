export interface Message {
  id: string | number
  text?: string
  content?: string
  sender?: string
  role?: string
  timestamp: string
  type?: string
  images?: string[]
  status?: "sending" | "sent" | "delivered" | "read" | "failed"
  replyTo?: any
  isEdited?: boolean
  editHistory?: string[]
  threadId?: string
  threadDepth?: number
  replyCount?: number
  files?: Array<{ name: string; size: string; url?: string }>
}

export interface Case {
  id: string
  title: string
  timestamp: string
  messages: Message[]
  status: "active" | "completed"
  unreadCount: number
  participants?: string[] // Array of contact IDs
  createdBy?: string // Contact ID of the person who created the case
}

export interface Contact {
  id: string
  name: string
  role: string
  category: string
  status: "online" | "offline" | "away" | "busy"
  isFavorite: boolean
  avatar?: string
  phone?: string
  location?: string
  lastSeen?: string
  isTyping?: boolean
}

export type SidebarView = "main" | "settings"
