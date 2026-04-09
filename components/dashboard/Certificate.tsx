"use client"

import { useRef, useEffect, useState } from "react"

interface CertificateProps {
  organizationName: string
  certificationTier: string
  issuedAt: string | null
  expiresAt: string | null
  certificationId: string
  verificationCode: string | null
}

/**
 * Generates a QR code as an SVG data URL using a minimal implementation.
 * We avoid external QR libraries to keep the bundle lean.
 * Falls back to a text URL if QR generation isn't available.
 */
function useQrCode(url: string): string | null {
  const [qrUrl, setQrUrl] = useState<string | null>(null)

  useEffect(() => {
    // Use the QR code API for reliable, high-quality QR codes
    // This is a GET endpoint that returns an SVG — no API key needed
    const encoded = encodeURIComponent(url)
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=svg&data=${encoded}`,
    )
  }, [url])

  return qrUrl
}

export function Certificate({
  organizationName,
  certificationTier,
  issuedAt,
  expiresAt,
  certificationId,
  verificationCode,
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const tierLabel =
    certificationTier === "sos_safe_elite"
      ? "Elite"
      : certificationTier === "sos_safe_premium"
        ? "Premium"
        : "Basic"

  const tierColor =
    certificationTier === "sos_safe_elite"
      ? { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", accent: "from-amber-500 via-amber-600 to-yellow-500" }
      : certificationTier === "sos_safe_premium"
        ? { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", accent: "from-blue-500 via-primary to-indigo-500" }
        : { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", accent: "from-emerald-500 via-primary to-teal-500" }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"

  const verifyUrl = verificationCode
    ? `${typeof window !== "undefined" ? window.location.origin : "https://sossafe.tourist-sos.com"}/verify/${verificationCode}`
    : null

  const qrCodeUrl = useQrCode(verifyUrl ?? "")

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = async () => {
    if (verifyUrl) {
      await navigator.clipboard.writeText(verifyUrl)
    }
  }

  return (
    <div>
      {/* Printable certificate */}
      <div
        ref={certRef}
        id="sos-certificate"
        className="bg-white text-gray-900 rounded-2xl border-2 border-primary/30 p-10 max-w-2xl mx-auto print:border-2 print:border-gray-300 print:shadow-none"
      >
        {/* Header border accent */}
        <div className={`h-1.5 bg-gradient-to-r ${tierColor.accent} rounded-full mb-8`} />

        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold uppercase tracking-wider">
              <span className="text-red-500">SOS</span>{" "}
              <span className="text-emerald-600">Safety</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-[0.25em]">
            Tourist SOS Certification Program
          </p>
        </div>

        {/* Certificate title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-1">Certificate of Completion</h1>
          <div className={`inline-block px-4 py-1 rounded-full ${tierColor.bg} ${tierColor.border} border`}>
            <span className={`text-sm font-semibold ${tierColor.text}`}>
              SOS Safe {tierLabel}
            </span>
          </div>
        </div>

        {/* Awarded to */}
        <div className="text-center mb-10">
          <p className="text-sm text-gray-500 mb-2">This certifies that</p>
          <p className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 inline-block pb-1 px-6">
            {organizationName}
          </p>
          <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
            has successfully completed all required safety assessment modules and demonstrated
            compliance with SOS Safe {tierLabel} certification standards for hospitality emergency preparedness.
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Issued</p>
            <p className="text-sm font-medium text-gray-700">{formatDate(issuedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valid Until</p>
            <p className="text-sm font-medium text-gray-700">{formatDate(expiresAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Verification Code</p>
            <p className="text-sm font-bold text-gray-700 font-mono tracking-wider">
              {verificationCode ?? certificationId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* QR code + verification footer */}
        <div className="h-px bg-gray-200 mb-6" />
        <div className="flex justify-between items-end">
          <div>
            <div className="w-32 border-b border-gray-300 mb-1" />
            <p className="text-xs text-gray-400">Tourist SOS Certifications</p>
          </div>

          {verifyUrl && qrCodeUrl ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">Scan to verify</p>
                <p className="text-xs text-emerald-600 font-medium font-mono">
                  {verificationCode}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt={`QR code to verify certification ${verificationCode}`}
                width={64}
                height={64}
                className="rounded"
              />
            </div>
          ) : (
            <div className="text-right">
              <p className="text-xs text-gray-400">Verify at</p>
              <p className="text-xs text-emerald-600 font-medium">sossafe.tourist-sos.com/verify</p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons (hidden when printing) */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 print:hidden">
        <button
          onClick={handlePrint}
          className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Certificate
        </button>
        {verifyUrl && (
          <button
            onClick={handleCopyLink}
            className="px-6 py-3 rounded-lg border border-border font-medium inline-flex items-center gap-2 hover:bg-muted/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copy Verification Link
          </button>
        )}
      </div>
    </div>
  )
}
