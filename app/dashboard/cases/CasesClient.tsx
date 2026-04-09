"use client"

import { useState } from "react"
import Link from "next/link"

interface CaseItem {
  id: string
  case_number: string
  status: string
  priority: string
  created_at: string
  country: string
  city: string
}

interface CasesClientProps {
  cases: CaseItem[]
  partnerName: string
}

export function CasesClient({ cases, partnerName }: CasesClientProps) {
  const [exporting, setExporting] = useState(false)

  const statusStyle = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    }
  }

  const priorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const exportCSV = () => {
    setExporting(true)

    const headers = [
      "Case Number",
      "Status",
      "Priority",
      "Location",
      "Date Opened",
    ]

    const rows = cases.map((c) => [
      c.case_number,
      c.status.replace("_", " "),
      c.priority,
      `${c.city || ""}, ${c.country || ""}`.replace(/^, |, $/g, ""),
      new Date(c.created_at).toISOString().split("T")[0],
    ])

    const csvContent = [
      `# Incident Log — ${partnerName}`,
      `# Generated: ${new Date().toISOString().split("T")[0]}`,
      `# Total Cases: ${cases.length}`,
      "",
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `incident-log-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)

    setExporting(false)
  }

  const printLog = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cases</h1>
          <p className="text-muted-foreground mt-1">
            View and manage emergency cases
          </p>
        </div>
        {cases.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={printLog}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <PrintIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        )}
      </div>

      {cases.length === 0 ? (
        <div className="glass-card p-12 rounded-lg border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No cases yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            When you report an emergency or are involved in a case, it will
            appear here. Cases are managed by the Tourist SOS Command Center.
          </p>
          <div className="p-4 rounded-lg bg-muted/50 text-sm max-w-md mx-auto">
            <p className="font-medium mb-2">Need to report an emergency?</p>
            <p className="text-muted-foreground">
              Contact Tourist SOS via WhatsApp or your preferred messaging app.
              Our AI triage system will create a case and coordinate the
              response.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:grid-cols-4">
            <div className="glass-card p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">Total Cases</p>
              <p className="text-xl font-bold">{cases.length}</p>
            </div>
            <div className="glass-card p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">Open</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {cases.filter((c) => c.status === "open").length}
              </p>
            </div>
            <div className="glass-card p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {cases.filter((c) => c.status === "in_progress").length}
              </p>
            </div>
            <div className="glass-card p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {
                  cases.filter(
                    (c) => c.status === "resolved" || c.status === "closed",
                  ).length
                }
              </p>
            </div>
          </div>

          {/* Printable header (hidden on screen) */}
          <div className="hidden print:block mb-6">
            <h2 className="text-lg font-bold">{partnerName} — Incident Log</h2>
            <p className="text-sm text-gray-600">
              Generated: {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Case list */}
          <div className="space-y-4" id="incident-log">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/dashboard/cases/${caseItem.id}`}
                className="glass-card p-6 rounded-lg border border-border/50 hover:border-primary/30 transition-colors block print:break-inside-avoid print:border print:border-gray-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{caseItem.case_number}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(caseItem.status)}`}
                      >
                        {caseItem.status.replace("_", " ")}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyle(caseItem.priority)}`}
                      >
                        {caseItem.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {caseItem.city}, {caseItem.country}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(caseItem.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Compliance note */}
          <div className="glass-card p-4 rounded-lg border border-border/50 bg-muted/20 print:hidden">
            <div className="flex items-start gap-3">
              <InfoIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Export your incident log as CSV for insurance claims,
                  compliance audits, or internal records. The printed version
                  includes all case details in a format suitable for official
                  documentation.
                </p>
                <p className="text-xs">
                  Exported data may contain sensitive information. Handle in accordance with your
                  organization&apos;s data protection policies and applicable privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  )
}

function PrintIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
      />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
