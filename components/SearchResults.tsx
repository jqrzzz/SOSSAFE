"use client"
import { ClipboardIcon, CheckCircleIcon, UsersIcon, XIcon } from "@/components/icons"

interface SearchResult {
  type: "case" | "contact"
  id: string
  title?: string
  name?: string
  role?: string
  location?: string
  timestamp?: string
  status?: string
}

interface SearchResultsProps {
  results: SearchResult[]
  onClose: () => void
  onSelectCase?: (caseId: string) => void
  onSelectContact?: (contactId: string) => void
}

export function SearchResults({ results, onClose, onSelectCase, onSelectContact }: SearchResultsProps) {
  const handleResultClick = (result: SearchResult) => {
    if (result.type === "case" && onSelectCase) {
      onSelectCase(result.id)
    } else if (result.type === "contact" && onSelectContact) {
      onSelectContact(result.id)
    }
    onClose()
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between p-3 border-b border-border/30">
        <h3 className="text-sm font-medium text-foreground">Search Results ({results.length})</h3>
        <button onClick={onClose} className="p-1 hover:bg-muted/50 rounded-md transition-colors">
          <XIcon />
        </button>
      </div>

      {results.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground text-sm">No results found</div>
      ) : (
        <div className="p-2">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 rounded-md transition-colors text-left"
            >
              {result.type === "case" ? (
                result.status === "completed" ? (
                  <CheckCircleIcon />
                ) : (
                  <ClipboardIcon />
                )
              ) : (
                <UsersIcon />
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {result.type === "case" ? result.title : result.name}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {result.type === "case" ? `${result.id} • ${result.status}` : `${result.role} • ${result.location}`}
                </div>
              </div>

              {result.timestamp && (
                <div className="text-xs text-muted-foreground">{new Date(result.timestamp).toLocaleDateString()}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
