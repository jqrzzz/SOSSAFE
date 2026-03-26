"use client"

import { useState, useEffect } from "react"

export function useUI() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cameraModalOpen, setCameraModalOpen] = useState(false)
  const [showAddPeople, setShowAddPeople] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const closeSidebar = () => setSidebarOpen(false)
  const openSidebar = () => setSidebarOpen(true)

  return {
    sidebarOpen,
    setSidebarOpen,
    closeSidebar,
    openSidebar,
    cameraModalOpen,
    setCameraModalOpen,
    showAddPeople,
    setShowAddPeople,
    isDarkMode,
    setIsDarkMode,
    toggleDarkMode,
  }
}
