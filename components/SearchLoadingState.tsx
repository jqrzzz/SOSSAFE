import { SearchIcon } from "@/components/icons"

export function SearchLoadingState() {
  return (
    <div className="flex items-center justify-center py-8 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <SearchIcon className="w-4 h-4 text-primary animate-pulse" />
        </div>
        <div className="text-sm text-muted-foreground">Searching...</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
