import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 dark">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="glass-card p-8 rounded-lg border border-border/50">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          
          <p className="text-muted-foreground mb-6">
            Something went wrong during authentication. This could be due to an expired link, invalid credentials, or a network issue.
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="inline-block w-full btn-primary-gradient py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="inline-block w-full py-3 rounded-lg font-medium border border-border hover:bg-muted/50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
