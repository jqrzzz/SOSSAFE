"use client"

import type React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar" // Added Sidebar import
import { SettingsIcon, UserIcon, BellIcon, ShieldIcon, HelpCircleIcon, PhoneIcon } from "@/components/icons"

interface SettingsSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  items: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description: string
  type: "toggle" | "select" | "button" | "input"
  value?: any
  options?: { label: string; value: string }[]
}

export default function SettingsPage() {
  const router = useRouter()
  const [showProfilePopout, setShowProfilePopout] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [bio, setBio] = useState("")
  const maxBioLength = 150

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userOrg, setUserOrg] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [userId, setUserId] = useState("")

  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    priorityAlerts: true,
    autoBackup: true,
    language: "en",
    role: "hospitality",
    dataRetention: "90",
    theme: "system",
  })

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || "")
        setUserEmail(user.email || "")
        setUserOrg(user.user_metadata?.organization_name || "")
        setUserId(user.id?.slice(0, 8).toUpperCase() || "")
        const partnerType = user.user_metadata?.partner_type
        if (partnerType === "tour_operator") {
          updateSetting("role", "tours")
        }

        const { data: membership } = await supabase
          .from("partner_memberships")
          .select("partners(phone)")
          .eq("user_id", user.id)
          .single()
        if ((membership as any)?.partners?.phone) {
          setUserPhone((membership as any).partners.phone)
        }
      }
    }
    loadUserData()
  }, [])

  const mockCases = [
    { id: "1", status: "active" as const },
    { id: "2", status: "active" as const },
    { id: "3", status: "completed" as const },
  ]

  const navigateToHome = useCallback(() => {
    router.push("/")
  }, [router])

  const navigateToActiveCases = useCallback(() => {
    router.push("/?view=active")
  }, [router])

  const navigateToCompletedCases = useCallback(() => {
    router.push("/?view=completed")
  }, [router])

  const navigateToContacts = useCallback(() => {
    router.push("/contacts")
  }, [router])

  const navigateToTrainSosa = useCallback(() => {
    router.push("/demo?view=train")
  }, [router])

  const navigateToCertification = useCallback(() => {
    router.push("/demo?view=certification")
  }, [router])

  const navigateToPersonalChat = useCallback(() => {
    router.push("/demo?view=personal-chat")
  }, [router])

  const selectCase = (caseId: string) => {
    // Navigate to case
  }

  const setViewState = (view: string) => {
    // Handle view state
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const applyTheme = (theme: string) => {
      if (theme === "system") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setIsDarkMode(systemPrefersDark)
        document.documentElement.classList.toggle("dark", systemPrefersDark)
      } else {
        const isDark = theme === "dark"
        setIsDarkMode(isDark)
        document.documentElement.classList.toggle("dark", isDark)
      }
    }

    applyTheme(settings.theme)

    // Listen for system theme changes if theme is set to system
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches)
        document.documentElement.classList.toggle("dark", e.matches)
      }
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [settings.theme])

  const updateSetting = (id: string, value: any) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: value,
    }))
  }

  const settingsSections: SettingsSection[] = useMemo(
    () => [
      {
        id: "profile",
        title: "Account & Profile",
        description: "Manage your personal information and account details",
        icon: <UserIcon />,
        items: [
          {
            id: "name",
            label: "Full Name",
            description: "Your display name for team communication",
            type: "input",
            value: userName,
          },
          {
            id: "role",
            label: "Role",
            description: "Your role for case routing and identification",
            type: "select",
            value: settings.role,
            options: [
              { label: "Medical", value: "medical" },
              { label: "Hospitality", value: "hospitality" },
              { label: "Tours", value: "tours" },
            ],
          },
          {
            id: "phone",
            label: "Phone Number",
            description: "Primary contact number (include country code)",
            type: "input",
            value: userPhone,
          },
          {
            id: "company",
            label: "Company",
            description: "Your organization or company name",
            type: "input",
            value: userOrg,
          },
          {
            id: "user-id",
            label: "User ID",
            description: "Your unique identifier",
            type: "input",
            value: userId,
          },
        ],
      },
      {
        id: "notifications",
        title: "Notifications",
        description: "Control how and when you receive notifications",
        icon: <BellIcon />,
        items: [
          {
            id: "notifications",
            label: "Push Notifications",
            description: "Receive case updates and messages",
            type: "toggle",
            value: settings.notifications,
          },
        ],
      },
      {
        id: "communication",
        title: "Communication",
        description: "Configure your communication preferences",
        icon: <PhoneIcon />,
        items: [
          {
            id: "autoTranslate",
            label: "Auto Translation",
            description: "Automatically translate messages",
            type: "toggle",
            value: true,
          },
        ],
      },
      {
        id: "privacy",
        title: "Privacy & Data",
        description: "Manage your data and privacy preferences",
        icon: <ShieldIcon />,
        items: [
          {
            id: "locationSharing",
            label: "Location Sharing",
            description: "Allow sharing location for case coordination",
            type: "toggle",
            value: settings.locationSharing,
          },
          {
            id: "autoBackup",
            label: "Auto Backup",
            description: "Automatically backup case data",
            type: "toggle",
            value: settings.autoBackup,
          },
          {
            id: "dataRetention",
            label: "Data Retention",
            description: "How long to keep case history",
            type: "select",
            value: settings.dataRetention,
            options: [
              { label: "30 days", value: "30" },
              { label: "90 days", value: "90" },
              { label: "1 year", value: "365" },
              { label: "Forever", value: "forever" },
            ],
          },
          {
            id: "exportData",
            label: "Export Data",
            description: "Download your data and case history",
            type: "button",
          },
        ],
      },
      {
        id: "app",
        title: "App Preferences",
        description: "Customize your app experience",
        icon: <SettingsIcon />,
        items: [
          {
            id: "language",
            label: "Language",
            description: "App display language",
            type: "select",
            value: settings.language,
            options: [
              { label: "English", value: "en" },
              { label: "Spanish", value: "es" },
              { label: "French", value: "fr" },
              { label: "German", value: "de" },
            ],
          },
          {
            id: "theme",
            label: "Theme",
            description: "App appearance",
            type: "select",
            value: settings.theme, // Added value to theme select
            options: [
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
              { label: "System", value: "system" },
            ],
          },
        ],
      },
      {
        id: "support",
        title: "Help & Support",
        description: "Get help and manage your account",
        icon: <HelpCircleIcon />,
        items: [
          { id: "help", label: "Help Center", description: "Browse help articles and guides", type: "button" },
          { id: "contact", label: "Contact Support", description: "Get help from our support team", type: "button" },
          { id: "feedback", label: "Send Feedback", description: "Help us improve the platform", type: "button" },
          { id: "about", label: "About", description: "App version and information", type: "button" },
        ],
      },
    ],
    [
      settings.role,
      settings.notifications,
      settings.locationSharing,
      settings.autoBackup,
      settings.dataRetention,
      settings.language,
      settings.theme,
      userName,
      userPhone,
      userOrg,
      userId,
    ],
  )

  const renderSettingItem = useCallback((item: SettingItem, sectionId: string) => {
    switch (item.type) {
      case "toggle":
        return (
          <div className="flex items-center justify-between py-1">
            <div className="flex-1 pr-3">
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs text-muted-foreground/80 leading-tight">{item.description}</div>
            </div>
            <button
              onClick={() => updateSetting(item.id, !item.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 flex-shrink-0 ${
                item.value
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-md ${
                  item.value ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        )

      case "select":
        return (
          <div>
            <div className="font-medium text-sm mb-1">{item.label}</div>
            <div className="text-xs text-muted-foreground/80 mb-2 leading-tight">{item.description}</div>
            <select
              value={item.value || ""}
              onChange={(e) => updateSetting(item.id, e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {item.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case "input":
        return (
          <div>
            <div className="font-medium text-sm mb-1">{item.label}</div>
            <div className="text-xs text-muted-foreground/80 mb-2 leading-tight">{item.description}</div>
            <input
              type="text"
              value={item.value || ""}
              onChange={(e) => updateSetting(item.id, e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        )

      case "button":
        const buttonActions: Record<string, () => void> = {
          help: () => router.push("/support"),
          contact: () => router.push("/support"),
          feedback: () => window.open("mailto:support@touristsos.com?subject=Feedback", "_blank"),
          about: () => router.push("/about"),
          exportData: () => alert("Data export will be available soon."),
        }
        return (
          <button
            onClick={buttonActions[item.id] || (() => {})}
            className="w-full text-left py-2 px-3 rounded-md hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground/80 leading-tight">{item.description}</div>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">→</span>
            </div>
          </button>
        )

      default:
        return null
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        sidebarOpen={sidebarOpen}
        sidebarRef={{ current: null }}
        viewState="SETTINGS"
        cases={mockCases}
        searchQuery=""
        navigateToActiveCases={navigateToActiveCases}
        navigateToCompletedCases={navigateToCompletedCases}
        navigateToContacts={navigateToContacts}
        navigateToTrainSosa={navigateToTrainSosa} // Added missing prop
        navigateToCertification={navigateToCertification} // Added missing prop
        navigateToPersonalChat={navigateToPersonalChat} // Added missing prop
        setSidebarOpen={setSidebarOpen}
        selectCase={selectCase}
        setViewState={setViewState}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <Header
        setSidebarOpen={setSidebarOpen}
        navigateToHome={navigateToHome}
        setShowProfilePopout={setShowProfilePopout}
        currentCase={undefined}
        setShowAddPeople={() => {}}
        showNotifications={false}
        showMyId={true}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground/80">Manage your account preferences and communication settings</p>
        </div>

        <div className="grid gap-4 max-w-4xl">
          {settingsSections.map((section) => (
            <div key={section.id} className="glass-card rounded-lg p-4 border border-border/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 rounded-md bg-primary/20 text-primary flex-shrink-0">{section.icon}</div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold gradient-text-subtle">{section.title}</h2>
                  <p className="text-xs text-muted-foreground/80 leading-tight">{section.description}</p>
                </div>
              </div>

              {section.id === "profile" && (
                <div className="mb-4 p-4 rounded-md bg-muted/10 border border-border/20">
                  {/* Profile Photo */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto || "/placeholder.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-semibold text-primary">JD</span>
                        )}
                      </div>
                      <label
                        htmlFor="photo-upload"
                        className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                      >
                        <svg
                          className="w-4 h-4 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">Profile Photo</div>
                      <div className="text-xs text-muted-foreground/80">
                        Upload a photo to help your team recognize you
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <div className="font-medium text-sm mb-1">Bio</div>
                    <div className="text-xs text-muted-foreground/80 mb-2">Tell your team about yourself</div>
                    <textarea
                      value={bio}
                      onChange={(e) => {
                        if (e.target.value.length <= maxBioLength) {
                          setBio(e.target.value)
                        }
                      }}
                      placeholder="Emergency coordinator with 8 years experience..."
                      className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground/60 text-right mt-1">
                      {bio.length}/{maxBioLength}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.id} className="p-3 rounded-md bg-muted/10 border border-border/20">
                    {renderSettingItem(item, section.id)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded-lg glass-card border border-border/30 text-center">
          <div className="text-xs text-muted-foreground/80">v1.0.0 • Professional communication platform</div>
        </div>
      </div>
    </div>
  )
}
