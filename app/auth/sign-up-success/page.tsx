import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="glass-card p-8 rounded-lg border border-border/50">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            {"We've sent a verification link to your inbox. Click it to activate your account."}
          </p>

          <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground mb-6">
            <p className="font-medium text-foreground mb-3">Your path to certification:</p>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Verify your email</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Click the link we just sent</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">2</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Set up your organization</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Location, contact details, operations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">3</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Complete safety certification</span>
                  <p className="text-xs text-muted-foreground mt-0.5">3 modules, 80% pass threshold, earn your badge</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/auth/login"
            className="inline-block w-full rounded-full bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-colors text-center"
          >
            Go to Login
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or "}
            <Link href="/auth/sign-up" className="text-primary hover:text-primary/80">
              try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
