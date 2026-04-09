"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { TRIAL_DAYS } from "@/lib/pricing-data"
import type { PropertyType } from "@/lib/pricing-data"

interface OnboardingFormData {
  // Step 1: Organization basics
  name: string
  type: "accommodation" | "tour_operator"
  propertyType: PropertyType

  // Step 2: Location & contact
  country: string
  region: string
  city: string
  address: string
  phone: string
  website: string

  // Step 3: Operations
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

const STEPS = [
  { num: 1, label: "Organization" },
  { num: 2, label: "Location" },
  { num: 3, label: "Operations" },
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
    propertyType: "guesthouse",
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
        router.push("/dashboard")
        return
      }

      // Pre-fill from user metadata
      const metaPropertyType = user.user_metadata?.property_type as PropertyType | undefined
      const metaPartnerType = user.user_metadata?.partner_type || "accommodation"
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.organization_name || "",
        type: metaPartnerType,
        propertyType: metaPropertyType || (metaPartnerType === "tour_operator" ? "tour_operator" : "guesthouse"),
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

      // Calculate trial end date
      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS)

      // Create partner
      const { data: newPartner, error: partnerError } = await supabase
        .from("partners")
        .insert({
          name: formData.name,
          type: formData.type,
          property_type: formData.propertyType,
          country: formData.country,
          region: formData.region,
          city: formData.city,
          address: formData.address,
          phone: formData.phone,
          email: userEmail,
          website: formData.website,
          subscription_status: "trialing",
          trial_ends_at: trialEndsAt.toISOString(),
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
        return formData.name.trim() !== ""
      case 2:
        return formData.country !== "" && formData.city.trim() !== ""
      case 3:
        return true
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

        {/* Progress Steps with Labels */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    s.num < step
                      ? "bg-primary text-primary-foreground"
                      : s.num === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.num < step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <span className={`text-xs ${s.num === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
              {s.num < 3 && (
                <div className={`w-12 h-0.5 mx-1 mb-5 ${s.num < step ? "bg-primary" : "bg-muted"}`} />
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
                  Organization Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="premium-input w-full"
                  placeholder={
                    formData.propertyType === "hostel" ? "e.g., Backpackers Paradise"
                    : formData.propertyType === "hotel" ? "e.g., Sunrise Beach Resort"
                    : formData.propertyType === "tour_operator" ? "e.g., Island Adventures Co."
                    : "e.g., Sunset Guesthouse"
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Business Type <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { propertyType: "hostel" as PropertyType, partnerType: "accommodation" as const, label: "Hostel", description: "Hostels, backpacker lodges, dormitories", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                    { propertyType: "guesthouse" as PropertyType, partnerType: "accommodation" as const, label: "Guesthouse", description: "Guesthouses, B&Bs, homestays", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                    { propertyType: "hotel" as PropertyType, partnerType: "accommodation" as const, label: "Hotel & Resort", description: "Hotels, resorts, serviced apartments", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                    { propertyType: "tour_operator" as PropertyType, partnerType: "tour_operator" as const, label: "Tour Operator", description: "Tour companies, activity providers, guides", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  ]).map((option) => (
                    <button
                      key={option.propertyType}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: option.partnerType, propertyType: option.propertyType }))}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.propertyType === option.propertyType
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          formData.propertyType === option.propertyType ? "bg-primary/20" : "bg-muted"
                        }`}>
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{option.label}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Contact */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Location & Contact</h2>
                <p className="text-sm text-muted-foreground">Where can guests find you?</p>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-2">
                  Country <span className="text-red-400">*</span>
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="premium-input w-full"
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
                    className="premium-input w-full"
                    placeholder="e.g., Bangkok"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="premium-input w-full"
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
                  className="premium-input w-full min-h-[80px]"
                  placeholder="Street address, building name, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="premium-input w-full"
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
                    className="premium-input w-full"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Operations + What's Next */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Operations</h2>
                <p className="text-sm text-muted-foreground">
                  Help us tailor your certification experience
                </p>
              </div>

              {formData.type === "accommodation" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="propertySize" className="block text-sm font-medium mb-2">
                      Property Size
                    </label>
                    <select
                      id="propertySize"
                      value={formData.propertySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, propertySize: e.target.value }))}
                      className="premium-input w-full"
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
                      className="premium-input w-full"
                    >
                      <option value="">Select capacity</option>
                      <option value="1-50">1-50 guests</option>
                      <option value="51-200">51-200 guests</option>
                      <option value="201-500">201-500 guests</option>
                      <option value="500+">500+ guests</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="propertySize" className="block text-sm font-medium mb-2">
                      Company Size
                    </label>
                    <select
                      id="propertySize"
                      value={formData.propertySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, propertySize: e.target.value }))}
                      className="premium-input w-full"
                    >
                      <option value="">Select size</option>
                      <option value="solo">Solo operator</option>
                      <option value="small">Small team (2-10)</option>
                      <option value="medium">Medium (11-50)</option>
                      <option value="large">Large (50+)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="guestCapacity" className="block text-sm font-medium mb-2">
                      Monthly Participants
                    </label>
                    <select
                      id="guestCapacity"
                      value={formData.guestCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, guestCapacity: e.target.value }))}
                      className="premium-input w-full"
                    >
                      <option value="">Select volume</option>
                      <option value="1-100">1-100</option>
                      <option value="101-500">101-500</option>
                      <option value="501-2000">501-2000</option>
                      <option value="2000+">2000+</option>
                    </select>
                  </div>
                </div>
              )}

              {/* What's Next Preview */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium text-foreground mb-3">After setup, you will:</p>
                <div className="space-y-2.5">
                  {[
                    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Complete 3 safety certification modules" },
                    { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", text: "Invite and train your team" },
                    { icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", text: "Earn your SOS Safe Certified badge" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
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

        {/* Finish later — less prominent, but doesn't dead-end */}
        {step < 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setStep(3)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip to finish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
