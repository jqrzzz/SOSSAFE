"use client"

import type React from "react"

import { useState, useRef } from "react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)

    if (distance > 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, 100))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    setIsPulling(false)
    setPullDistance(0)
  }

  const refreshThreshold = pullDistance > 60
  const opacity = Math.min(pullDistance / 60, 1)

  const RefreshIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-background/80 backdrop-blur-sm border-b border-border/50 z-10"
          style={{
            transform: `translateY(${Math.min(pullDistance - 60, 0)}px)`,
            opacity: opacity,
          }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshIcon className={`${isRefreshing || refreshThreshold ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : refreshThreshold ? "Release to refresh" : "Pull to refresh"}
          </div>
        </div>
      )}

      <div style={{ transform: `translateY(${isPulling ? Math.min(pullDistance, 60) : 0}px)` }}>{children}</div>
    </div>
  )
}
