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
  reactions?: Array<{ emoji: string; users: string[] }> | Record<string, string[]>
  attachments?: any[]
  location?: { lat?: number; lng?: number; latitude?: number; longitude?: number; name?: string; address?: string }
  voiceMessage?: { duration: number; url: string }
}

export interface Case {
  id: string
  title: string
  timestamp: string
  messages: Message[]
  status: "active" | "completed"
  unreadCount: number
  participants?: string[]
  createdBy?: string
  priority?: string
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
