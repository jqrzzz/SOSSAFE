"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { generateCaseId } from "../../lib/utils"
import type { Case, SidebarView } from "../../lib/types"
import { mockCases, mockContacts } from "../../lib/data"
import { useMessages } from "../../hooks/useMessages"
import { useUI } from "../../hooks/useUI"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { ProfilePopout } from "@/components/ProfilePopout"
import { AddPeopleModal } from "@/components/AddPeopleModal"
import { IncomingCallModal } from "@/components/IncomingCallModal"
import { ActiveCallOverlay } from "@/components/ActiveCallOverlay"
import { VoiceRecorder } from "@/components/VoiceRecorder"
import { NetworkStatus } from "@/components/NetworkStatus"
import { CaseView } from "@/components/CaseView"
import { MessageInput } from "@/components/MessageInput"
import { NotificationsDrawer } from "@/components/NotificationsDrawer"
import { ChatIcon } from "@/components/icons" // Fixed import to use named import from icons
import { MessageBubble } from "@/components/MessageBubble"

type ViewState =
  | "HOME"
  | "ACTIVE_CASES"
  | "COMPLETED_CASES"
  | "CHAT"
  | "MY_SOS"
  | "TRAIN_SOSA"
  | "CERTIFICATION"
  | "PERSONAL_CHAT" // Added PERSONAL_CHAT view state
  | "CONTACTS" // Added CONTACTS view state
  | "SETTINGS" // Added SETTINGS view state

