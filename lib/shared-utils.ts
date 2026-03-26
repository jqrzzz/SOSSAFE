export function getStatusColor(status: string) {
  switch (status) {
    case "signed":
      return "text-green-600 bg-green-50 border-green-200"
    case "completed":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "active":
      return "text-blue-600 bg-blue-50"
    case "pending":
      return "text-orange-600 bg-orange-50 border-orange-200"
    default:
      return "text-orange-600 bg-orange-50 border-orange-200"
  }
}

export function getStatusText(status: string) {
  switch (status) {
    case "signed":
      return "Signed"
    case "completed":
      return "All Signed"
    case "active":
      return "Active"
    case "pending":
      return "Signature Required"
    default:
      return "Pending Signature"
  }
}

export function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
      return "📄"
    case "doc":
    case "docx":
      return "📝"
    case "xls":
    case "xlsx":
      return "📊"
    case "ppt":
    case "pptx":
      return "📋"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "🖼️"
    case "mp4":
    case "avi":
    case "mov":
      return "🎥"
    case "mp3":
    case "wav":
      return "🎵"
    default:
      return "📎"
  }
}

export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`

  return date.toLocaleDateString()
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
