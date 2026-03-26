"use client"

import { useState } from "react"

interface AttachmentMenuProps {
  onCameraClick?: () => void
  onPhotoClick?: () => void
  onFileClick?: () => void
  onLocationClick?: () => void
  showLocationSharing?: boolean
  hasText?: boolean
}

export function AttachmentMenu({
  onCameraClick,
  onPhotoClick,
  onFileClick,
  onLocationClick,
  showLocationSharing = false,
  hasText = false,
}: AttachmentMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOptionClick = (callback?: () => void) => {
    callback?.()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 min-w-[48px] min-h-[48px] flex items-center justify-center group premium-hover"
        title="Attach"
      >
        <svg
          className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 glass-card rounded-lg shadow-lg border border-white/20 p-2 z-20 min-w-[160px]">
            <button
              onClick={() => handleOptionClick(onCameraClick)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors duration-200 text-left"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span className="text-sm font-medium">Camera</span>
            </button>

            <button
              onClick={() => handleOptionClick(onPhotoClick)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors duration-200 text-left"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.827 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">Photo Library</span>
            </button>

            <button
              onClick={() => handleOptionClick(onFileClick)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors duration-200 text-left"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium">Document</span>
            </button>

            {showLocationSharing && !hasText && (
              <button
                onClick={() => handleOptionClick(onLocationClick)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/10 transition-colors duration-200 text-left"
              >
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Share Location</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
