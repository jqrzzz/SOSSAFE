"use client"

import { useState } from "react"
import { FileTextIcon, DownloadIcon } from "@/components/icons"
import { PDFViewer } from "./PDFViewer"
import { SignaturePad } from "./SignaturePad"
import { getStatusColor, getStatusText } from "@/lib/shared-utils"

interface DocumentMessageProps {
  fileName: string
  fileSize: string
  fileUrl?: string
  requiresSignature?: boolean
  signatureStatus?: "pending" | "signed" | "completed"
  signers?: Array<{ name: string; status: "pending" | "signed" }>
  onSignComplete?: (signatureData: string) => void
}

export function DocumentMessage({
  fileName,
  fileSize,
  fileUrl = "#",
  requiresSignature = false,
  signatureStatus = "pending",
  signers = [],
  onSignComplete,
}: DocumentMessageProps) {
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [showSignaturePad, setShowSignaturePad] = useState(false)

  const handleSignComplete = (signatureData: string) => {
    setShowSignaturePad(false)
    onSignComplete?.(signatureData)
  }

  return (
    <>
      <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30 max-w-sm">
        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
          <FileTextIcon className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">{fileSize}</p>
            </div>
            <button
              onClick={() => window.open(fileUrl, "_blank")}
              className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
              title="Download"
            >
              <DownloadIcon className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Signature Status */}
          {requiresSignature && (
            <div className="mb-3">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(signatureStatus)}`}
              >
                {getStatusText(signatureStatus)}
              </div>
              {signers.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {signers.filter((s) => s.status === "signed").length}/{signers.length} signatures
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPDFViewer(true)}
              className="px-3 py-1.5 text-xs font-medium bg-background border border-border rounded hover:bg-muted transition-colors"
            >
              View
            </button>
            {requiresSignature && signatureStatus === "pending" && (
              <button
                onClick={() => setShowSignaturePad(true)}
                className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded hover:from-blue-600 hover:to-teal-600 transition-all duration-200"
              >
                Sign
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPDFViewer && (
        <PDFViewer
          fileName={fileName}
          fileUrl={fileUrl}
          onClose={() => setShowPDFViewer(false)}
          onDownload={() => window.open(fileUrl, "_blank")}
          showSignatureButton={requiresSignature}
          onSignDocument={() => {
            setShowPDFViewer(false)
            setShowSignaturePad(true)
          }}
          signatureStatus={signatureStatus}
          signers={signers}
        />
      )}

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePad documentName={fileName} onSave={handleSignComplete} onCancel={() => setShowSignaturePad(false)} />
      )}
    </>
  )
}