export default function DemoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    message,
    setMessage,
    attachedImages,
    setAttachedImages,
    // replyingTo, setReplyingTo, // These are now managed locally
    // pinnedMessages, setPinnedMessages, // These are now managed locally
    // messageReactions, setMessageReactions, // These are now managed locally
    searchQuery,
    setSearchQuery,
    searchResults,
    performSearch,
    clearSearch,
  } = useMessages()

  const {
    sidebarOpen,
    setSidebarOpen,
    cameraModalOpen,
    setCameraModalOpen,
    showAddPeople,
    setShowAddPeople,
    isDarkMode,
    setIsDarkMode,
  } = useUI()

  const [cases, setCases] = useState<Case[]>(mockCases)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [sidebarView, setSidebarView] = useState<SidebarView>("main")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [viewState, setViewState] = useState<ViewState>("HOME")
  const [showSettings, setShowSettings] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [showProfilePopout, setShowProfilePopout] = useState(false)
  const [profileTab, setProfileTab] = useState<"my-code" | "scan-code">("my-code")
  const [showParticipants, setShowParticipants] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string; type: string; id: string }>>(
    [],
  )

  const [showIncomingCall, setShowIncomingCall] = useState(false)
  const [showActiveCall, setShowActiveCall] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [currentCallType, setCurrentCallType] = useState<"voice" | "video">("voice")
  const [callerName, setCallerName] = useState("")

  const [isLoadingCases, setIsLoadingCases] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const [messageError, setMessageError] = useState<string | null>(null)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [userRole, setUserRole] = useState<"hospitality" | "medical" | "tour_operator" | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [currentSurvey, setCurrentSurvey] = useState<"facility" | "preparedness" | "communication">("facility")
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([])

  const [showNotifications, setShowNotifications] = useState(false)
  const [personalChatMessages, setPersonalChatMessages] = useState<any[]>([]) // Added state for personal chat messages

  const [pinnedMessages, setPinnedMessages] = useState<Set<string | number>>(new Set())
  const [messageReactions, setMessageReactions] = useState<Record<string | number, Record<string, string[]>>>({})
  const [replyingTo, setReplyingTo] = useState<any>(null)

  const facilityQuestions = {
    hospitality: [
      {
        id: 0,
        question: "What type of property do you manage?",
        options: ["Hotel", "Hostel", "Resort", "Vacation Rental", "Other"],
      },
      {
        id: 1,
        question: "Do you have a defibrillator on-site?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        id: 2,
        question: "How many staff members on duty during peak hours?",
        options: ["1-3", "4-10", "11-20", "20+"],
      },
      {
        id: 3,
        question: "What languages does your staff speak?",
        options: ["English only", "English + 1 other", "English + 2-3 others", "Multilingual (4+)"],
      },
      {
        id: 4,
        question: "What's the nearest hospital distance?",
        options: ["Less than 5 min", "5-15 min", "15-30 min", "30+ min"],
      },
      {
        id: 5,
        question: "Do you have first aid trained staff?",
        options: ["Yes, certified", "Yes, basic training", "No", "Planning to train"],
      },
    ],
    medical: [
      {
        id: 0,
        question: "What type of medical facility do you work at?",
        options: ["Hospital", "Clinic", "Private Practice", "Urgent Care", "Other"],
      },
      {
        id: 1,
        question: "Do you have emergency services available?",
        options: ["Yes, 24/7", "Yes, limited hours", "No", "Referral only"],
      },
      {
        id: 2,
        question: "What equipment do you have available?",
        options: ["Full emergency equipment", "Basic equipment", "Limited equipment", "Diagnostic only"],
      },
      {
        id: 3,
        question: "Do you have translator or language support?",
        options: ["Yes, multiple languages", "Yes, limited", "No", "Phone translation service"],
      },
      {
        id: 4,
        question: "What are your operating hours?",
        options: ["24/7", "Extended hours", "Business hours only", "By appointment"],
      },
      {
        id: 5,
        question: "Do you accept international insurance?",
        options: ["Yes, most providers", "Yes, some providers", "No", "Cash only"],
      },
    ],
    tour_operator: [
      {
        id: 0,
        question: "What type of tours do you operate?",
        options: ["Adventure", "Cultural", "City tours", "Multi-day", "Mixed"],
      },
      {
        id: 1,
        question: "What's your average group size?",
        options: ["1-5 people", "6-15 people", "16-30 people", "30+ people"],
      },
      {
        id: 2,
        question: "Do you carry first aid kits on tours?",
        options: ["Yes, comprehensive", "Yes, basic", "No", "Planning to"],
      },
      {
        id: 3,
        question: "What regions do you operate in?",
        options: ["Urban areas", "Rural areas", "Remote areas", "Mixed"],
      },
      {
        id: 4,
        question: "Do you have emergency protocols in place?",
        options: ["Yes, documented", "Yes, informal", "No", "In development"],
      },
      {
        id: 5,
        question: "Are your guides trained in first aid?",
        options: ["Yes, all certified", "Yes, some certified", "No", "Planning training"],
      },
    ],
  }

  const preparednessQuestions = {
    hospitality: [
      {
        id: 0,
        question: "Do you have documented emergency procedures?",
        options: ["Yes, comprehensive", "Yes, basic", "No", "In development"],
      },
      {
        id: 1,
        question: "How often do you conduct emergency drills?",
        options: ["Monthly", "Quarterly", "Annually", "Never"],
      },
      {
        id: 2,
        question: "Do you have emergency contact lists posted?",
        options: ["Yes, multiple locations", "Yes, one location", "No", "Digital only"],
      },
      {
        id: 3,
        question: "Are emergency exits clearly marked?",
        options: ["Yes, all exits", "Yes, most exits", "Some exits", "No"],
      },
    ],
    medical: [
      {
        id: 0,
        question: "Do you have protocols for tourist emergencies?",
        options: ["Yes, specific protocols", "Yes, general protocols", "No", "In development"],
      },
      {
        id: 1,
        question: "How do you handle language barriers?",
        options: ["Professional translators", "Translation apps", "Staff multilingual", "Limited support"],
      },
      {
        id: 2,
        question: "Do you have travel insurance verification process?",
        options: ["Yes, automated", "Yes, manual", "No", "Case by case"],
      },
      {
        id: 3,
        question: "Can you provide medical documentation in English?",
        options: ["Yes, always", "Yes, upon request", "Limited", "No"],
      },
    ],
    tour_operator: [
      {
        id: 0,
        question: "Do you have emergency communication devices?",
        options: ["Satellite phones", "Two-way radios", "Mobile phones only", "No"],
      },
      {
        id: 1,
        question: "Are emergency contacts shared with participants?",
        options: ["Yes, always", "Yes, upon request", "Sometimes", "No"],
      },
      {
        id: 2,
        question: "Do you have evacuation plans for remote areas?",
        options: ["Yes, detailed", "Yes, basic", "No", "Not applicable"],
      },
      {
        id: 3,
        question: "How do you track participant medical information?",
        options: ["Digital system", "Paper forms", "Verbal only", "Don't track"],
      },
    ],
  }

  const communicationQuestions = {
    hospitality: [
      {
        id: 0,
        question: "How do guests report emergencies?",
        options: ["Multiple channels", "Phone only", "In-person only", "No clear system"],
      },
      {
        id: 1,
        question: "Do you provide emergency information in multiple languages?",
        options: ["Yes, 5+ languages", "Yes, 2-4 languages", "English only", "No"],
      },
      {
        id: 2,
        question: "How quickly can you reach emergency services?",
        options: ["Immediate", "Within 5 minutes", "Within 15 minutes", "Varies"],
      },
      {
        id: 3,
        question: "Do you have 24/7 staff availability?",
        options: ["Yes, always", "Yes, on-call", "Limited hours", "No"],
      },
    ],
    medical: [
      {
        id: 0,
        question: "How do tourists typically find your facility?",
        options: ["Emergency referral", "Hotel referral", "Online search", "Walk-in"],
      },
      {
        id: 1,
        question: "Do you provide cost estimates upfront?",
        options: ["Yes, always", "Yes, upon request", "After treatment", "No"],
      },
      {
        id: 2,
        question: "Can you communicate with embassies/consulates?",
        options: ["Yes, established contacts", "Yes, as needed", "Limited", "No"],
      },
      {
        id: 3,
        question: "Do you provide follow-up care instructions?",
        options: ["Yes, written + verbal", "Yes, verbal only", "Limited", "No"],
      },
    ],
    tour_operator: [
      {
        id: 0,
        question: "How do you brief participants on safety?",
        options: ["Detailed briefing", "Basic briefing", "Written materials only", "No briefing"],
      },
      {
        id: 1,
        question: "Do you have insurance for participants?",
        options: ["Yes, comprehensive", "Yes, basic", "Optional add-on", "No"],
      },
      {
        id: 2,
        question: "How do you handle participant concerns?",
        options: ["Dedicated support", "Guide handles", "Case by case", "Limited support"],
      },
      {
        id: 3,
        question: "Do you provide emergency contact cards?",
        options: ["Yes, always", "Yes, upon request", "Sometimes", "No"],
      },
    ],
  }

  const getCurrentSurveyQuestions = () => {
    const role = userRole || "hospitality"
    switch (currentSurvey) {
      case "facility":
        return facilityQuestions[role]
      case "preparedness":
        return preparednessQuestions[role]
      case "communication":
        return communicationQuestions[role]
      default:
        return facilityQuestions[role]
    }
  }

  const trainingQuestions = getCurrentSurveyQuestions()

  const getSurveyTitle = () => {
    switch (currentSurvey) {
      case "facility":
        return "Facility Information"
      case "preparedness":
        return "Emergency Preparedness"
      case "communication":
        return "Communication & Support"
      default:
        return "Training Survey"
    }
  }

  const getRoleDisplayName = () => {
    switch (userRole) {
      case "hospitality":
        return "hospitality"
      case "medical":
        return "medical"
      case "tour_operator":
        return "tour operations"
      default:
        return "your field"
    }
  }

  const getRoleContext = () => {
    switch (userRole) {
      case "hospitality":
        return "property"
      case "medical":
        return "facility"
      case "tour_operator":
        return "tours"
      default:
        return "work"
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const currentCase = cases.find((c) => c.id === selectedCaseId)
  const messages = currentCase?.messages || []
  const caseParticipants = currentCase?.participants || []

  const handleVoiceCall = () => {
    if (!currentCase) return
    setCurrentCallType("voice")
    setCallerName("Emergency Team")
    setShowActiveCall(true)
    console.log("[v0] Starting voice call for case:", currentCase.id)
  }

  const handleVideoCall = () => {
    if (!currentCase) return
    setCurrentCallType("video")
    setCallerName("Emergency Team")
    setShowActiveCall(true)
    console.log("[v0] Starting video call for case:", currentCase.id)
  }

  const handleEndCall = () => {
    setShowActiveCall(false)
    setShowIncomingCall(false)
    console.log("[v0] Call ended")
  }

  const handleAcceptCall = () => {
    setShowIncomingCall(false)
    setShowActiveCall(true)
    console.log("[v0] Call accepted")
  }

  const handleDeclineCall = () => {
    setShowIncomingCall(false)
    console.log("[v0] Call declined")
  }

  const handleVoiceRecorderSend = (duration: number) => {
    if (!selectedCaseId) return

    const voiceMessage = {
      id: Date.now(),
      role: "user",
      content: `🎤 Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")})`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      isVoiceMessage: true,
      duration: duration,
    }

    setCases((prev) =>
      prev.map((c) => (c.id === selectedCaseId ? { ...c, messages: [...c.messages, voiceMessage] } : c)),
    )

    console.log("[v0] Voice message sent:", duration, "seconds")
  }

  const handleSearch = (query: string) => {
    performSearch(query, cases, mockContacts)
  }

  const handleSelectCase = (caseId: string) => {
    selectCase(caseId)
    clearSearch()
  }

  const handleSelectContact = (contactId: string) => {
    navigateToContacts()
    clearSearch()
  }

  const startNewCase = (initialMessage?: string, contactId?: string): string => {
    const messageText = typeof initialMessage === "string" && initialMessage.trim() ? initialMessage.trim() : ""

    const newCase: Case = {
      id: generateCaseId(),
      title: messageText ? `Emergency: ${messageText.substring(0, 30)}...` : "New Emergency Case",
      timestamp: new Date().toISOString(),
      messages: messageText
        ? [
            {
              id: Date.now(),
              content: messageText,
              sender: "Tourist",
              role: "tourist",
              timestamp: new Date().toISOString(),
              status: "sent",
            },
          ]
        : [],
      status: "active" as const,
      unreadCount: 0,
      participants: contactId ? [contactId] : [],
      createdBy: "tourist-001",
    }

    setCases((prev) => [newCase, ...prev])
    setSelectedCaseId(newCase.id)
    setViewState("CHAT")
    setMessage("")

    return newCase.id
  }

  const handleSendMessage = async () => {
    if (!message.trim() && attachedImages.length === 0 && attachedFiles.length === 0) {
      setFormErrors({ message: "Please enter a message or attach a file" })
      return
    }

    setFormErrors({})
    setMessageError(null)

    if (!selectedCaseId) {
      startNewCase()
      return
    }

    setIsSendingMessage(true)

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      images: attachedImages,
      files: attachedFiles,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending" as const,
      replyTo: replyingTo,
    }

    setCases((prev) => prev.map((c) => (c.id === selectedCaseId ? { ...c, messages: [...c.messages, newMessage] } : c)))

    setMessage("")
    setAttachedFiles([])
    setReplyingTo(null)

    setTimeout(() => {
      const shouldFail = Math.random() < 0.1 // 10% chance of failure for demo

      if (shouldFail) {
        setCases((prev) =>
          prev.map((c) =>
            c.id === selectedCaseId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === newMessage.id ? { ...m, status: "failed" } : m)),
                }
              : c,
          ),
        )
        setMessageError("Failed to send message. Please check your connection and try again.")
        setIsSendingMessage(false)
        return
      }

      setCases((prev) =>
        prev.map((c) =>
          c.id === selectedCaseId
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === newMessage.id ? { ...m, status: "sent" } : m)),
              }
            : c,
        ),
      )
      setIsSendingMessage(false)

      setIsLoadingMessages(true)
      setTimeout(() => {
        setIsLoadingMessages(false)
        const aiResponse = {
          id: Date.now() + 1,
          role: "ai",
          content:
            "I understand you need emergency assistance. Please provide: Patient location, current condition, and any immediate concerns.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "delivered",
        }

        setCases((prev) =>
          prev.map((c) => (c.id === selectedCaseId ? { ...c, messages: [...c.messages, aiResponse] } : c)),
        )
      }, 1500)
    }, 1500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setFileUploadError(null)
    setIsUploadingFile(true)

    Array.from(files).forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setFileUploadError(`File "${file.name}" is too large. Maximum size is 10MB.`)
        setIsUploadingFile(false)
        return
      }

      const fileId = `${Date.now()}-${index}`
      const fileSize =
        file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

      const fileData = {
        name: file.name,
        size: fileSize,
        type: file.type,
        id: fileId,
      }

      setAttachedFiles((prev) => [...prev, fileData])
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const currentProgress = prev[fileId] || 0
          const shouldFail = currentProgress > 50 && Math.random() < 0.05 // 5% chance of failure after 50%

          if (shouldFail) {
            clearInterval(progressInterval)
            setFileUploadError(`Failed to upload "${file.name}". Please try again.`)
            setAttachedFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId))
            return prev
          }

          if (currentProgress >= 100) {
            clearInterval(progressInterval)
            return prev
          }
          return { ...prev, [fileId]: Math.min(currentProgress + 10, 100) }
        })
      }, 200)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setTimeout(() => {
      setIsUploadingFile(false)
      setUploadProgress({})
    }, 2500)
  }

  const handleLocationClick = () => {
    if (!selectedCaseId || !currentCase) return

    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Location services are not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const locationMessage = {
          id: Date.now(),
          role: "user",
          content: `📍 Current Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "sent",
          isLocation: true,
          location: {
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, // Assuming address is derived or available
            latitude: latitude,
            longitude: longitude,
          },
        }

        setCases((prev) =>
          prev.map((c) => (c.id === selectedCaseId ? { ...c, messages: [...c.messages, locationMessage] } : c)),
        )

        console.log("[v0] Location shared:", { latitude, longitude })
      },
      (error) => {
        let errorMessage = "Failed to get your location. "
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and try again."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out."
            break
          default:
            errorMessage += "Please try again."
            break
        }
        setLocationError(errorMessage)
        console.log("[v0] Location error:", error.message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const retryMessage = () => {
    setMessageError(null)
    handleSendMessage()
  }

  const retryFileUpload = () => {
    setFileUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const retryLocation = () => {
    setLocationError(null)
    handleLocationClick()
  }

  const handleMicClick = () => {
    setShowVoiceRecorder(true)
    console.log("[v0] Opening voice recorder")
  }

  const selectCase = (caseId: string) => {
    setSelectedCaseId(caseId)
    setViewState("CHAT")
    setSidebarOpen(false)
  }

  const navigateToHome = () => {
    setViewState("HOME")
    setSelectedCaseId(null)
  }

  const navigateToActiveCases = () => {
    setViewState("ACTIVE_CASES")
    setSelectedCaseId(null)
  }

  const navigateToCompletedCases = () => {
    setViewState("COMPLETED_CASES")
    setSelectedCaseId(null)
  }

  const navigateToContacts = () => {
    router.push("/contacts")
  }

  const navigateToView = (view: string) => {
    setViewState(view as ViewState)
    setSelectedCaseId(null)
  }

  // Added function to navigate to Train SOSA view
  const navigateToTrainSosa = () => {
    setViewState("TRAIN_SOSA")
    setSelectedCaseId(null)
  }

  const navigateToCertification = () => {
    setViewState("CERTIFICATION")
    setSelectedCaseId(null)
  }

  const navigateToPersonalChat = () => {
    setViewState("PERSONAL_CHAT")
    setSelectedCaseId(null)
  }

  const handleSendPersonalChatMessage = async () => {
    if (!message.trim()) {
      return
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setPersonalChatMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm SOSA, your AI assistant. I can help you with general questions, travel advice, local information, or just have a conversation. What would you like to know?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setPersonalChatMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const addParticipantToCase = (contactId: string) => {
    if (!selectedCaseId) return

    setCases((prev) =>
      prev.map((c) => (c.id === selectedCaseId ? { ...c, participants: [...(c.participants || []), contactId] } : c)),
    )
  }

  const addSelectedParticipants = () => {
    selectedContacts.forEach((contactId) => {
      addParticipantToCase(contactId)
    })
    setSelectedContacts([])
    setShowAddPeople(false)
  }

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const removeParticipantFromCase = (contactId: string) => {
    if (!selectedCaseId) return

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseId ? { ...c, participants: (c.participants || []).filter((id) => id !== contactId) } : c,
      ),
    )
  }

  const canRemoveParticipants = (caseItem: Case): boolean => {
    return caseItem.createdBy === "tourist-001"
  }

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddReaction = (messageId: string | number, emoji: string) => {
    setMessageReactions((prev) => {
      const msgReactions = prev[messageId] || {}
      const emojiUsers = msgReactions[emoji] || []
      const hasReacted = emojiUsers.includes("user")

      return {
        ...prev,
        [messageId]: {
          ...msgReactions,
          [emoji]: hasReacted ? emojiUsers.filter((u) => u !== "user") : [...emojiUsers, "user"],
        },
      }
    })
  }

  const handlePinMessage = (message: any) => {
    setPinnedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(message.id)) {
        newSet.delete(message.id)
      } else {
        newSet.add(message.id)
      }
      return newSet
    })
  }

  const handleReplyToMessage = (message: any) => {
    setReplyingTo(message)
    // Focus on message input
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  const handleForwardMessage = (message: any) => {
    // Forward functionality - could open a modal to select recipients
    console.log("[v0] Forward message:", message)
  }

  const handleRetryMessage = (messageId: string | number) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseId
          ? {
              ...c,
              messages: c.messages.map((m) => (m.id === messageId ? { ...m, status: "sending" } : m)),
            }
          : c,
      ),
    )

    // Simulate retry
    setTimeout(() => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === selectedCaseId
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === messageId ? { ...m, status: "sent" } : m)),
              }
            : c,
        ),
      )
    }, 1500)
  }

  const handleRefresh = async () => {
    console.log("[v0] Refreshing messages...")
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (selectedCaseId) {
      // Could fetch latest messages from server
      console.log("[v0] Messages refreshed for case:", selectedCaseId)
    }
  }

  const handleAnswerQuestion = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: selectedAnswer }))

    // Calculate progress
    const newProgress = Math.round(((currentQuestionIndex + 1) / trainingQuestions.length) * 100)
    setTrainingProgress(newProgress)

    // Clear selected answer
    setSelectedAnswer(null)

    // Move to next question or complete
    if (currentQuestionIndex < trainingQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
      }, 300)
    } else {
      // Mark survey as completed
      setCompletedSurveys((prev) => [...prev, currentSurvey])
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
      }, 300)
    }
  }

  const resetTraining = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTrainingProgress(0)
    setSelectedAnswer(null)
  }

  const startSurvey = (surveyType: "facility" | "preparedness" | "communication") => {
    setCurrentSurvey(surveyType)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTrainingProgress(0)
    setSelectedAnswer(null)
  }

  useEffect(() => {
    const view = searchParams.get("view")
    if (view) {
      const viewMap: Record<string, ViewState> = {
        "train-sosa": "TRAIN_SOSA",
        certification: "CERTIFICATION",
        "personal-chat": "PERSONAL_CHAT",
        "active-cases": "ACTIVE_CASES",
        "completed-cases": "COMPLETED_CASES",
        contacts: "CONTACTS",
        settings: "SETTINGS",
      }

      const mappedView = viewMap[view]
      if (mappedView) {
        setViewState(mappedView)
        setSidebarOpen(false)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as "hospitality" | "medical" | "tour_operator" | null
    if (storedRole) {
      setUserRole(storedRole)
    }
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen, setSidebarOpen])

  useEffect(() => {
    if (message.trim()) {
      const timer = setTimeout(() => {
        const possibleTypers = ["Hotel Staff", "EMS Team", "Clinic Nurse"]
        const randomTyper = possibleTypers[Math.floor(Math.random() * possibleTypers.length)]
        if (!typingUsers.includes(randomTyper)) {
          setTypingUsers((prev) => [...prev, randomTyper])
        }
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setTypingUsers([])
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [message, typingUsers])

  useEffect(() => {
    // Load demo cases from localStorage if available
    const demoCases = localStorage.getItem("demo-cases")
    const demoSelectedCase = localStorage.getItem("demo-selected-case")

    if (demoCases) {
      const parsedCases = JSON.parse(demoCases)
      setCases((prev) => {
        // Merge with existing cases, avoiding duplicates
        const existingIds = prev.map((c) => c.id)
        const newCases = parsedCases.filter((c: any) => !existingIds.includes(c.id))
        return [...newCases, ...prev]
      })

      if (demoSelectedCase) {
        setSelectedCaseId(demoSelectedCase)
        setViewState("CHAT")
        // Clear the localStorage after loading
        localStorage.removeItem("demo-cases")
        localStorage.removeItem("demo-selected-case")
      }
    }
  }, [])

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""} mobile-scroll`}>
      <NetworkStatus />

      {/* Demo Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center">
        <p className="text-sm text-primary font-medium">🚀 Demo Mode - Explore SOS SAFETY by Tourist SOS features</p>
      </div>

      <div className="ai-tech-border">
        <div className="flex h-screen overflow-hidden safe-area-left safe-area-right">
          <Sidebar
            sidebarOpen={sidebarOpen}
            sidebarRef={sidebarRef}
            viewState={viewState}
            cases={cases}
            searchQuery={searchQuery}
            navigateToActiveCases={navigateToActiveCases}
            navigateToCompletedCases={navigateToCompletedCases}
            navigateToContacts={navigateToContacts}
            navigateToTrainSosa={navigateToTrainSosa}
            navigateToCertification={navigateToCertification}
            navigateToPersonalChat={navigateToPersonalChat} // Added prop
            setSidebarOpen={setSidebarOpen}
            selectCase={selectCase}
            setViewState={setViewState}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

          <div className="flex-1 flex flex-col ai-content-border min-w-0">
            <Header
              setSidebarOpen={setSidebarOpen}
              navigateToHome={navigateToHome}
              setShowProfilePopout={setShowProfilePopout}
              currentCase={currentCase}
              setShowAddPeople={setShowAddPeople}
              showNotifications={viewState === "HOME"}
              showMyId={viewState === "HOME"}
              showSearch={viewState === "ACTIVE_CASES" || viewState === "COMPLETED_CASES"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              onSearch={handleSearch}
              onSelectCase={handleSelectCase}
              onSelectContact={handleSelectContact}
              onVoiceCall={handleVoiceCall}
              onVideoCall={handleVideoCall}
              showCallButtons={viewState === "CHAT"}
              setShowNotifications={setShowNotifications}
            />

            <div className="flex-1 overflow-hidden relative">
              {viewState === "HOME" && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border/50">
                    <div className="text-center mb-4">
                      <div className="flex flex-col items-center space-y-4">
                        <img
                          src="/sosa-avatar.png"
                          alt="SOSA Assistant Avatar"
                          className="w-32 sm:w-40 h-auto object-contain"
                        />
                        <h2 className="text-lg sm:text-xl font-medium text-foreground">
                          Hi, I'm SOSA. How may I help you?
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => startNewCase()}
                        className="glass-card px-4 py-2 rounded-full text-sm font-medium border border-border/50 hover:bg-primary/10 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        Create New Case
                      </button>
                      <button
                        onClick={navigateToActiveCases}
                        className="glass-card px-4 py-2 rounded-full text-sm font-medium border border-border/50 hover:bg-primary/10 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Past Cases
                      </button>
                      <button
                        onClick={navigateToContacts}
                        className="glass-card px-4 py-2 rounded-full text-sm font-medium border border-border/50 hover:bg-primary/10 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Contacts
                      </button>
                    </div>
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 overflow-y-auto p-4 pb-32 sm:pb-28">
                    <div className="max-w-3xl mx-auto space-y-4"></div>
                  </div>

                  <MessageInput
                    message={message}
                    setMessage={setMessage}
                    onSend={handleSendMessage}
                    onFileClick={handleFileClick}
                    onMicClick={handleMicClick}
                    disabled={isSendingMessage}
                  />
                </div>
              )}

              {viewState === "ACTIVE_CASES" && (
                <CaseView
                  cases={cases}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectCase={selectCase}
                  isLoading={isLoadingCases}
                  status="active"
                />
              )}

              {viewState === "COMPLETED_CASES" && (
                <CaseView
                  cases={cases}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectCase={selectCase}
                  isLoading={isLoadingCases}
                  status="completed"
                />
              )}

              {viewState === "CHAT" && (
                <div className="flex flex-col h-full">
                  {/* CHANGE: Show case messages when a case is selected, otherwise show welcome screen */}
                  {selectedCaseId && currentCase ? (
                    <>
                      {/* Header with case info */}
                      <div className="p-4 border-b border-border/50">
                        <div className="text-center">
                          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">{currentCase.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            {currentCase.status === "active" ? "Active Emergency" : "Completed Case"} •{" "}
                            {currentCase.participants?.length || 0} participants
                          </p>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 pb-32 sm:pb-28">
                        <div className="max-w-3xl mx-auto space-y-4">
                          {messages.map((msg: any) => (
                            <MessageBubble
                              key={msg.id}
                              message={msg}
                              isUser={msg.role === "user"}
                              isPinned={pinnedMessages.has(msg.id)}
                              messageReactions={messageReactions[msg.id] || {}}
                              onAddReaction={handleAddReaction}
                              onPin={handlePinMessage}
                              onReply={handleReplyToMessage}
                              onCopy={() => handleCopyText(msg.content)}
                              onForward={handleForwardMessage}
                              onRetry={handleRetryMessage}
                            />
                          ))}
                          {typingUsers.length > 0 && (
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                <img
                                  src="/sosa-avatar.png"
                                  alt="SOSA Avatar"
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-medium mb-1 text-muted-foreground">SOSA is typing...</div>
                                <div className="flex space-x-1">
                                  {typingUsers.map((typer, index) => (
                                    <span key={index} className="text-xs text-muted-foreground animate-pulse">
                                      {typer} is typing...
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message Input */}
                      <MessageInput
                        message={message}
                        setMessage={setMessage}
                        onSend={handleSendMessage}
                        onFileClick={handleFileClick}
                        onMicClick={handleMicClick}
                        disabled={isSendingMessage || isLoadingMessages}
                        attachedFiles={attachedFiles}
                        removeFile={removeFile}
                        uploadProgress={uploadProgress}
                        isUploadingFile={isUploadingFile}
                        fileUploadError={fileUploadError}
                        retryFileUpload={retryFileUpload}
                        messageError={messageError}
                        retryMessage={retryMessage}
                        locationError={locationError}
                        retryLocation={retryLocation}
                        onLocationClick={handleLocationClick}
                        replyingTo={replyingTo} // Pass replyingTo to MessageInput
                        setReplyingTo={setReplyingTo} // Pass setReplyingTo to MessageInput
                      />
                    </>
                  ) : (
                    <>
                      {/* Welcome screen when no case is selected */}
                      {/* Header with quick actions */}
                      <div className="p-4 border-b border-border/50">
                        <div className="text-center mb-4">
                          <h1 className="text-xl sm:text-2xl font-bold gradient-text mb-2">SOS SAFETY by Tourist SOS</h1>
                          <p className="text-sm text-muted-foreground">How can I help you with your emergency today?</p>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={() => startNewCase()}
                            className="glass-card px-4 py-2 rounded-full text-sm font-medium border border-border/50 hover:bg-primary/10 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            Create New Case
                          </button>
                          <button
                            onClick={navigateToActiveCases}
                            className="glass-card px-4 py-2 rounded-full text-sm font-medium border border-border/50 hover:bg-primary/10 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            Past Cases
                          </button>
                          <button
                            onClick={navigateToContacts}
                            className="glass-card px-4 py-2 rounded-full text-sm font-medium border border-border/50 hover:bg-primary/10 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Contacts
                          </button>
                          <button
                            onClick={navigateToTrainSosa}
                            className="glass-card px-4 py-2 rounded-full text-sm font-medium border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            Train SOSA
                          </button>
                        </div>
                      </div>

                      {/* Chat area */}
                      <div className="flex-1 overflow-y-auto p-4 pb-32 sm:pb-28">
                        <div className="max-w-3xl mx-auto space-y-4">
                          {/* Welcome message */}
                          <div className="glass-card p-4 rounded-lg border border-border/50">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-primary"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm mb-1">Tourist SOS Assistant</div>
                                <div className="text-sm text-muted-foreground">
                                  I'm here to help you with any emergency situation. You can:
                                  <ul className="mt-2 space-y-1 text-xs">
                                    <li>• Report a medical emergency</li>
                                    <li>• Get help with lost documents</li>
                                    <li>• Find nearby hospitals or clinics</li>
                                    <li>• Connect with local emergency services</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {viewState === "TRAIN_SOSA" && (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-4 border-b border-border/50">
                    <div className="text-center">
                      <h1 className="text-xl sm:text-2xl font-bold gradient-text mb-2">Train Your SOSA</h1>
                      <p className="text-sm text-muted-foreground">
                        Help SOSA learn about your {getRoleContext()} for better emergency responses
                      </p>
                    </div>
                  </div>

                  {/* Training Content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-2xl mx-auto">
                      {/* Role Confirmation */}
                      {!userRole && currentQuestionIndex === 0 && Object.keys(answers).length === 0 && (
                        <div className="glass-card p-6 rounded-2xl border border-border/50 mb-6">
                          <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Welcome to SOSA Training!</h2>
                          <p className="text-sm sm:text-base mb-4 text-center">
                            To help me provide the best assistance, please tell me your primary role:
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center mb-4">
                            <button
                              onClick={() => {
                                setUserRole("hospitality")
                                localStorage.setItem("userRole", "hospitality")
                              }}
                              className="px-6 py-2.5 rounded-full border border-border/50 hover:bg-background/80 transition-colors text-sm font-medium"
                            >
                              Hospitality
                            </button>
                            <button
                              onClick={() => {
                                setUserRole("medical")
                                localStorage.setItem("userRole", "medical")
                              }}
                              className="px-6 py-2.5 rounded-full border border-border/50 hover:bg-background/80 transition-colors text-sm font-medium"
                            >
                              Medical Professional
                            </button>
                            <button
                              onClick={() => {
                                setUserRole("tour_operator")
                                localStorage.setItem("userRole", "tour_operator")
                              }}
                              className="px-6 py-2.5 rounded-full border border-border/50 hover:bg-background/80 transition-colors text-sm font-medium"
                            >
                              Tour Operator
                            </button>
                          </div>
                          <div className="text-center">
                            <button
                              onClick={() => {
                                setUserRole("hospitality") // Default to hospitality
                                localStorage.setItem("userRole", "hospitality")
                              }}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                            >
                              Skip for now
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Role confirmation message if role is already set */}
                      {userRole && currentQuestionIndex === 0 && Object.keys(answers).length === 0 && (
                        <div className="glass-card p-6 rounded-2xl border border-border/50 mb-6 bg-primary/5">
                          <div className="flex items-start gap-4">
                            <img src="/sosa-avatar.png" alt="SOSA" className="w-12 h-12 object-contain flex-shrink-0" />
                            <div>
                              <p className="text-sm sm:text-base">
                                I see you're in{" "}
                                <span className="font-semibold text-primary">{getRoleDisplayName()}</span>. Let me learn
                                about your {getRoleContext()} so I can help you better during emergencies.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            SOSA's Knowledge: {trainingProgress}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Question {Math.min(currentQuestionIndex + 1, trainingQuestions.length)} of{" "}
                            {trainingQuestions.length}
                          </span>
                        </div>
                        <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${trainingProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Completion State */}
                      {currentQuestionIndex >= trainingQuestions.length && (
                        <div className="space-y-6">
                          <div className="glass-card p-6 rounded-2xl border border-border/50 text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                              <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                              <p className="text-sm text-muted-foreground">
                                You've completed the <span className="font-semibold">{getSurveyTitle()}</span> survey.
                                SOSA now has better context to assist you.
                              </p>
                            </div>
                          </div>

                          <div className="glass-card p-6 rounded-2xl border border-border/50 space-y-4">
                            <h4 className="text-lg font-semibold text-center mb-4">Take More Surveys</h4>

                            <div className="space-y-3">
                              {/* Facility Information Survey */}
                              {!completedSurveys.includes("facility") && currentSurvey !== "facility" && (
                                <button
                                  onClick={() => startSurvey("facility")}
                                  className="w-full px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background/80 transition-all duration-200 text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      <svg
                                        className="w-5 h-5 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium mb-1">Facility Information</div>
                                      <div className="text-xs text-muted-foreground">
                                        Tell SOSA about your {getRoleContext()}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              )}

                              {/* Emergency Preparedness Survey */}
                              {!completedSurveys.includes("preparedness") && currentSurvey !== "preparedness" && (
                                <button
                                  onClick={() => startSurvey("preparedness")}
                                  className="w-full px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background/80 transition-all duration-200 text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      <svg
                                        className="w-5 h-5 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium mb-1">Emergency Preparedness</div>
                                      <div className="text-xs text-muted-foreground">
                                        Share your emergency protocols and procedures
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              )}

                              {/* Communication & Support Survey */}
                              {!completedSurveys.includes("communication") && currentSurvey !== "communication" && (
                                <button
                                  onClick={() => startSurvey("communication")}
                                  className="w-full px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background/80 transition-all duration-200 text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      <svg
                                        className="w-5 h-5 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium mb-1">Communication & Support</div>
                                      <div className="text-xs text-muted-foreground">
                                        How you communicate during emergencies
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              )}

                              {/* Retake Current Survey */}
                              <button
                                onClick={resetTraining}
                                className="w-full px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background/80 transition-all duration-200 text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg
                                      className="w-5 h-5 text-primary"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium mb-1">Retake {getSurveyTitle()}</div>
                                    <div className="text-xs text-muted-foreground">Update your responses</div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Launch Tourist SOS Training - Premium */}
                          <div className="glass-card p-6 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
                            <button
                              onClick={() => {
                                alert("Tourist SOS Training - Premium certification program coming soon!")
                              }}
                              className="w-full text-left relative"
                            >
                              <div className="absolute top-0 right-0">
                                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                  Premium
                                </span>
                              </div>
                              <div className="flex items-center gap-3 pt-2">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg
                                    className="w-5 h-5 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold mb-1 text-primary">Launch Tourist SOS Training</div>
                                  <div className="text-xs text-muted-foreground">
                                    Get certified in emergency response protocols
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>

                          {/* Back to Home Button */}
                          <div className="text-center">
                            <button
                              onClick={navigateToHome}
                              className="px-8 py-3 rounded-full bg-background border border-border/50 hover:bg-background/80 transition-colors text-sm font-medium"
                            >
                              Back to Home
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {viewState === "CERTIFICATION" && (
                <div className="flex flex-col h-full overflow-y-auto">
                  {/* Header */}
                  <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="max-w-4xl mx-auto text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">
                        Tourist SOS Certification Program
                      </h1>
                      <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        Become a certified emergency response professional with AI-powered training
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                      {/* Overview Section */}
                      <div className="glass-card p-6 rounded-2xl border border-border/50">
                        <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">CPR & First Aid</h3>
                              <p className="text-sm text-muted-foreground">
                                Essential life-saving techniques for emergency situations
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Tourist Emergency Protocols</h3>
                              <p className="text-sm text-muted-foreground">
                                Specialized training for handling tourist-specific emergencies
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Cross-Cultural Communication</h3>
                              <p className="text-sm text-muted-foreground">
                                Effective communication during language barriers
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Documentation & Compliance</h3>
                              <p className="text-sm text-muted-foreground">
                                Proper record-keeping and legal requirements
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Curriculum Section */}
                      <div className="glass-card p-6 rounded-2xl border border-border/50">
                        <h2 className="text-xl font-bold mb-4">Certification Curriculum</h2>
                        <div className="space-y-3">
                          {[
                            { module: "Module 1", title: "Emergency Assessment & Response", duration: "2 hours" },
                            { module: "Module 2", title: "Medical Emergencies", duration: "3 hours" },
                            { module: "Module 3", title: "Trauma & Injury Management", duration: "2.5 hours" },
                            { module: "Module 4", title: "Environmental Emergencies", duration: "2 hours" },
                            { module: "Module 5", title: "Communication & Coordination", duration: "1.5 hours" },
                            { module: "Module 6", title: "Legal & Ethical Considerations", duration: "1 hour" },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-xl border border-border/30 hover:border-primary/30 hover:bg-background/50 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-xs text-muted-foreground">{item.module}</div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">{item.duration}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits Section */}
                      <div className="glass-card p-6 rounded-2xl border border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
                        <h2 className="text-xl font-bold mb-4">Certification Benefits</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            "Official Tourist SOS Certificate",
                            "Digital badge for LinkedIn",
                            "Annual recertification included",
                            "Access to exclusive resources",
                            "Priority support",
                            "Continuing education credits",
                          ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <svg
                                className="w-5 h-5 text-primary flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className="glass-card p-6 rounded-2xl border-2 border-primary/30">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold mb-2">Get Certified Today</h2>
                          <div className="flex items-baseline justify-center gap-2 mb-4">
                            <span className="text-4xl font-bold text-primary">$99</span>
                            <span className="text-muted-foreground">/year</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Includes all modules, certification exam, and annual renewal
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            alert("Payment integration coming soon! This will redirect to checkout.")
                          }}
                          className="w-full px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
                        >
                          Start Certification Program
                        </button>

                        <div className="mt-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            30-day money-back guarantee • Secure payment • Cancel anytime
                          </p>
                        </div>
                      </div>

                      {/* Team Pricing */}
                      <div className="glass-card p-6 rounded-2xl border border-border/50">
                        <h3 className="text-lg font-bold mb-3">Team & Enterprise Pricing</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Certify your entire team with custom pricing and dedicated support
                        </p>
                        <button
                          onClick={() => {
                            alert("Contact sales form coming soon!")
                          }}
                          className="px-6 py-3 rounded-xl border border-primary/30 hover:bg-primary/10 transition-colors font-medium"
                        >
                          Contact Sales
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewState === "PERSONAL_CHAT" && (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-4 border-b border-border/50">
                    <div className="text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <img
                          src="/sosa-avatar.png"
                          alt="SOSA Assistant Avatar"
                          className="w-24 h-auto object-contain"
                        />
                        <div>
                          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Chat with SOSA</h2>
                          <p className="text-sm text-muted-foreground">
                            Your personal AI assistant for anything you need
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 pb-32 sm:pb-28">
                    <div className="max-w-3xl mx-auto space-y-4">
                      {personalChatMessages.length === 0 ? (
                        <div className="glass-card p-6 rounded-2xl border border-border/50 text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ChatIcon />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                          <p className="text-sm text-muted-foreground mb-4">Ask me anything! I can help with:</p>
                          <div className="grid sm:grid-cols-2 gap-3 text-left">
                            <div className="glass-card p-3 rounded-lg border border-border/30">
                              <div className="text-sm font-medium mb-1">Talk to Tourists</div>
                              <div className="text-xs text-muted-foreground">
                                Get help communicating in their language
                              </div>
                            </div>
                            <div className="glass-card p-3 rounded-lg border border-border/30">
                              <div className="text-sm font-medium mb-1">Medical Help</div>
                              <div className="text-xs text-muted-foreground">
                                Medical terms and emergency procedures
                              </div>
                            </div>
                            <div className="glass-card p-3 rounded-lg border border-border/30">
                              <div className="text-sm font-medium mb-1">Handle Requests</div>
                              <div className="text-xs text-muted-foreground">
                                Professional responses for guest services
                              </div>
                            </div>
                            <div className="glass-card p-3 rounded-lg border border-border/30">
                              <div className="text-sm font-medium mb-1">Find Resources</div>
                              <div className="text-xs text-muted-foreground">
                                Quick access to hospitals, contacts, facilities
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        personalChatMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "glass-card border border-border/50"
                              }`}
                            >
                              <div className="text-sm sm:text-base">{msg.content}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                              >
                                {msg.timestamp}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Message Input */}
                  <MessageInput
                    message={message}
                    setMessage={setMessage}
                    onSend={handleSendPersonalChatMessage}
                    onFileClick={handleFileClick}
                    onMicClick={handleMicClick}
                    disabled={isSendingMessage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <ProfilePopout
          showProfilePopout={showProfilePopout}
          setShowProfilePopout={setShowProfilePopout}
          profileTab={profileTab}
          setProfileTab={setProfileTab}
        />

        <AddPeopleModal
          showAddPeople={showAddPeople}
          setShowAddPeople={setShowAddPeople}
          selectedContacts={selectedContacts}
          toggleContactSelection={toggleContactSelection}
          addSelectedParticipants={addSelectedParticipants}
        />

        <IncomingCallModal
          isOpen={showIncomingCall}
          callerName={callerName}
          callType={currentCallType}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />

        <ActiveCallOverlay
          isOpen={showActiveCall}
          participants={[callerName]}
          callType={currentCallType}
          onEndCall={handleEndCall}
        />

        <VoiceRecorder
          isOpen={showVoiceRecorder}
          onClose={() => setShowVoiceRecorder(false)}
          onSend={handleVoiceRecorderSend}
        />

        <NotificationsDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
