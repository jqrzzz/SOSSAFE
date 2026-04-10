"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MarketingHeader } from "@/components/MarketingHeader"
import type { PropertyType } from "@/lib/pricing-data"

type PartnerType = "accommodation" | "tour_operator"

const PROPERTY_OPTIONS: {
  propertyType: PropertyType
  partnerType: PartnerType
  label: string
  description: string
  icon: string
}[] = [
  {
    propertyType: "hostel",
    partnerType: "accommodation",
    label: "Hostel",
    description: "Hostels, backpacker lodges, dormitories",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    propertyType: "guesthouse",
    partnerType: "accommodation",
    label: "Guesthouse",
    description: "Guesthouses, B&Bs, vacation rentals, homestays",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    propertyType: "hotel",
    partnerType: "accommodation",
    label: "Hotel & Resort",
    description: "Hotels, resorts, serviced apartments",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    propertyType: "tour_operator",
    partnerType: "tour_operator",
    label: "Tour Operator",
    description: "Tour companies, activity providers, guides",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
]

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const invitePartnerId = searchParams.get("invite")
  const inviteRole = searchParams.get("role") || "staff"
  const planFromPricing = searchParams.get("plan") as PropertyType | null
  const isTeamInvite = !!invitePartnerId

  // If coming from pricing page with a plan, skip type selection
  const preselected = planFromPricing
    ? PROPERTY_OPTIONS.find((o) => o.propertyType === planFromPricing)
    : null

  const [step, setStep] = useState<"type" | "details">(
    isTeamInvite || preselected ? "details" : "type",
  )
  const [partnerType, setPartnerType] = useState<PartnerType | null>(
    preselected?.partnerType ?? null,
  )
  const [propertyType, setPropertyType] = useState<PropertyType | null>(
    preselected?.propertyType ?? null,
  )
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [organizationName, setOrganizationName] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleTypeSelect = (option: typeof PROPERTY_OPTIONS[number]) => {
    setPartnerType(option.partnerType)
    setPropertyType(option.propertyType)
    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      const metadata: Record<string, string | null> = {
        full_name: fullName,
        partner_type: partnerType,
        property_type: propertyType,
      }

      if (isTeamInvite) {
        // Team invite — store invite info so callback can auto-link
        metadata.invite_partner_id = invitePartnerId
        metadata.invite_role = inviteRole
      } else {
        metadata.organization_name = organizationName
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/callback`,
          data: metadata,
        },
      })
      
      if (signUpError) throw signUpError
      
      router.push("/auth/sign-up-success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "type") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MarketingHeader />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Get Certified</h1>
              <p className="text-muted-foreground">Join the SOS Safe Certified Network</p>
            </div>

            <div className="glass-card p-6 rounded-xl border border-border/50">
            <h2 className="text-xl font-semibold mb-6 text-center">What type of business are you?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROPERTY_OPTIONS.map((option) => (
                <button
                  key={option.propertyType}
                  onClick={() => handleTypeSelect(option)}
                  className="p-5 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{option.label}</h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View pricing details
              </Link>
            </div>

            <div className="mt-3 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isTeamInvite
                ? "Join Your Team"
                : PROPERTY_OPTIONS.find((o) => o.propertyType === propertyType)?.label
                  ? `${PROPERTY_OPTIONS.find((o) => o.propertyType === propertyType)!.label} Registration`
                  : "Registration"}
            </h1>
            <p className="text-muted-foreground">
              {isTeamInvite
                ? "You've been invited to join a team on SOS Safety"
                : "Complete your account details"}
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl border border-border/50">
            {!isTeamInvite && !planFromPricing && (
              <button
                onClick={() => setStep("type")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change business type
              </button>
            )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Your Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="premium-input w-full"
                placeholder="e.g. Maria Santos"
                required
              />
            </div>

            {!isTeamInvite && (
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium mb-2">
                  {partnerType === "tour_operator" ? "Company Name" : "Property Name"}
                </label>
                <input
                  id="organizationName"
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="premium-input w-full"
                  placeholder={
                    propertyType === "hostel" ? "e.g. Backpackers Paradise"
                    : propertyType === "hotel" ? "e.g. Sunrise Beach Resort"
                    : propertyType === "tour_operator" ? "e.g. Island Adventures Co."
                    : "e.g. Sunset Guesthouse"
                  }
                  required
                />
              </div>
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
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input w-full pr-10"
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="premium-input w-full"
                placeholder="Re-enter your password"
                required
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                required
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                  Privacy Policy
                </Link>. I confirm that I am at least 18 years of age.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full rounded-full bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
