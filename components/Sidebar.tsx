"use client"

import type { Case } from "../lib/types"
import {
  ClipboardIcon,
  CheckCircleIcon,
  PlusIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  LogOutIcon,
  AcademicCapIcon,
  CertificateIcon,
  ChatIcon,
} from "@/components/icons"
import React from "react"

interface SidebarProps {
  sidebarOpen: boolean
  sidebarRef: React.RefObject<HTMLDivElement>
  viewState: string
  cases: Case[]
  searchQuery: string
  navigateToActiveCases: () => void
  navigateToCompletedCases: () => void
  navigateToContacts: () => void
  navigateToTrainSosa: () => void
  navigateToCertification: () => void
  navigateToPersonalChat: () => void // Added navigation function for personal chat
  setSidebarOpen: (open: boolean) => void
  selectCase: (caseId: string) => void
  setViewState: (view: string) => void
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void
}

export function Sidebar({
  sidebarOpen,
  sidebarRef,
  viewState,
  cases,
  searchQuery,
  navigateToActiveCases,
  navigateToCompletedCases,
  navigateToContacts,
  navigateToTrainSosa,
  navigateToCertification,
  navigateToPersonalChat, // Added prop
  setSidebarOpen,
  selectCase,
  setViewState,
  isDarkMode,
  setIsDarkMode,
}: SidebarProps) {
  const [isUserActive, setIsUserActive] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userActiveStatus")
      return stored ? JSON.parse(stored) : true
    }
    return true
  })

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userActiveStatus", JSON.stringify(isUserActive))
    }
  }, [isUserActive])

  const navigateToSettings = () => {
    window.location.href = "/settings"
  }

  const navigateToHome = () => {
    window.location.href = "/"
  }

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.clear()
      sessionStorage.clear()
    }
    window.location.href = "/login"
  }

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-[60] w-80 bg-card/95 backdrop-blur-md border-r border-border/50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Navigation Tabs */}
      <div className="flex flex-col h-full">
        <div className="px-4 py-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                  U
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    isUserActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">You</p>
                <p className={`text-xs ${isUserActive ? "text-green-600" : "text-gray-500"}`}>
                  {isUserActive ? "Active" : "Not Active"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUserActive(!isUserActive)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-inner ${
                isUserActive
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                  isUserActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Main Navigation Section */}
        <div className="px-4 py-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold gradient-text-subtle uppercase tracking-wide mb-3">Navigation</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                navigateToPersonalChat()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                viewState === "PERSONAL_CHAT"
                  ? "btn-primary-gradient text-white shadow-sm"
                  : "text-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <ChatIcon />
              <span className="flex-1 text-left">Chat with SOSA</span>
            </button>

            <button
              onClick={() => {
                navigateToActiveCases()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                viewState === "ACTIVE_CASES"
                  ? "btn-primary-gradient text-white shadow-sm"
                  : "text-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <ClipboardIcon />
              <span className="flex-1 text-left">Active Cases</span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  viewState === "ACTIVE_CASES" ? "bg-white/20 text-white" : "bg-primary/20 text-primary"
                }`}
              >
                {cases.filter((c) => c.status === "active").length}
              </span>
            </button>

            <button
              onClick={() => {
                navigateToCompletedCases()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                viewState === "COMPLETED_CASES"
                  ? "btn-primary-gradient text-white shadow-sm"
                  : "text-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <CheckCircleIcon />
              <span className="flex-1 text-left">Completed Cases</span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  viewState === "COMPLETED_CASES" ? "bg-white/20 text-white" : "bg-muted/50 text-foreground/70"
                }`}
              >
                {cases.filter((c) => c.status === "completed").length}
              </span>
            </button>

            <button
              onClick={() => {
                navigateToContacts()
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
            >
              <PlusIcon />
              <span className="flex-1 text-left">Contacts</span>
              <span className="bg-muted/50 text-foreground/70 px-2.5 py-1 rounded-full text-xs font-semibold">8</span>
            </button>

            <button
              onClick={() => {
                navigateToTrainSosa()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                viewState === "TRAIN_SOSA"
                  ? "btn-primary-gradient text-white shadow-sm"
                  : "text-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <AcademicCapIcon />
              <span className="flex-1 text-left">Train SOSA</span>
            </button>

            <button
              onClick={() => {
                navigateToCertification()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 relative ${
                viewState === "CERTIFICATION"
                  ? "btn-primary-gradient text-white shadow-sm"
                  : "text-foreground hover:bg-muted/50 hover:text-foreground border border-primary/20 bg-primary/5"
              }`}
            >
              <CertificateIcon />
              <span className="flex-1 text-left">SOS Certificate</span>
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Premium
              </span>
            </button>
          </div>
        </div>

        {/* Settings and Theme Toggle */}
        <div className="mt-auto px-4 py-6 border-t border-border/30">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  navigateToHome()
                  setSidebarOpen(false)
                }}
                className="p-3 rounded-xl text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all duration-200 premium-hover"
                title="Home"
              >
                <HomeIcon />
              </button>
              <button
                onClick={() => {
                  navigateToSettings()
                  setSidebarOpen(false)
                }}
                className="p-3 rounded-xl text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all duration-200 premium-hover"
                title="Settings"
              >
                <SettingsIcon />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 rounded-xl text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all duration-200 premium-hover"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                onClick={() => {
                  handleSignOut()
                  setSidebarOpen(false)
                }}
                className="p-3 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 premium-hover"
                title="Sign Out"
              >
                <LogOutIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
