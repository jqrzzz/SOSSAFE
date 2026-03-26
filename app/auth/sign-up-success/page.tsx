import Link from "next/link"
import { Logo } from "@/components/Logo"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 dark">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="glass-card p-8 rounded-lg border border-border/50">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          
          <p className="text-muted-foreground mb-6">
            {"We've sent you a verification link. Please check your email and click the link to verify your account."}
          </p>

          <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground mb-6">
            <p className="font-medium text-foreground mb-2">What happens next?</p>
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                Verify your email address
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                Complete your partner profile
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                Start your SOS Safe certification
              </li>
            </ul>
          </div>

          <Link
            href="/auth/login"
            className="inline-block w-full btn-primary-gradient py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover"
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
