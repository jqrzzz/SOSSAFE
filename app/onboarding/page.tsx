"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"

interface OnboardingFormData {
  // Step 1: Organization basics
  name: string
  type: "accommodation" | "tour_operator"
  
  // Step 2: Location
  country: string
  region: string
  city: string
  address: string
  
  // Step 3: Contact & details
  phone: string
  website: string
  propertySize: string
  guestCapacity: string
}

const COUNTRIES = [
  "Thailand", "Vietnam", "Indonesia", "Philippines", "Malaysia", 
  "Cambodia", "Laos", "Myanmar", "Singapore", "Japan", 
  "South Korea", "China", "India", "Australia", "New Zealand",
  "United States", "Canada", "United Kingdom", "Germany", "France",
  "Spain", "Italy", "Mexico", "Brazil", "Other"
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState<OnboardingFormData>({
    name: "",
    type: "accommodation",
    country: "",
    region: "",
    city: "",
    address: "",
    phone: "",
    website: "",
    propertySize: "",
    guestCapacity: "",
  })

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserEmail(user.email || "")

      // Check if already has partner profile
      const { data: membership } = await supabase
        .from("partner_memberships")
        .select("partner_id")
        .eq("user_id", user.id)
        .single()

      if (membership?.partner_id) {
        // Already onboarded, go to dashboard
        router.push("/dashboard")
        return
      }

      // Pre-fill from user metadata
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.organization_name || "",
        type: user.user_metadata?.partner_type || "accommodation",
      }))

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSubmit = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Create partner
      const { data: newPartner, error: partnerError } = await supabase
        .from("partners")
        .insert({
          name: formData.name,
          type: formData.type,
          country: formData.country,
          region: formData.region,
          city: formData.city,
          address: formData.address,
          phone: formData.phone,
          email: userEmail,
          website: formData.website,
          metadata: {
            property_size: formData.propertySize,
            guest_capacity: formData.guestCapacity,
          },
        })
        .select()
        .single()

      if (partnerError) throw partnerError

      // Create membership linking user to partner
      const { error: membershipError } = await supabase
        .from("partner_memberships")
        .insert({
          partner_id: newPartner.id,
          user_id: user.id,
          role: "owner",
          is_primary_contact: true,
          accepted_at: new Date().toISOString(),
        })

      if (membershipError) throw membershipError

      // Redirect to dashboard
      router.push("/dashboard?welcome=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete setup")
      setIsSaving(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== "" && formData.type !== null
      case 2:
        return formData.country !== "" && formData.city.trim() !== ""
      case 3:
        return true // Optional fields
      default:
        return false
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center dark">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 dark">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <p className="text-muted-foreground mt-2">Complete your organization setup</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s < step
                    ? "bg-primary text-primary-foreground"
                    : s === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 mx-1 ${s < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 rounded-lg border border-border/50">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Organization Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Organization Details</h2>
                <p className="text-sm text-muted-foreground">Tell us about your business</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Organization Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g., Grand Hotel Bangkok"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Organization Type *</label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: "accommodation" }))}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      formData.type === "accommodation"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.type === "accommodation" ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Accommodation Provider</h3>
                        <p className="text-sm text-muted-foreground">Hotels, resorts, hostels, guesthouses</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: "tour_operator" }))}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      formData.type === "tour_operator"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.type === "tour_operator" ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Tour Operator</h3>
                        <p className="text-sm text-muted-foreground">Tour companies, activity providers, guides</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Location</h2>
                <p className="text-sm text-muted-foreground">Where is your organization based?</p>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-2">
                  Country *
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select a country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium mb-2">
                    Region / Province
                  </label>
                  <input
                    id="region"
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., Bangkok"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., Bangkok"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Full Address
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                  placeholder="Street address, building name, etc."
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact & Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Additional Details</h2>
                <p className="text-sm text-muted-foreground">Help us understand your organization better</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="+66 2 123 4567"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://www.yoursite.com"
                />
              </div>

              {formData.type === "accommodation" && (
                <>
                  <div>
                    <label htmlFor="propertySize" className="block text-sm font-medium mb-2">
                      Property Size
                    </label>
                    <select
                      id="propertySize"
                      value={formData.propertySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, propertySize: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select size</option>
                      <option value="small">Small (1-20 rooms)</option>
                      <option value="medium">Medium (21-100 rooms)</option>
                      <option value="large">Large (101-300 rooms)</option>
                      <option value="enterprise">Enterprise (300+ rooms)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="guestCapacity" className="block text-sm font-medium mb-2">
                      Average Daily Guests
                    </label>
                    <select
                      id="guestCapacity"
                      value={formData.guestCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, guestCapacity: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select capacity</option>
                      <option value="1-50">1-50 guests</option>
                      <option value="51-200">51-200 guests</option>
                      <option value="201-500">201-500 guests</option>
                      <option value="500+">500+ guests</option>
                    </select>
                  </div>
                </>
              )}

              {formData.type === "tour_operator" && (
                <>
                  <div>
                    <label htmlFor="propertySize" className="block text-sm font-medium mb-2">
                      Company Size
                    </label>
                    <select
                      id="propertySize"
                      value={formData.propertySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, propertySize: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select size</option>
                      <option value="solo">Solo operator</option>
                      <option value="small">Small team (2-10 people)</option>
                      <option value="medium">Medium (11-50 people)</option>
                      <option value="large">Large (50+ people)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="guestCapacity" className="block text-sm font-medium mb-2">
                      Monthly Tour Participants
                    </label>
                    <select
                      id="guestCapacity"
                      value={formData.guestCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, guestCapacity: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select volume</option>
                      <option value="1-100">1-100 participants</option>
                      <option value="101-500">101-500 participants</option>
                      <option value="501-2000">501-2000 participants</option>
                      <option value="2000+">2000+ participants</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover disabled:opacity-50"
              >
                {isSaving ? "Setting up..." : "Complete Setup"}
              </button>
            )}
          </div>
        </div>

        {/* Skip for now */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
