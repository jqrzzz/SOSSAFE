"use client"

import { useState } from "react"
import { XIcon, DownloadIcon, FileTextIcon } from "@/components/icons"
import { getStatusColor, getStatusText } from "@/lib/shared-utils"

interface PDFViewerProps {
  fileName: string
  fileUrl: string
  onClose: () => void
  onDownload?: () => void
  showSignatureButton?: boolean
  onSignDocument?: () => void
  signatureStatus?: "pending" | "signed" | "completed"
  signers?: Array<{ name: string; status: "pending" | "signed" }>
}

export function PDFViewer({
  fileName,
  fileUrl,
  onClose,
  onDownload,
  showSignatureButton = false,
  onSignDocument,
  signatureStatus = "pending",
  signers = [],
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <FileTextIcon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">{fileName}</h3>
              {showSignatureButton && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(signatureStatus)}`}>
                    {getStatusText(signatureStatus)}
                  </span>
                  {signers.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {signers.filter((s) => s.status === "signed").length}/{signers.length} signed
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button onClick={onDownload} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Download">
                <DownloadIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Close">
              <XIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative bg-gray-50 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading document...</p>
              </div>
            </div>
          )}

          {/* PDF Embed - In production, you'd use a proper PDF viewer library */}
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title={fileName}
          />
        </div>

        {/* Signature Actions */}
        {showSignatureButton && signatureStatus === "pending" && (
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">This document requires your signature to proceed.</div>
              <button
                onClick={onSignDocument}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-sm"
              >
                Sign Document
              </button>
            </div>
          </div>
        )}

        {/* Signers List */}
        {signers.length > 0 && (
          <div className="p-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">Signature Status</h4>
            <div className="space-y-2">
              {signers.map((signer, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{signer.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(signer.status)}`}>
                    {getStatusText(signer.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
