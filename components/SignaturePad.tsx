"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { XIcon } from "@/components/icons"

interface SignaturePadProps {
  onSave: (signatureData: string) => void
  onCancel: () => void
  documentName: string
}

export function SignaturePad({ onSave, onCancel, documentName }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const strokeColor = getComputedStyle(document.documentElement).getPropertyValue("--signature-stroke").trim()
    ctx.strokeStyle = strokeColor || "#000000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
      setHasSignature(true)
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasSignature(false)
    }
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return

    const signatureData = canvas.toDataURL("image/png")
    onSave(signatureData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Sign Document</h3>
            <p className="text-sm text-muted-foreground mt-1">{documentName}</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <XIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Signature Area */}
        <div className="p-6">
          <div className="border-2 border-dashed border-border rounded-lg p-4 mb-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">Draw your signature below</p>
            <canvas
              ref={canvasRef}
              className="w-full h-48 border border-border rounded bg-white cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <button
              onClick={clearSignature}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              disabled={!hasSignature}
            >
              Clear
            </button>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveSignature}
                disabled={!hasSignature}
                // Replaced hardcoded gradient with CSS class
                className="px-4 py-2 gradient-primary-secondary text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
