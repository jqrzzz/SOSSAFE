"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard after login
      window.location.href = "/dashboard"
    }, 1500)
  }

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider)
    setError(null)

    try {
      // This is where backend integration will happen
      console.log(`${provider} login initiated`)

      // Simulate API call - replace with actual OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Backend will handle the actual OAuth redirect
      // window.location.href = `/api/auth/${provider.toLowerCase()}`
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center px-4 ${isDarkMode ? "dark" : ""}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Link href="/" className="text-2xl font-bold gradient-text">
              SOS SAFETY by Tourist SOS
            </Link>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-background/60 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <div className="glass-card p-6 rounded-lg border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-input w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary-gradient py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Adding forgot password link for better UX */}
            <div className="flex items-center justify-between mt-2 mb-4">
              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* Apple Sign In */}
              <button
                type="button"
                disabled={socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleSocialLogin("Apple")}
              >
                {socialLoading === "Apple" ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                )}
                <span className="font-medium">
                  {socialLoading === "Apple" ? "Connecting..." : "Continue with Apple"}
                </span>
              </button>

              {/* Facebook Login */}
              <button
                type="button"
                disabled={socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleSocialLogin("Facebook")}
              >
                {socialLoading === "Facebook" ? (
                  <div className="w-5 h-5 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <span className="font-medium">
                  {socialLoading === "Facebook" ? "Connecting..." : "Continue with Facebook"}
                </span>
              </button>

              {/* Google Login */}
              <button
                type="button"
                disabled={socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleSocialLogin("Google")}
              >
                {socialLoading === "Google" ? (
                  <div className="w-5 h-5 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="font-medium">
                  {socialLoading === "Google" ? "Connecting..." : "Continue with Google"}
                </span>
              </button>

              {/* LINE Login */}
              <button
                type="button"
                disabled={socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleSocialLogin("LINE")}
              >
                {socialLoading === "LINE" ? (
                  <div className="w-5 h-5 border-2 border-[#00B900] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-[#00B900]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  </svg>
                )}
                <span className="font-medium">{socialLoading === "LINE" ? "Connecting..." : "Continue with LINE"}</span>
              </button>

              {/* WeChat Login */}
              <button
                type="button"
                disabled={socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleSocialLogin("WeChat")}
              >
                {socialLoading === "WeChat" ? (
                  <div className="w-5 h-5 border-2 border-[#07C160] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-[#07C160]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
                  </svg>
                )}
                <span className="font-medium">
                  {socialLoading === "WeChat" ? "Connecting..." : "Continue with WeChat"}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center space-y-4">
            <Link href="/demo" className="block text-primary hover:text-primary/80 font-medium transition-colors">
              Try Demo Instead
            </Link>

            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </Link>
            </div>

            <div className="pt-4 border-t border-border/30">
              <Link
                href="/admin/login"
                className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
