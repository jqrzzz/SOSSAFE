"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PartnerFormData {
  name: string
  type: "accommodation" | "tour_operator"
  country: string
  region: string
  city: string
  address: string
  phone: string
  email: string
  website: string
}

interface ProfileStatus {
  certificationStatus: string | null
  certificationTier: string | null
  teamCount: number
  trainingComplete: number
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    certificationStatus: null,
    certificationTier: null,
    teamCount: 0,
    trainingComplete: 0,
  })
  const router = useRouter()

  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    type: "accommodation",
    country: "",
    region: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  })

  const requiredFields: (keyof PartnerFormData)[] = [
    "name",
    "type",
    "country",
    "city",
    "email",
    "phone",
  ]
  const filledRequired = requiredFields.filter(
    (f) => formData[f]?.trim().length > 0,
  ).length
  const profileCompletion = Math.round((filledRequired / requiredFields.length) * 100)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.organization_name || "",
        type: user.user_metadata?.partner_type || "accommodation",
        email: user.email || "",
      }))

      const { data: membership } = await supabase
        .from("partner_memberships")
        .select("*, partners(*)")
        .eq("user_id", user.id)
        .single()

      if (membership?.partners) {
        const partner = membership.partners as PartnerFormData & { id: string }
        setHasExistingProfile(true)
        setPartnerId(membership.partner_id)
        setFormData({
          name: partner.name || "",
          type: partner.type || "accommodation",
          country: partner.country || "",
          region: partner.region || "",
          city: partner.city || "",
          address: partner.address || "",
          phone: partner.phone || "",
          email: partner.email || "",
          website: partner.website || "",
        })

        // Load status summary
        const [certResult, teamResult, trainingResult] = await Promise.all([
          supabase
            .from("certifications")
            .select("status, certification_tier")
            .eq("partner_id", membership.partner_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from("partner_memberships")
            .select("id", { count: "exact", head: true })
            .eq("partner_id", membership.partner_id)
            .is("removed_at", null),
          supabase
            .from("staff_training_completions")
            .select("user_id")
            .eq("partner_id", membership.partner_id)
            .eq("passed", true),
        ])

        const uniqueTrained = new Set(
          (trainingResult.data || []).map((r) => r.user_id),
        )

        setProfileStatus({
          certificationStatus: certResult.data?.status || null,
          certificationTier: certResult.data?.certification_tier || null,
          teamCount: teamResult.count || 0,
          trainingComplete: uniqueTrained.size,
        })
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      if (hasExistingProfile && partnerId) {
        const { error: updateError } = await supabase
          .from("partners")
          .update({
            name: formData.name,
            type: formData.type,
            country: formData.country,
            region: formData.region,
            city: formData.city,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
          })
          .eq("id", partnerId)

        if (updateError) throw updateError
      } else {
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
            email: formData.email,
            website: formData.website,
          })
          .select()
          .single()

        if (partnerError) throw partnerError

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

        setHasExistingProfile(true)
        setPartnerId(newPartner.id)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: keyof PartnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Partner Profile</h1>
        <p className="text-muted-foreground mt-1">
          {hasExistingProfile
            ? "Manage your organization details"
            : "Set up your organization profile to get started"}
        </p>
      </div>

      {/* Status overview — only for existing profiles */}
      {hasExistingProfile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="glass-card p-4 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground">Profile</p>
            <p className={`text-lg font-bold ${profileCompletion === 100 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
              {profileCompletion}%
            </p>
          </div>
          <Link href="/dashboard/certification" className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
            <p className="text-xs text-muted-foreground">Certification</p>
            <p className={`text-lg font-bold ${
              profileStatus.certificationStatus === "approved"
                ? "text-green-600 dark:text-green-400"
                : profileStatus.certificationStatus === "in_review"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground"
            }`}>
              {profileStatus.certificationStatus === "approved"
                ? "Certified"
                : profileStatus.certificationStatus === "in_review"
                  ? "In Review"
                  : profileStatus.certificationStatus === "pending"
                    ? "In Progress"
                    : "Not Started"}
            </p>
          </Link>
          <Link href="/dashboard/team" className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
            <p className="text-xs text-muted-foreground">Team</p>
            <p className="text-lg font-bold">{profileStatus.teamCount}</p>
          </Link>
          <Link href="/dashboard/team" className="glass-card p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
            <p className="text-xs text-muted-foreground">Trained</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {profileStatus.trainingComplete}
            </p>
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile saved successfully!
          </div>
        )}

        {/* Basic Information */}
        <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Basic Information</h2>
            {profileCompletion < 100 && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                {requiredFields.length - filledRequired} required field{requiredFields.length - filledRequired !== 1 ? "s" : ""} missing
              </span>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="Grand Hotel Bangkok"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Organization Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                updateField("type", e.target.value)
              }
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            >
              <option value="accommodation">Accommodation Provider</option>
              <option value="tour_operator">Tour Operator</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
          <h2 className="font-semibold">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="contact@hotel.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="+66 2 123 4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-2">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="https://www.hotel.com"
            />
          </div>
        </div>

        {/* Location */}
        <div className="glass-card p-6 rounded-lg border border-border/50 space-y-4">
          <h2 className="font-semibold">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="Thailand"
              />
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium mb-2">
                Region / Province
              </label>
              <input
                id="region"
                type="text"
                value={formData.region}
                onChange={(e) => updateField("region", e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="Bangkok"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="Bangkok"
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
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] transition-shadow"
              placeholder="123 Sukhumvit Road, Watthana District"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary-gradient px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 premium-hover disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : hasExistingProfile
                ? "Update Profile"
                : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}
