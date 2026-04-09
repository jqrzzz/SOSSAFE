import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
          <span className="text-4xl font-bold text-muted-foreground/50">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
